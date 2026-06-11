import exp from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import User from "../models/User.js";
import { compare } from "bcryptjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { createCrawlJob } from "../controllers/crawlController.js"; 

const { sign } = jwt;

export const commonApp = exp.Router();

// ==========================================
// USER AUTHENTICATION ROUTES
// ==========================================

// Registration
commonApp.post(
  "/users",
  expressAsyncHandler(async (req, res) => {
    const newUser = req.body;

    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid Role" });
    }

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already Exists, pls Login." });
    }

    newUser.password = await bcrypt.hash(newUser.password, 12);

    const newUserDoc = new User(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User Created" });
  }),
);

// Login
commonApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "No user found. Pls register." });
    }
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const signedToken = sign(
      {
        id: user._id,
        email: email,
        role: user.role,
        name: user.name,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", signedToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    let userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ message: "Login success", payload: userObj });
  }),
);

// ==========================================
// CRAWLER CORE ENGINE OPERATIONS
// ==========================================

// 1. CRAWL PLATFORM: Deep Cluster Pipeline (Asynchronous via Kafka)
commonApp.post("/crawl/start", createCrawlJob);

// 2. SCRAPE MODE: Single-Target Extraction (Synchronous & Immediate)
commonApp.post(
  "/scrape",
  expressAsyncHandler(async (req, res) => {
    // High-visibility log statement to ensure the route is running correctly
    console.log("==================================================");
    console.log("📥 [ROUTE MATCHED]: POST /api/scrape");
    console.log("Incoming Body Payload:", req.body);
    console.log("==================================================");

    const { url } = req.body;
    if (!url) {
      console.log("❌ Scrape aborted: Missing target URL string.");
      return res.status(400).json({ message: "Target URL is required for scraping." });
    }

    console.log(`📡 Requesting payload strings from target client: ${url}`);

    // Fetch the single page mimicking browser headers
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 8000 // Cut off long hangs early
    });

    const $ = cheerio.load(data);
    
    // Fix: Clone body structure so destructively removing nodes (.remove()) 
    // doesn't isolate the pointer layout context from our returned strings.
    const bodyClone = $("body").clone();
    bodyClone.find("script, style, noscript, footer, nav, header").remove();

    const scrapedData = {
      url,
      title: $("title").text().trim(),
      metaDescription: $('meta[name="description"]').attr("content") || "",
      h1Headers: $("h1").map((_, el) => $(el).text().trim()).get(),
      cleanTextContent: bodyClone
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 5000) // Limits return overhead payload size
    };

    console.log(`✅ Text processing layout engine successful for: ${url}`);
    console.log(`📦 Payload character length: ${scrapedData.cleanTextContent.length}`);
    console.log("==================================================");

    res.status(200).json({
      message: "Single-target scrape completed successfully.",
      payload: scrapedData
    });
  })
);

// 3. MAP MODE: Domain Endpoint Directory Discovery (Structural Sitemap)
commonApp.post(
  "/map",
  expressAsyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "Host target URL is required for mapping." });
    }

    const targetUrl = new URL(url);
    const hostOrigin = targetUrl.origin;

    // Fetch root host origin to read entry navigation maps
    const { data } = await axios.get(hostOrigin, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" 
      },
      timeout: 6000
    });

    const $ = cheerio.load(data);
    const discoveredEndpoints = new Set();

    // Map out every route path asset relative to this domain host
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      
      if (!href) return;

      if (href.startsWith("/")) {
        // Handle relative paths e.g. /dashboard/analytics
        discoveredEndpoints.add(href.split("?")[0].split("#")[0]);
      } else if (href.startsWith(hostOrigin)) {
        // Handle explicit absolute internal links e.g. https://site.com/about
        const relativePath = href.replace(hostOrigin, "").split("?")[0].split("#")[0];
        if (relativePath.startsWith("/")) {
          discoveredEndpoints.add(relativePath);
        } else {
          discoveredEndpoints.add("/" + relativePath);
        }
      }
    });

    // Clean up empty tracking links out of the set
    discoveredEndpoints.delete("");
    discoveredEndpoints.delete("/");

    res.status(200).json({
      message: "Domain tree layout generated successfully.",
      payload: {
        host: hostOrigin,
        totalRoutesFound: discoveredEndpoints.size,
        endpoints: Array.from(discoveredEndpoints).sort()
      }
    });
  })
);