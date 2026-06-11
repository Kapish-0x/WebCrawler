// // import React, { useState, useEffect, useRef } from 'react';
// // import { Search, RotateCw, ArrowRight, Globe, CheckCircle2, Loader2, Zap, Terminal } from 'lucide-react';

// // const GRID_COLS = 20;
// // const GRID_ROWS = 12;

// // function NoiseGrid() {
// //   return (
// //     <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.035]">
// //       {Array.from({ length: GRID_ROWS }).map((_, r) => (
// //         <div key={r} className="flex">
// //           {Array.from({ length: GRID_COLS }).map((_, c) => (
// //             <div
// //               key={c}
// //               className="flex-1 border border-amber-400/30"
// //               style={{ height: '64px' }}
// //             />
// //           ))}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // function StatusPulse({ status }) {
// //   if (status === 'processing') {
// //     return (
// //       <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
// //         <span className="relative flex h-2 w-2">
// //           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
// //           <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
// //         </span>
// //         Indexing
// //       </span>
// //     );
// //   }
// //   return (
// //     <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
// //       <CheckCircle2 className="w-3 h-3" />
// //       Synced
// //     </span>
// //   );
// // }

// // export default function App() {
// //   const [activeTab, setActiveTab] = useState('crawl');
// //   const [inputValue, setInputValue] = useState('');
// //   const [maxDepth, setMaxDepth] = useState(2);
// //   const [jobs, setJobs] = useState([]);
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [statusMessage, setStatusMessage] = useState('');
// //   const [statusType, setStatusType] = useState('info');
// //   const inputRef = useRef(null);

// //   const fetchJobs = async () => {
// //     try {
// //       const res = await fetch('http://localhost:5000/api/jobs');
// //       if (res.ok) {
// //         const data = await res.json();
// //         setJobs(Array.isArray(data) ? data : data ? [data] : []);
// //       }
// //     } catch (err) {
// //       console.error('Queue fetch error:', err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchJobs();
// //     const interval = setInterval(fetchJobs, 2500);
// //     return () => clearInterval(interval);
// //   }, []);

// //   const handleEngineExecute = async (e) => {
// //     e.preventDefault();
// //     if (!inputValue.trim()) return;
// //     setIsLoading(true);
// //     setStatusMessage('');

// //     if (activeTab === 'crawl') {
// //       try {
// //         const response = await fetch('http://localhost:5000/api/crawl/start', {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({ seedUrl: inputValue, maxDepth: Number(maxDepth) }),
// //         });
// //         const data = await response.json();
// //         if (!response.ok) throw new Error(data.error || 'Crawl dispatch failed');
// //         setStatusMessage('Pipeline initialized — workers dispatched.');
// //         setStatusType('success');
// //         setInputValue('');
// //         fetchJobs();
// //       } catch (err) {
// //         setStatusMessage(err.message);
// //         setStatusType('error');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     } else {
// //       try {
// //         const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(inputValue)}`);
// //         const data = await response.json();
// //         if (!response.ok) throw new Error(data.error || 'Elasticsearch cluster error');
// //         setSearchResults(data.results || []);
// //       } catch (err) {
// //         setStatusMessage(err.message);
// //         setStatusType('error');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     }
// //   };

// //   return (
// //     <div
// //       className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden"
// //       style={{ background: '#09090B', fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}
// //     >
// //       {/* Import fonts */}
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
// //         * { box-sizing: border-box; }
// //         ::-webkit-scrollbar { width: 4px; background: transparent; }
// //         ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
// //         ::selection { background: rgba(251,191,36,0.25); }

// //         @keyframes fadeSlideUp {
// //           from { opacity: 0; transform: translateY(16px); }
// //           to   { opacity: 1; transform: translateY(0); }
// //         }
// //         @keyframes scanline {
// //           0%   { transform: translateY(-100%); }
// //           100% { transform: translateY(100vh); }
// //         }
// //         .anim-1 { animation: fadeSlideUp .5s ease both .05s; }
// //         .anim-2 { animation: fadeSlideUp .5s ease both .15s; }
// //         .anim-3 { animation: fadeSlideUp .5s ease both .25s; }
// //         .anim-4 { animation: fadeSlideUp .5s ease both .35s; }

// //         .tab-active  { background: #fbbf24; color: #09090b; }
// //         .tab-inactive { background: transparent; color: #71717a; }
// //         .tab-inactive:hover { color: #a1a1aa; }

// //         .input-console {
// //           background: #111113;
// //           border: 1px solid #27272a;
// //           border-radius: 12px;
// //           transition: border-color .2s;
// //         }
// //         .input-console:focus-within {
// //           border-color: #fbbf24;
// //           box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
// //         }
// //         .depth-select {
// //           background: #18181b;
// //           border: 1px solid #3f3f46;
// //           color: #fbbf24;
// //           border-radius: 6px;
// //           font-family: 'IBM Plex Mono', monospace;
// //           font-size: 11px;
// //           font-weight: 700;
// //           cursor: pointer;
// //           outline: none;
// //           padding: 6px 10px;
// //           letter-spacing: .05em;
// //         }
// //         .depth-select:hover { border-color: #fbbf24; }
// //         .execute-btn {
// //           width: 48px; height: 48px;
// //           background: #fbbf24;
// //           border: none;
// //           border-radius: 10px;
// //           cursor: pointer;
// //           display: flex; align-items: center; justify-content: center;
// //           transition: background .15s, transform .1s;
// //           flex-shrink: 0;
// //         }
// //         .execute-btn:hover  { background: #f59e0b; transform: scale(1.04); }
// //         .execute-btn:active { transform: scale(0.96); }
// //         .execute-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

// //         .job-row {
// //           background: #111113;
// //           border: 1px solid #27272a;
// //           border-radius: 10px;
// //           padding: 14px 18px;
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           transition: border-color .2s;
// //           animation: fadeSlideUp .35s ease both;
// //         }
// //         .job-row:hover { border-color: #3f3f46; }

// //         .result-card {
// //           background: #111113;
// //           border: 1px solid #27272a;
// //           border-radius: 12px;
// //           padding: 20px 22px;
// //           transition: border-color .2s;
// //           animation: fadeSlideUp .3s ease both;
// //         }
// //         .result-card:hover { border-color: #52525b; }

// //         .amber-divider {
// //           width: 32px; height: 2px;
// //           background: #fbbf24;
// //           border-radius: 1px;
// //         }
// //       `}</style>

// //       {/* Grid overlay */}
// //       <NoiseGrid />

// //       {/* Scanline */}
// //       <div
// //         className="pointer-events-none fixed left-0 top-0 w-full h-1 opacity-[0.015]"
// //         style={{
// //           background: 'linear-gradient(transparent, rgba(251,191,36,0.8), transparent)',
// //           animation: 'scanline 8s linear infinite',
// //         }}
// //       />

// //       {/* Content */}
// //       <div className="relative z-10 w-full max-w-2xl px-6 pt-16 pb-32">

// //         {/* Eyebrow */}
// //         <div className="anim-1 flex items-center gap-2 mb-8">
// //           <Terminal className="w-3.5 h-3.5 text-amber-400" />
// //           <span style={{ fontSize: 11, letterSpacing: '.18em', color: '#52525b', fontWeight: 600 }}>
// //             CRAWLER ENGINE — V2.0 ACTIVE
// //           </span>
// //         </div>

// //         {/* Headline */}
// //         <div className="anim-2 mb-10">
// //           <h1 style={{
// //             fontFamily: "'Syne', sans-serif",
// //             fontSize: 'clamp(38px, 6vw, 60px)',
// //             fontWeight: 800,
// //             lineHeight: 1.05,
// //             color: '#fafafa',
// //             letterSpacing: '-0.02em',
// //           }}>
// //             Power AI agents<br />
// //             with{' '}
// //             <span style={{ color: '#fbbf24' }}>clean web data.</span>
// //           </h1>
// //           <div className="amber-divider mt-4 mb-4" />
// //           <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7, maxWidth: 380 }}>
// //             Distributed engine to crawl, index, and interface with target domains at scale.
// //           </p>
// //         </div>

// //         {/* Console Input */}
// //         <form onSubmit={handleEngineExecute} className="anim-3 input-console p-4 mb-4">
// //           {/* Input Row */}
// //           <div className="flex items-center gap-3 px-2 py-3" style={{ borderBottom: '1px solid #1c1c1f' }}>
// //             {activeTab === 'search'
// //               ? <Search style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />
// //               : <Globe  style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />
// //             }
// //             <input
// //               ref={inputRef}
// //               type={activeTab === 'crawl' ? 'url' : 'text'}
// //               required
// //               value={inputValue}
// //               onChange={(e) => setInputValue(e.target.value)}
// //               placeholder={
// //                 activeTab === 'crawl'
// //                   ? 'https://target-domain.com/path'
// //                   : 'Query Elasticsearch index...'
// //               }
// //               style={{
// //                 flex: 1,
// //                 background: 'transparent',
// //                 border: 'none',
// //                 outline: 'none',
// //                 color: '#fafafa',
// //                 fontSize: 14,
// //                 fontFamily: 'inherit',
// //                 fontWeight: 500,
// //               }}
// //               className="placeholder:text-zinc-700"
// //             />
// //             {activeTab === 'crawl' && (
// //               <select
// //                 value={maxDepth}
// //                 onChange={(e) => setMaxDepth(e.target.value)}
// //                 className="depth-select"
// //               >
// //                 <option value={1}>D:01</option>
// //                 <option value={2}>D:02</option>
// //                 <option value={3}>D:03</option>
// //               </select>
// //             )}
// //           </div>

// //           {/* Controls Row */}
// //           <div className="flex items-center justify-between mt-4 px-1">
// //             {/* Tabs */}
// //             <div
// //               className="flex items-center gap-1 p-1 rounded-lg"
// //               style={{ background: '#18181b', border: '1px solid #27272a' }}
// //             >
// //               {[
// //                 { id: 'crawl',  label: 'Crawl',  Icon: RotateCw },
// //                 { id: 'search', label: 'Search', Icon: Search   },
// //               ].map(({ id, label, Icon }) => (
// //                 <button
// //                   key={id}
// //                   type="button"
// //                   onClick={() => { setActiveTab(id); setInputValue(''); setSearchResults([]); }}
// //                   className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all ${
// //                     activeTab === id ? 'tab-active' : 'tab-inactive'
// //                   }`}
// //                   style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', fontFamily: 'inherit' }}
// //                 >
// //                   <Icon style={{ width: 12, height: 12 }} />
// //                   {label.toUpperCase()}
// //                 </button>
// //               ))}
// //             </div>

// //             <button type="submit" disabled={isLoading} className="execute-btn">
// //               {isLoading
// //                 ? <Loader2 style={{ width: 18, height: 18, color: '#09090b', animation: 'spin 1s linear infinite' }} />
// //                 : <ArrowRight style={{ width: 18, height: 18, color: '#09090b', strokeWidth: 2.5 }} />
// //               }
// //             </button>
// //           </div>
// //         </form>

// //         {/* Status Message */}
// //         {statusMessage && (
// //           <div
// //             className="anim-3 flex items-center gap-2 mb-6 px-4 py-3 rounded-lg"
// //             style={{
// //               background: statusType === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
// //               border: `1px solid ${statusType === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
// //               fontSize: 12,
// //               color: statusType === 'error' ? '#f87171' : '#34d399',
// //               fontFamily: 'inherit',
// //               letterSpacing: '.03em',
// //             }}
// //           >
// //             <Zap style={{ width: 13, height: 13, flexShrink: 0 }} />
// //             {statusMessage}
// //           </div>
// //         )}

// //         {/* Results / Jobs */}
// //         <div className="anim-4 space-y-3">

// //           {activeTab === 'crawl' && (
// //             <>
// //               <div className="flex items-center gap-3 mb-4">
// //                 <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#3f3f46', fontWeight: 700 }}>
// //                   CLUSTER PIPELINE
// //                 </span>
// //                 <div style={{ flex: 1, height: 1, background: '#1c1c1f' }} />
// //                 <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.1em' }}>
// //                   {jobs.length} JOB{jobs.length !== 1 ? 'S' : ''}
// //                 </span>
// //               </div>

// //               {jobs.length === 0 ? (
// //                 <div
// //                   className="flex flex-col items-center justify-center py-16 rounded-xl"
// //                   style={{ background: '#111113', border: '1px dashed #27272a' }}
// //                 >
// //                   <Terminal style={{ width: 28, height: 28, color: '#27272a', marginBottom: 12 }} />
// //                   <p style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '.05em' }}>
// //                     No pipeline jobs registered.
// //                   </p>
// //                   <p style={{ fontSize: 11, color: '#27272a', marginTop: 4 }}>
// //                     Submit a seed URL to deploy workers.
// //                   </p>
// //                 </div>
// //               ) : (
// //                 jobs.map((job, index) => (
// //                   <div key={job.jobId || index} className="job-row">
// //                     <div style={{ minWidth: 0 }}>
// //                       <p
// //                         style={{
// //                           fontSize: 13,
// //                           color: '#e4e4e7',
// //                           fontWeight: 600,
// //                           overflow: 'hidden',
// //                           textOverflow: 'ellipsis',
// //                           whiteSpace: 'nowrap',
// //                           maxWidth: 280,
// //                           fontFamily: 'inherit',
// //                         }}
// //                       >
// //                         {job.seedUrl}
// //                       </p>
// //                       <p style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, letterSpacing: '.08em' }}>
// //                         {job.jobId || job._id}
// //                       </p>
// //                     </div>

// //                     <div className="flex items-center gap-4">
// //                       <StatusPulse status={job.status} />
// //                       <div
// //                         style={{
// //                           background: '#18181b',
// //                           border: '1px solid #27272a',
// //                           borderRadius: 6,
// //                           padding: '6px 12px',
// //                           fontSize: 16,
// //                           fontWeight: 700,
// //                           color: '#fbbf24',
// //                           fontFamily: 'inherit',
// //                           minWidth: 52,
// //                           textAlign: 'center',
// //                         }}
// //                       >
// //                         {job.pagesCrawled || 0}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </>
// //           )}

// //           {activeTab === 'search' && searchResults.length > 0 && (
// //             <>
// //               <div className="flex items-center gap-3 mb-4">
// //                 <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#3f3f46', fontWeight: 700 }}>
// //                   SEARCH RESULTS
// //                 </span>
// //                 <div style={{ flex: 1, height: 1, background: '#1c1c1f' }} />
// //                 <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.1em' }}>
// //                   {searchResults.length} MATCH{searchResults.length !== 1 ? 'ES' : ''}
// //                 </span>
// //               </div>

// //               {searchResults.map((item, index) => (
// //                 <div key={item.id || index} className="result-card">
// //                   <div className="flex items-start justify-between gap-4 mb-3">
// //                     <a
// //                       href={item.url}
// //                       target="_blank"
// //                       rel="noreferrer"
// //                       style={{
// //                         fontSize: 13,
// //                         color: '#fbbf24',
// //                         fontWeight: 600,
// //                         textDecoration: 'none',
// //                         overflow: 'hidden',
// //                         textOverflow: 'ellipsis',
// //                         whiteSpace: 'nowrap',
// //                         maxWidth: 360,
// //                         fontFamily: 'inherit',
// //                       }}
// //                     >
// //                       {item.url}
// //                     </a>
// //                     <span
// //                       style={{
// //                         fontSize: 10,
// //                         color: '#52525b',
// //                         fontWeight: 700,
// //                         flexShrink: 0,
// //                         fontFamily: 'inherit',
// //                         letterSpacing: '.05em',
// //                       }}
// //                     >
// //                       {Number(item.score).toFixed(4)}
// //                     </span>
// //                   </div>

// //                   {item.snippets?.map((snippet, sIdx) => (
// //                     <p
// //                       key={sIdx}
// //                       style={{
// //                         fontSize: 12,
// //                         color: '#71717a',
// //                         lineHeight: 1.7,
// //                         borderLeft: '2px solid #27272a',
// //                         paddingLeft: 12,
// //                         fontFamily: 'inherit',
// //                       }}
// //                       dangerouslySetInnerHTML={{
// //                         __html: snippet.replace(
// //                           /<em>/g,
// //                           '<em style="background:rgba(251,191,36,0.15);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 4px;border-radius:3px;">'
// //                         ),
// //                       }}
// //                     />
// //                   ))}
// //                 </div>
// //               ))}
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }







// import React, { useState, useEffect, useRef } from 'react';
// import { Search, RotateCw, ArrowRight, Globe, CheckCircle2, Loader2, Zap, Terminal, FileText, Map } from 'lucide-react';

// const GRID_COLS = 20;
// const GRID_ROWS = 12;

// function NoiseGrid() {
//   return (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.035]">
//       {Array.from({ length: GRID_ROWS }).map((_, r) => (
//         <div key={r} className="flex">
//           {Array.from({ length: GRID_COLS }).map((_, c) => (
//             <div
//               key={c}
//               className="flex-1 border border-amber-400/30"
//               style={{ height: '64px' }}
//             />
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// function StatusPulse({ status }) {
//   if (status === 'processing') {
//     return (
//       <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
//         <span className="relative flex h-2 w-2">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
//           <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
//         </span>
//         Indexing
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
//       <CheckCircle2 className="w-3 h-3" />
//       Synced
//     </span>
//   );
// }

// export default function App() {
//   const [activeTab, setActiveTab] = useState('crawl');
//   const [inputValue, setInputValue] = useState('');
//   const [maxDepth, setMaxDepth] = useState(2);
//   const [jobs, setJobs] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [statusType, setStatusType] = useState('info');
//   const inputRef = useRef(null);

//   // Define global data structure for all 4 distinct modes
//   const modeMatrix = {
//     crawl: { endpoint: 'http://localhost:5000/api/crawl/start', placeholder: 'https://target-domain.com/path' },
//     search: { endpoint: 'http://localhost:5000/api/search', placeholder: 'Query Elasticsearch index...' },
//     scrape: { endpoint: 'http://localhost:5000/api/scrape', placeholder: 'Enter specific target URL to scrape raw text...' },
//     map: { endpoint: 'http://localhost:5000/api/map', placeholder: 'Enter root domain URL to map architectural paths...' }
//   };

//   const fetchJobs = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/jobs');
//       if (res.ok) {
//         const data = await res.json();
//         setJobs(Array.isArray(data) ? data : data ? [data] : []);
//       }
//     } catch (err) {
//       console.error('Queue fetch error:', err.message);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//     const interval = setInterval(fetchJobs, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   const handleEngineExecute = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;
//     setIsLoading(true);
//     setStatusMessage('');

//     try {
//       if (activeTab === 'search') {
//         // GET Route for search index query parameters
//         const response = await fetch(`${modeMatrix.search.endpoint}?q=${encodeURIComponent(inputValue)}`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Elasticsearch cluster error');
//         setSearchResults(data.results || []);
//         setStatusMessage(`Successfully found ${data.results?.length || 0} relative matches.`);
//         setStatusType('success');
//       } else {
//         // POST Cluster router routing for Crawl, Scrape, or Map pipelines
//         let payload = {};
//         if (activeTab === 'crawl') {
//           payload = { seedUrl: inputValue, maxDepth: Number(maxDepth) };
//         } else {
//           payload = { url: inputValue }; // Standardized fallback parameter structure 
//         }

//         const response = await fetch(modeMatrix[activeTab].endpoint, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || `${activeTab.toUpperCase()} routine pipeline initialization failed.`);
        
//         setStatusMessage(`Pipeline [${activeTab.toUpperCase()}] initialized successfully.`);
//         setStatusType('success');
//         setInputValue('');
        
//         if (activeTab === 'crawl') fetchJobs();
//       }
//     } catch (err) {
//       setStatusMessage(err.message);
//       setStatusType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden"
//       style={{ background: '#09090B', fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
//         ::selection { background: rgba(251,191,36,0.25); }

//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes scanline {
//           0%   { transform: translateY(-100%); }
//           100% { transform: translateY(100vh); }
//         }
//         .anim-1 { animation: fadeSlideUp .5s ease both .05s; }
//         .anim-2 { animation: fadeSlideUp .5s ease both .15s; }
//         .anim-3 { animation: fadeSlideUp .5s ease both .25s; }
//         .anim-4 { animation: fadeSlideUp .5s ease both .35s; }

//         .tab-active  { background: #fbbf24; color: #09090b; }
//         .tab-inactive { background: transparent; color: #71717a; }
//         .tab-inactive:hover { color: #a1a1aa; }

//         .input-console {
//           background: #111113;
//           border: 1px solid #27272a;
//           border-radius: 12px;
//           transition: border-color .2s;
//         }
//         .input-console:focus-within {
//           border-color: #fbbf24;
//           box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
//         }
//         .depth-select {
//           background: #18181b;
//           border: 1px solid #3f3f46;
//           color: #fbbf24;
//           border-radius: 6px;
//           font-family: 'IBM Plex Mono', monospace;
//           font-size: 11px;
//           font-weight: 700;
//           cursor: pointer;
//           outline: none;
//           padding: 6px 10px;
//           letter-spacing: .05em;
//         }
//         .depth-select:hover { border-color: #fbbf24; }
//         .execute-btn {
//           width: 48px; height: 48px;
//           background: #fbbf24;
//           border: none;
//           border-radius: 10px;
//           cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           transition: background .15s, transform .1s;
//           flex-shrink: 0;
//         }
//         .execute-btn:hover  { background: #f59e0b; transform: scale(1.04); }
//         .execute-btn:active { transform: scale(0.96); }
//         .execute-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

//         .job-row {
//           background: #111113;
//           border: 1px solid #27272a;
//           border-radius: 10px;
//           padding: 14px 18px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           transition: border-color .2s;
//           animation: fadeSlideUp .35s ease both;
//         }
//         .job-row:hover { border-color: #3f3f46; }

//         .result-card {
//           background: #111113;
//           border: 1px solid #27272a;
//           border-radius: 12px;
//           padding: 20px 22px;
//           transition: border-color .2s;
//           animation: fadeSlideUp .3s ease both;
//         }
//         .result-card:hover { border-color: #52525b; }

//         .amber-divider {
//           width: 32px; height: 2px;
//           background: #fbbf24;
//           border-radius: 1px;
//         }
//       `}</style>

//       <NoiseGrid />

//       <div
//         className="pointer-events-none fixed left-0 top-0 w-full h-1 opacity-[0.015]"
//         style={{
//           background: 'linear-gradient(transparent, rgba(251,191,36,0.8), transparent)',
//           animation: 'scanline 8s linear infinite',
//         }}
//       />

//       <div className="relative z-10 w-full max-w-2xl px-6 pt-16 pb-32">
//         <div className="anim-1 flex items-center gap-2 mb-8">
//           <Terminal className="w-3.5 h-3.5 text-amber-400" />
//           <span style={{ fontSize: 11, letterSpacing: '.18em', color: '#52525b', fontWeight: 600 }}>
//             CRAWLER ENGINE — V2.0 ACTIVE
//           </span>
//         </div>

//         <div className="anim-2 mb-10">
//           <h1 style={{
//             fontFamily: "'Syne', sans-serif",
//             fontSize: 'clamp(38px, 6vw, 60px)',
//             fontWeight: 800,
//             lineHeight: 1.05,
//             color: '#fafafa',
//             letterSpacing: '-0.02em',
//           }}>
//             Power AI agents<br />
//             with{' '}
//             <span style={{ color: '#fbbf24' }}>clean web data.</span>
//           </h1>
//           <div className="amber-divider mt-4 mb-4" />
//           <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7, maxWidth: 380 }}>
//             Distributed engine to crawl, index, and interface with target domains at scale.
//           </p>
//         </div>

//         <form onSubmit={handleEngineExecute} className="anim-3 input-console p-4 mb-4">
//           <div className="flex items-center gap-3 px-2 py-3" style={{ borderBottom: '1px solid #1c1c1f' }}>
//             {activeTab === 'search' && <Search style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
//             {activeTab === 'crawl' && <Globe style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
//             {activeTab === 'scrape' && <FileText style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
//             {activeTab === 'map' && <Map style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
            
//             <input
//               ref={inputRef}
//               type={activeTab === 'search' ? 'text' : 'url'}
//               required
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder={modeMatrix[activeTab]?.placeholder || ''}
//               style={{
//                 flex: 1,
//                 background: 'transparent',
//                 border: 'none',
//                 outline: 'none',
//                 color: '#fafafa',
//                 fontSize: 14,
//                 fontFamily: 'inherit',
//                 fontWeight: 500,
//               }}
//               className="placeholder:text-zinc-700"
//             />
//             {activeTab === 'crawl' && (
//               <select
//                 value={maxDepth}
//                 onChange={(e) => setMaxDepth(e.target.value)}
//                 className="depth-select"
//               >
//                 <option value={1}>D:01</option>
//                 <option value={2}>D:02</option>
//                 <option value={3}>D:03</option>
//               </select>
//             )}
//           </div>

//           <div className="flex items-center justify-between mt-4 px-1 gap-4">
//             {/* Expanded selection list mapping out all 4 pipeline operations */}
//             <div
//               className="flex items-center gap-1 p-1 rounded-lg flex-wrap"
//               style={{ background: '#18181b', border: '1px solid #27272a' }}
//             >
//               {[
//                 { id: 'crawl',  label: 'Crawl',  Icon: RotateCw },
//                 { id: 'search', label: 'Search', Icon: Search   },
//                 { id: 'scrape', label: 'Scrape', Icon: FileText },
//                 { id: 'map',    label: 'Map',    Icon: Map      }
//               ].map(({ id, label, Icon }) => (
//                 <button
//                   key={id}
//                   type="button"
//                   onClick={() => { setActiveTab(id); setInputValue(''); setSearchResults([]); }}
//                   className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-all ${
//                     activeTab === id ? 'tab-active' : 'tab-inactive'
//                   }`}
//                   style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', fontFamily: 'inherit' }}
//                 >
//                   <Icon style={{ width: 12, height: 12 }} />
//                   {label.toUpperCase()}
//                 </button>
//               ))}
//             </div>

//             <button type="submit" disabled={isLoading || !inputValue.trim()} className="execute-btn">
//               {isLoading ? (
//                 <Loader2 style={{ width: 18, height: 18, color: '#09090b', animation: 'spin 1s linear infinite' }} />
//               ) : (
//                 <ArrowRight style={{ width: 18, height: 18, color: '#09090b', strokeWidth: 2.5 }} />
//               )}
//             </button>
//           </div>
//         </form>

//         {statusMessage && (
//           <div
//             className="anim-3 flex items-center gap-2 mb-6 px-4 py-3 rounded-lg"
//             style={{
//               background: statusType === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
//               border: `1px solid ${statusType === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
//               fontSize: 12,
//               color: statusType === 'error' ? '#f87171' : '#34d399',
//               fontFamily: 'inherit',
//               letterSpacing: '.03em',
//             }}
//           >
//             <Zap style={{ width: 13, height: 13, flexShrink: 0 }} />
//             {statusMessage}
//           </div>
//         )}

//         <div className="anim-4 space-y-3">
//           {activeTab === 'crawl' && (
//             <>
//               <div className="flex items-center gap-3 mb-4">
//                 <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#3f3f46', fontWeight: 700 }}>
//                   CLUSTER PIPELINE
//                 </span>
//                 <div style={{ flex: 1, height: 1, background: '#1c1c1f' }} />
//                 <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.1em' }}>
//                   {jobs.length} JOB{jobs.length !== 1 ? 'S' : ''}
//                 </span>
//               </div>

//               {jobs.length === 0 ? (
//                 <div
//                   className="flex flex-col items-center justify-center py-16 rounded-xl"
//                   style={{ background: '#111113', border: '1px dashed #27272a' }}
//                 >
//                   <Terminal style={{ width: 28, height: 28, color: '#27272a', marginBottom: 12 }} />
//                   <p style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '.05em' }}>
//                     No pipeline jobs registered.
//                   </p>
//                   <p style={{ fontSize: 11, color: '#27272a', marginTop: 4 }}>
//                     Submit a seed URL to deploy workers.
//                   </p>
//                 </div>
//               ) : (
//                 jobs.map((job, index) => (
//                   <div key={job.jobId || index} className="job-row">
//                     <div style={{ minWidth: 0 }}>
//                       <p
//                         style={{
//                           fontSize: 13,
//                           color: '#e4e4e7',
//                           fontWeight: 600,
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap',
//                           maxWidth: 280,
//                           fontFamily: 'inherit',
//                         }}
//                       >
//                         {job.seedUrl}
//                       </p>
//                       <p style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, letterSpacing: '.08em' }}>
//                         {job.jobId || job._id}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       <StatusPulse status={job.status} />
//                       <div
//                         style={{
//                           background: '#18181b',
//                           border: '1px solid #27272a',
//                           borderRadius: 6,
//                           padding: '6px 12px',
//                           fontSize: 16,
//                           fontWeight: 700,
//                           color: '#fbbf24',
//                           fontFamily: 'inherit',
//                           minWidth: 52,
//                           textAlign: 'center',
//                         }}
//                       >
//                         {job.pagesCrawled || 0}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </>
//           )}

//           {activeTab === 'search' && searchResults.length > 0 && (
//             <>
//               <div className="flex items-center gap-3 mb-4">
//                 <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#3f3f46', fontWeight: 700 }}>
//                   SEARCH RESULTS
//                 </span>
//                 <div style={{ flex: 1, height: 1, background: '#1c1c1f' }} />
//                 <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.1em' }}>
//                   {searchResults.length} MATCH{searchResults.length !== 1 ? 'ES' : ''}
//                 </span>
//               </div>

//               {searchResults.map((item, index) => (
//                 <div key={item.id || index} className="result-card">
//                   <div className="flex items-start justify-between gap-4 mb-3">
//                     <a
//                       href={item.url}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         fontSize: 13,
//                         color: '#fbbf24',
//                         fontWeight: 600,
//                         textDecoration: 'none',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         whiteSpace: 'nowrap',
//                         maxWidth: 360,
//                         fontFamily: 'inherit',
//                       }}
//                     >
//                       {item.url}
//                     </a>
//                     <span
//                       style={{
//                         fontSize: 10,
//                         color: '#52525b',
//                         fontWeight: 700,
//                         flexShrink: 0,
//                         fontFamily: 'inherit',
//                         letterSpacing: '.05em',
//                       }}
//                     >
//                       {Number(item.score).toFixed(4)}
//                     </span>
//                   </div>

//                   {item.snippets?.map((snippet, sIdx) => (
//                     <p
//                       key={sIdx}
//                       style={{
//                         fontSize: 12,
//                         color: '#71717a',
//                         lineHeight: 1.7,
//                         borderLeft: '2px solid #27272a',
//                         paddingLeft: 12,
//                         fontFamily: 'inherit',
//                       }}
//                       dangerouslySetInnerHTML={{
//                         __html: snippet.replace(
//                           /<em>/g,
//                           '<em style="background:rgba(251,191,36,0.15);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 4px;border-radius:3px;">'
//                         ),
//                       }}
//                     />
//                   ))}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCw, ArrowRight, Globe, CheckCircle2, Loader2, Zap, Terminal, FileText, Map } from 'lucide-react';

const GRID_COLS = 20;
const GRID_ROWS = 12;

function NoiseGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.035]">
      {Array.from({ length: GRID_ROWS }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: GRID_COLS }).map((_, c) => (
            <div
              key={c}
              className="flex-1 border border-amber-400/30"
              style={{ height: '64px' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('crawl');
  const [inputValue, setInputValue] = useState('');
  const [maxDepth, setMaxDepth] = useState(2);
  const [jobs, setJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [scrapedData, setScrapedData] = useState(null);
  const [mappedData, setMappedData] = useState(null);
  const [viewMode, setViewMode] = useState('MARKDOWN'); // View switcher state for Scrape Mode
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info');
  const inputRef = useRef(null);

  // Define global data structure for all 4 distinct modes
  const modeMatrix = {
    crawl: { endpoint: 'http://localhost:5000/api/crawl/start', placeholder: 'https://target-domain.com/path' },
    search: { endpoint: 'http://localhost:5000/api/search', placeholder: 'Query Elasticsearch index...' },
    scrape: { endpoint: 'http://localhost:5000/api/scrape', placeholder: 'Enter specific target URL to scrape raw text...' },
    map: { endpoint: 'http://localhost:5000/api/map', placeholder: 'Enter root domain URL to map architectural paths...' }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data ? [data] : []);
      }
    } catch (err) {
      console.error('Queue fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2500);
    return () => clearInterval(interval);
  }, []);

  // Action callback to let users trigger target extraction directly out of Search Results cards
  const triggerScrapeFromSearch = async (targetUrl) => {
    setIsLoading(true);
    setStatusMessage('');
    setActiveTab('scrape');
    setInputValue(targetUrl);
    setScrapedData(null);

    try {
      const response = await fetch(modeMatrix.scrape.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scrape operation failure from pipeline reference.');
      
      setScrapedData(data.payload || data);
      setStatusMessage(`Pipeline [SCRAPE] initialized successfully via query reference map.`);
      setStatusType('success');
    } catch (err) {
      setStatusMessage(err.message);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEngineExecute = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsLoading(true);
    setStatusMessage('');
    
    // Reset individual localized layout structures upon triggering fresh analysis parameters
    if (activeTab === 'search') setSearchResults([]);
    if (activeTab === 'scrape') setScrapedData(null);
    if (activeTab === 'map') setMappedData(null);

    try {
      if (activeTab === 'search') {
        // GET Route for search index query parameters
        const response = await fetch(`${modeMatrix.search.endpoint}?q=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Elasticsearch cluster error');
        setSearchResults(data.results || []);
        setStatusMessage(`Successfully found ${data.results?.length || 0} relative matches.`);
        setStatusType('success');
      } else {
        // POST Cluster router routing for Crawl, Scrape, or Map pipelines
        let payload = {};
        if (activeTab === 'crawl') {
          payload = { seedUrl: inputValue, maxDepth: Number(maxDepth) };
        } else {
          payload = { url: inputValue }; // Standardized fallback parameter structure 
        }

        const response = await fetch(modeMatrix[activeTab].endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `${activeTab.toUpperCase()} routine pipeline initialization failed.`);
        
        setStatusMessage(`Pipeline [${activeTab.toUpperCase()}] initialized successfully.`);
        setStatusType('success');

        // Map data returns payload to state, scrape returns payload, crawl resets terminal bar
        if (activeTab === 'scrape') {
          setScrapedData(data.payload || data);
        } else if (activeTab === 'map') {
          setMappedData(data.payload || data);
        } else if (activeTab === 'crawl') {
          setInputValue('');
          fetchJobs();
        }
      }
    } catch (err) {
      setStatusMessage(err.message);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{ background: '#09090B', fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
        ::selection { background: rgba(251,191,36,0.25); }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .anim-1 { animation: fadeSlideUp .5s ease both .05s; }
        .anim-2 { animation: fadeSlideUp .5s ease both .15s; }
        .anim-3 { animation: fadeSlideUp .5s ease both .25s; }
        .anim-4 { animation: fadeSlideUp .5s ease both .35s; }

        .tab-active  { background: #fbbf24; color: #09090b; }
        .tab-inactive { background: transparent; color: #71717a; }
        .tab-inactive:hover { color: #a1a1aa; }

        .input-console {
          background: #111113;
          border: 1px solid #27272a;
          border-radius: 12px;
          transition: border-color .2s;
        }
        .input-console:focus-within {
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
        }
        .depth-select {
          background: #18181b;
          border: 1px solid #3f3f46;
          color: #fbbf24;
          border-radius: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          padding: 6px 10px;
          letter-spacing: .05em;
        }
        .depth-select:hover { border-color: #fbbf24; }
        .execute-btn {
          width: 48px; height: 48px;
          background: #fbbf24;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s, transform .1s;
          flex-shrink: 0;
        }
        .execute-btn:hover  { background: #f59e0b; transform: scale(1.04); }
        .execute-btn:active { transform: scale(0.96); }
        .execute-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        .result-card {
          background: #111113;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 20px 22px;
          transition: border-color .2s;
          animation: fadeSlideUp .3s ease both;
        }
        .result-card:hover { border-color: #52525b; }

        .amber-divider {
          width: 32px; height: 2px;
          background: #fbbf24;
          border-radius: 1px;
        }
      `}</style>

      <NoiseGrid />

      <div
        className="pointer-events-none fixed left-0 top-0 w-full h-1 opacity-[0.015]"
        style={{
          background: 'linear-gradient(transparent, rgba(251,191,36,0.8), transparent)',
          animation: 'scanline 8s linear infinite',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl px-6 pt-16 pb-32">
        <div className="anim-1 flex items-center gap-2 mb-8">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span style={{ fontSize: 11, letterSpacing: '.18em', color: '#52525b', fontWeight: 600 }}>
            CRAWLER ENGINE — V2.0 ACTIVE
          </span>
        </div>

        <div className="anim-2 mb-10">
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(38px, 6vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#fafafa',
            letterSpacing: '-0.02em',
          }}>
            Power AI agents<br />
            with{' '}
            <span style={{ color: '#fbbf24' }}>clean web data.</span>
          </h1>
          <div className="amber-divider mt-4 mb-4" />
          <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7, maxWidth: 380 }}>
            Distributed engine to crawl, index, and interface with target domains at scale.
          </p>
        </div>

        <form onSubmit={handleEngineExecute} className="anim-3 input-console p-4 mb-4">
          <div className="flex items-center gap-3 px-2 py-3">
            {activeTab === 'search' && <Search style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
            {activeTab === 'crawl' && <Globe style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
            {activeTab === 'scrape' && <FileText style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
            {activeTab === 'map' && <Map style={{ width: 16, height: 16, color: '#52525b', flexShrink: 0 }} />}
            
            <input
              ref={inputRef}
              type={activeTab === 'search' ? 'text' : 'url'}
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={modeMatrix[activeTab]?.placeholder || ''}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fafafa',
                fontSize: 14,
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
              className="placeholder:text-zinc-700"
            />

            {activeTab === 'crawl' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Depth</span>
                <select 
                  value={maxDepth} 
                  onChange={(e) => setMaxDepth(e.target.value)}
                  className="depth-select"
                >
                  <option value={1}>01</option>
                  <option value={2}>02</option>
                  <option value={3}>03</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 px-1 gap-4">
            <div
              className="flex items-center gap-1 p-1 rounded-lg flex-wrap"
              style={{ background: '#18181b', border: '1px solid #27272a' }}
            >
              {[
                { id: 'crawl',  label: 'Crawl',  Icon: RotateCw },
                { id: 'search', label: 'Search', Icon: Search   },
                { id: 'scrape', label: 'Scrape', Icon: FileText },
                { id: 'map',    label: 'Map',    Icon: Map      }
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { 
                    setActiveTab(id); 
                    setInputValue(''); 
                    setSearchResults([]);
                    setScrapedData(null);
                    setMappedData(null);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-all ${
                    activeTab === id ? 'tab-active' : 'tab-inactive'
                  }`}
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', fontFamily: 'inherit' }}
                >
                  <Icon style={{ width: 12, height: 12 }} />
                  {label.toUpperCase()}
                </button>
              ))}
            </div>

            <button type="submit" disabled={isLoading || !inputValue.trim()} className="execute-btn">
              {isLoading ? (
                <Loader2 style={{ width: 18, height: 18, color: '#09090b', animation: 'spin 1s linear infinite' }} />
              ) : (
                <ArrowRight style={{ width: 18, height: 18, color: '#09090b', strokeWidth: 2.5 }} />
              )}
            </button>
          </div>
        </form>

        {statusMessage && (
          <div
            className="anim-3 flex items-center gap-2 mb-6 px-4 py-3 rounded-lg"
            style={{
              background: statusType === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
              border: `1px solid ${statusType === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
              fontSize: 12,
              color: statusType === 'error' ? '#f87171' : '#34d399',
              fontFamily: 'inherit',
              letterSpacing: '.03em',
            }}
          >
            <Zap style={{ width: 13, height: 13, flexShrink: 0 }} />
            {statusMessage}
          </div>
        )}

        {/* OUTPUT MATRIX VISUALIZATION SYSTEM BOARD */}
        <div className="anim-4 space-y-3">
          
          {/* A. CRAWL TAB CONTAINER (Matches Firecrawl Pipeline Interface Layout) */}
          {activeTab === 'crawl' && (
            <>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#52525b', fontWeight: 700, fontFamily: 'inherit' }}>
                  CLUSTER PIPELINE
                </span>
                <div className="flex-1 mx-4 border-t border-dashed border-zinc-900" />
                <span style={{ fontSize: 10, color: '#52525b', letterSpacing: '.1em', fontWeight: 700, fontFamily: 'inherit' }}>
                  {jobs.length} JOB{jobs.length !== 1 ? 'S' : ''}
                </span>
              </div>

              {jobs.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 rounded-xl"
                  style={{ background: '#111113', border: '1px dashed #27272a' }}
                >
                  <Terminal className="w-10 h-10 text-zinc-800 mb-3" />
                  <p style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '.05em' }}>
                    No pipeline jobs registered.
                  </p>
                  <p style={{ fontSize: 11, color: '#27272a', marginTop: 4 }}>
                    Submit a seed URL to deploy workers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {jobs.map((job, index) => {
                    const isProcessing = job.status === 'processing' || !job.status;
                    
                    return (
                      <div 
                        key={job.jobId || index} 
                        className="border border-zinc-900 bg-[#111113]/60 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-zinc-800 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 
                            className="text-white font-bold text-sm truncate"
                            style={{ letterSpacing: '0.01em' }}
                          >
                            {job.seedUrl}
                          </h3>
                          <p 
                            className="font-mono text-[11px] text-zinc-700 mt-1 select-all truncate max-w-[340px]"
                            style={{ letterSpacing: '0.02em' }}
                          >
                            {job.jobId || job._id || "unknown-node-hash"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3.5 flex-shrink-0">
                          {isProcessing ? (
                            <div className="inline-flex items-center gap-1.5 bg-[#fbbf24]/5 border border-[#fbbf24]/20 text-[#fbbf24] font-mono text-[10px] font-extrabold px-3 py-1 rounded-md tracking-widest uppercase">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                              </span>
                              Indexing
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-[#10b981]/5 border border-[#10b981]/20 text-[#34d399] font-mono text-[10px] font-extrabold px-3 py-1 rounded-md tracking-widest uppercase">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                              Synced
                            </div>
                          )}

                          <div
                            className="bg-[#18181b] border border-zinc-900 text-amber-400 font-mono text-sm font-bold rounded-lg flex items-center justify-center min-w-[48px] h-9 px-2"
                            style={{ textShadow: '0 0 12px rgba(251,191,36,0.15)' }}
                          >
                            {job.pagesCrawled || 0}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* B. SEARCH TAB CONTAINER */}
          {activeTab === 'search' && searchResults.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#3f3f46', fontWeight: 700 }}>
                  SEARCH RESULTS
                </span>
                <div style={{ flex: 1, height: 1, background: '#1c1c1f' }} />
                <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.1em' }}>
                  {searchResults.length} MATCH{searchResults.length !== 1 ? 'ES' : ''}
                </span>
              </div>

              {searchResults.map((item, index) => (
                <div key={item.id || index} className="result-card flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div style={{ minWidth: 0 }}>
                      <span className="text-amber-400 font-mono text-xs font-bold mr-2">#{index + 1}</span>
                      <h3 className="text-zinc-100 font-medium text-sm inline-block truncate max-w-[280px]">{item.title || "Untitled Extraction Index"}</h3>
                      <p className="text-[11px] font-mono text-zinc-500 mt-0.5 break-all select-all">{item.url}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => triggerScrapeFromSearch(item.url)}
                      className="border border-zinc-800 hover:border-amber-400/50 hover:bg-zinc-900/50 text-zinc-400 hover:text-amber-400 text-[10px] font-mono py-1 px-2.5 rounded uppercase tracking-wider transition-all flex-shrink-0"
                    >
                      Scrape page
                    </button>
                  </div>

                  {item.snippets?.map((snippet, sIdx) => (
                    <div 
                      key={sIdx} 
                      className="bg-black/40 border border-zinc-900 rounded-md p-3 font-mono text-xs text-zinc-400 leading-relaxed"
                    >
                      <span className="text-zinc-600 font-bold">"description": </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: snippet.replace(
                            /<em>/g,
                            '<em style="background:rgba(251,191,36,0.15);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 2px;border-radius:2px;">'
                          ),
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* C. SCRAPE TAB CONTAINER */}
          {activeTab === 'scrape' && scrapedData && (
            <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden mt-2">
              <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex flex-col gap-1">
                <span className="text-[10px] text-amber-400 font-mono tracking-widest font-bold uppercase">Extracted Node Core</span>
                <h2 className="text-zinc-200 font-medium text-sm truncate">{scrapedData.title || "Target Extraction"}</h2>
                <p className="text-[11px] font-mono text-zinc-600 break-all">{scrapedData.url}</p>
              </div>

              {/* Layout Switch Controls */}
              <div className="flex border-b border-zinc-900 bg-black/20 font-mono text-[11px] font-bold tracking-wider">
                <button
                  type="button"
                  onClick={() => setViewMode('MARKDOWN')}
                  className={`px-4 py-2.5 border-r border-zinc-900 transition-colors uppercase ${viewMode === 'MARKDOWN' ? 'text-amber-400 bg-zinc-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  📝 Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('JSON')}
                  className={`px-4 py-2.5 transition-colors uppercase ${viewMode === 'JSON' ? 'text-amber-400 bg-zinc-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {"{ }"} JSON Node
                </button>
              </div>

              {/* Data Panel Canvas Container */}
              <div className="p-4 bg-black/60 max-h-[450px] overflow-y-auto text-xs text-zinc-300 font-mono leading-relaxed selection:bg-amber-400/20">
                {viewMode === 'MARKDOWN' ? (
                  <div className="whitespace-pre-wrap">
                    <span className="text-amber-400 font-bold block text-sm mb-2"># {scrapedData.title}</span>
                    {scrapedData.metaDescription && (
                      <p className="text-zinc-500 italic mb-4 border-l border-zinc-800 pl-3">{scrapedData.metaDescription}</p>
                    )}
                    {scrapedData.h1Headers && scrapedData.h1Headers.length > 0 && (
                      <div className="my-3 text-zinc-100 font-semibold space-y-1">
                        {scrapedData.h1Headers.map((h1, i) => <span key={i} className="block text-zinc-400">## {h1}</span>)}
                      </div>
                    )}
                    <p className="text-zinc-400 leading-relaxed pt-2 border-t border-zinc-900/60">{scrapedData.cleanTextContent || "No parsed textual string assets located inside web layout."}</p>
                  </div>
                ) : (
                  <pre className="text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(scrapedData, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* D. MAP TAB CONTAINER */}
          {activeTab === 'map' && mappedData && (
            <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden mt-2">
              <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono tracking-widest font-bold uppercase block mb-0.5">Architecture Matrix</span>
                  <h2 className="text-zinc-200 font-medium font-mono text-sm">{mappedData.host || "Endpoint Tree"}</h2>
                  <p className="text-[11px] font-mono text-zinc-600 mt-0.5">{(mappedData.endpoints || mappedData.discoveredEndpoints)?.length || 0} relative links cataloged</p>
                </div>
                <span className="bg-zinc-900 text-zinc-500 border border-zinc-800 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-widest">
                  Map List
                </span>
              </div>

              <div className="p-3 bg-black/60 font-mono text-[12px] max-h-[380px] overflow-y-auto space-y-1">
                {((mappedData.endpoints || mappedData.discoveredEndpoints) && (mappedData.endpoints || mappedData.discoveredEndpoints).length > 0) ? (
                  (mappedData.endpoints || mappedData.discoveredEndpoints).map((path, idx) => (
                    <div key={idx} className="flex gap-4 py-0.5 hover:bg-zinc-900/30 px-2 rounded group transition-colors">
                      <span className="text-zinc-700 text-right w-6 select-none font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="text-zinc-400 group-hover:text-amber-400 transition-colors break-all">
                        {path.startsWith('http') ? path : `${mappedData.host || ''}${path}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 italic py-6 text-center text-xs">No active directory sub-routing paths parsed.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}