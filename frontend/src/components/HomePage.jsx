import React from 'react';
import { ArrowRight, Database, Terminal, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ 
      background: '#09090B', 
      minHeight: '100vh', 
      fontFamily: "'IBM Plex Mono', monospace", 
      color: '#fafafa',
      padding: '80px 32px' 
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          <h1 style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontSize: 56, 
            fontWeight: 800, 
            marginBottom: 24,
            lineHeight: 1.1 
          }}>
            Engineered for <br/> 
            <span style={{ color: '#fbbf24' }}>Deep Crawling.</span>
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', maxWidth: 600, margin: '0 auto 32px' }}>
            The infrastructure layer for AI-ready data. High-fidelity extraction, 
            instant synchronization, and total control over your web telemetry.
          </p>
          <a href="/dashboard" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fafafa', color: '#09090B', padding: '12px 24px', 
            borderRadius: 8, fontWeight: 700, textDecoration: 'none' 
          }}>
            Enter Engine Room <ArrowRight size={16} />
          </a>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { icon: <Database size={20}/>, title: "Structured P2P", desc: "Decentralized node networking for resilient crawling." },
            { icon: <Terminal size={20}/>, title: "Telemetry Sync", desc: "Real-time stream monitoring and job inspection." },
            { icon: <Shield size={20}/>, title: "Encrypted Data", desc: "AES-256 standard encryption for all extracted data." }
          ].map((item, i) => (
            <div key={i} style={{ 
              background: '#111113', border: '1px solid #1c1c1f', 
              borderRadius: 12, padding: 24 
            }}>
              <div style={{ color: '#fbbf24', marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 14, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: '#52525b' }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}