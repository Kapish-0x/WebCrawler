// import React, { useState, useEffect, useRef } from 'react';
// import { Search, RotateCw, ArrowRight, Globe, FileText, Map, Terminal, Zap, Loader2 } from 'lucide-react';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('crawl');
//   const [inputValue, setInputValue] = useState('');
//   const [maxDepth, setMaxDepth] = useState(2);
//   const [jobs, setJobs] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [scrapedData, setScrapedData] = useState(null);
//   const [mappedData, setMappedData] = useState(null);
//   const [viewMode, setViewMode] = useState('MARKDOWN');
//   const [isLoading, setIsLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [statusType, setStatusType] = useState('info');
//   const inputRef = useRef(null);

//   const modeMatrix = {
//     crawl:  { endpoint: 'http://localhost:5000/api/crawl/start', placeholder: 'https://target-domain.com/path',              inputType: 'url'  },
//     search: { endpoint: 'http://localhost:5000/api/search',       placeholder: 'Query Elasticsearch index...',               inputType: 'text' },
//     scrape: { endpoint: 'http://localhost:5000/api/scrape',       placeholder: 'Enter target URL to scrape raw text...',     inputType: 'url'  },
//     map:    { endpoint: 'http://localhost:5000/api/map',          placeholder: 'Enter root domain URL to map paths...',      inputType: 'url'  },
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

//   const triggerScrapeFromSearch = async (targetUrl) => {
//     setIsLoading(true);
//     setStatusMessage('');
//     setActiveTab('scrape');
//     setInputValue(targetUrl);
//     setScrapedData(null);
//     try {
//       const response = await fetch(modeMatrix.scrape.endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url: targetUrl }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Scrape operation failure.');
//       setScrapedData(data.payload || data);
//       setStatusMessage('Pipeline [SCRAPE] initialized successfully via query reference map.');
//       setStatusType('success');
//     } catch (err) {
//       setStatusMessage(err.message);
//       setStatusType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEngineExecute = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;
//     setIsLoading(true);
//     setStatusMessage('');
//     if (activeTab === 'search') setSearchResults([]);
//     if (activeTab === 'scrape') setScrapedData(null);
//     if (activeTab === 'map') setMappedData(null);

//     try {
//       if (activeTab === 'search') {
//         const response = await fetch(`${modeMatrix.search.endpoint}?q=${encodeURIComponent(inputValue)}`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Elasticsearch cluster error');
//         setSearchResults(data.results || []);
//         setStatusMessage(`Successfully found ${data.results?.length || 0} relative matches.`);
//         setStatusType('success');
//       } else {
//         let payload = activeTab === 'crawl'
//           ? { seedUrl: inputValue, maxDepth: Number(maxDepth) }
//           : { url: inputValue };
//         const response = await fetch(modeMatrix[activeTab].endpoint, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || `${activeTab.toUpperCase()} pipeline failed.`);
//         setStatusMessage(`Pipeline [${activeTab.toUpperCase()}] initialized successfully.`);
//         setStatusType('success');
//         if (activeTab === 'scrape') setScrapedData(data.payload || data);
//         else if (activeTab === 'map') setMappedData(data.payload || data);
//         else if (activeTab === 'crawl') { setInputValue(''); fetchJobs(); }
//       }
//     } catch (err) {
//       setStatusMessage(err.message);
//       setStatusType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const switchTab = (id) => {
//     setActiveTab(id);
//     setInputValue('');
//     setSearchResults([]);
//     setScrapedData(null);
//     setMappedData(null);
//     setStatusMessage('');
//   };

//   return (
//     <div
//       className="relative w-full min-h-screen flex flex-col items-center justify-start"
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
//         @keyframes pulseDot {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50%       { opacity: 0.4; transform: scale(0.7); }
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .anim-1 { animation: fadeSlideUp .5s ease both .05s; }
//         .anim-2 { animation: fadeSlideUp .5s ease both .15s; }
//         .anim-3 { animation: fadeSlideUp .5s ease both .25s; }
//         .anim-4 { animation: fadeSlideUp .5s ease both .35s; }

//         .console-wrap {
//           background: #0d0d0f;
//           border: 1px solid #27272a;
//           border-radius: 14px;
//           overflow: hidden;
//           transition: border-color .2s;
//         }
//         .console-wrap:focus-within {
//           border-color: #fbbf24;
//           box-shadow: 0 0 0 3px rgba(251,191,36,0.06);
//         }
//         .console-input {
//           flex: 1;
//           background: transparent;
//           border: none;
//           outline: none;
//           color: #fafafa;
//           font-size: 13px;
//           font-family: inherit;
//           font-weight: 400;
//         }
//         .console-input::placeholder { color: #3f3f46; }

//         .tab-active   { background: #fbbf24; color: #09090b; }
//         .tab-inactive { background: transparent; color: #52525b; }
//         .tab-inactive:hover { color: #a1a1aa; background: #18181b; }

//         .depth-select {
//           background: #18181b;
//           border: 1px solid #3f3f46;
//           color: #fbbf24;
//           border-radius: 5px;
//           font-family: 'IBM Plex Mono', monospace;
//           font-size: 11px;
//           font-weight: 700;
//           cursor: pointer;
//           outline: none;
//           padding: 4px 8px;
//         }
//         .depth-select:hover { border-color: #fbbf24; }

//         .run-btn {
//           width: 36px; height: 36px;
//           background: #fbbf24;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//           transition: background .15s, transform .1s;
//         }
//         .run-btn:hover  { background: #f59e0b; transform: scale(1.05); }
//         .run-btn:active { transform: scale(0.95); }
//         .run-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }

//         .stat-bar {
//           display: flex;
//           gap: 1px;
//           border-radius: 10px;
//           overflow: hidden;
//           background: #27272a;
//           margin-bottom: 32px;
//         }
//         .stat-cell {
//           flex: 1;
//           background: #111113;
//           padding: 10px 14px;
//         }
//         .stat-label { font-size: 9px; letter-spacing: .15em; color: #3f3f46; font-weight: 700; text-transform: uppercase; margin-bottom: 3px; }
//         .stat-val   { font-size: 17px; font-weight: 700; color: #fbbf24; }

//         .result-card {
//           background: #111113;
//           border: 1px solid #1c1c1f;
//           border-radius: 12px;
//           padding: 16px 18px;
//           margin-bottom: 8px;
//           transition: border-color .2s;
//           animation: fadeSlideUp .3s ease both;
//         }
//         .result-card:hover { border-color: #3f3f46; }

//         .job-row {
//           background: #111113;
//           border: 1px solid #1c1c1f;
//           border-radius: 10px;
//           padding: 14px 16px;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           margin-bottom: 8px;
//           transition: border-color .2s;
//         }
//         .job-row:hover { border-color: #3f3f46; }

//         .badge {
//           display: inline-flex; align-items: center; gap: 5px;
//           padding: 3px 8px; border-radius: 5px;
//           font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
//         }
//         .badge-indexing { background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.2); color: #fbbf24; }
//         .badge-synced   { background: rgba(16,185,129,.06);  border: 1px solid rgba(16,185,129,.2); color: #34d399; }
//         .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
//         .badge-dot-pulse { background: #fbbf24; animation: pulseDot 1.2s ease-in-out infinite; }
//         .badge-dot-solid { background: #34d399; }

//         .section-label {
//           font-size: 9px; letter-spacing: .2em; color: #3f3f46; font-weight: 700; text-transform: uppercase;
//           display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
//         }
//         .section-label::after { content: ''; flex: 1; height: 1px; background: #1c1c1f; }

//         .view-tab { padding: 8px 14px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace; background: transparent; border: none; cursor: pointer; transition: all .15s; }
//         .view-tab-active   { color: #fbbf24; border-bottom: 2px solid #fbbf24; }
//         .view-tab-inactive { color: #52525b; }
//         .view-tab-inactive:hover { color: #a1a1aa; }

//         .map-item { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 6px; transition: background .15s; }
//         .map-item:hover { background: #1c1c1f; }
//         .map-item:hover .map-path { color: #fbbf24; }
//         .map-path { font-size: 11px; color: #52525b; word-break: break-all; transition: color .15s; }

//         .scrape-btn {
//           background: transparent; border: 1px solid #27272a; color: #52525b;
//           font-size: 9px; font-family: 'IBM Plex Mono', monospace; font-weight: 700;
//           letter-spacing: .1em; text-transform: uppercase; padding: 4px 9px;
//           border-radius: 5px; cursor: pointer; flex-shrink: 0; transition: all .2s;
//         }
//         .scrape-btn:hover { border-color: rgba(251,191,36,.4); color: #fbbf24; }
//       `}</style>

//       <div className="relative z-10 w-full max-w-2xl px-6 pt-14 pb-32">

//         {/* Header badge */}
//         <div className="anim-1 flex items-center gap-2 mb-8">
//           <span
//             style={{
//               width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', flexShrink: 0,
//               animation: 'pulseDot 2s ease-in-out infinite', display: 'inline-block',
//             }}
//           />
//           <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#52525b', fontWeight: 700 }}>
//             CRAWLER ENGINE — V2.0 ACTIVE
//           </span>
//         </div>

//         {/* Hero */}
//         <div className="anim-2 mb-8">
//           <h1 style={{
//             fontFamily: "'Syne', sans-serif",
//             fontSize: 'clamp(36px, 6vw, 56px)',
//             fontWeight: 800,
//             lineHeight: 1.05,
//             color: '#fafafa',
//             letterSpacing: '-0.02em',
//             margin: '0 0 14px',
//           }}>
//             Power AI agents<br />
//             with <span style={{ color: '#fbbf24' }}>clean web data.</span>
//           </h1>
//           <p style={{ fontSize: 12, color: '#52525b', lineHeight: 1.8, maxWidth: 360, margin: 0 }}>
//             Distributed engine to crawl, index, and interface with target domains at scale.
//           </p>
//         </div>

//         {/* Live stat bar */}
//         <div className="anim-2 stat-bar">
//           <div className="stat-cell">
//             <div className="stat-label">Pipeline jobs</div>
//             <div className="stat-val">{jobs.length}</div>
//           </div>
//           <div className="stat-cell">
//             <div className="stat-label">Mode</div>
//             <div className="stat-val" style={{ fontSize: 13, paddingTop: 3 }}>{activeTab.toUpperCase()}</div>
//           </div>
//           <div className="stat-cell">
//             <div className="stat-label">Status</div>
//             <div className="stat-val" style={{ fontSize: 13, paddingTop: 3, color: isLoading ? '#fbbf24' : '#34d399' }}>
//               {isLoading ? 'RUNNING' : 'IDLE'}
//             </div>
//           </div>
//         </div>

//         {/* Terminal console input */}
//         <form onSubmit={handleEngineExecute} className="anim-3 console-wrap mb-4">
//           {/* Window chrome */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px 0' }}>
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
//             <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.05em', paddingLeft: 6 }}>
//               crawler ~ {activeTab}
//             </span>
//           </div>

//           {/* Input row */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
//             <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, flexShrink: 0 }}>›_</span>
//             <input
//               ref={inputRef}
//               className="console-input"
//               type={modeMatrix[activeTab].inputType}
//               required
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder={modeMatrix[activeTab].placeholder}
//               autoComplete="off"
//             />
//             {activeTab === 'crawl' && (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
//                 <span style={{ fontSize: 9, color: '#3f3f46', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Depth</span>
//                 <select
//                   className="depth-select"
//                   value={maxDepth}
//                   onChange={(e) => setMaxDepth(e.target.value)}
//                 >
//                   <option value={1}>01</option>
//                   <option value={2}>02</option>
//                   <option value={3}>03</option>
//                 </select>
//               </div>
//             )}
//           </div>

//           {/* Divider */}
//           <div style={{ height: 1, background: '#18181b', margin: '0 16px' }} />

//           {/* Toolbar */}
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: 10 }}>
//             <div style={{ display: 'flex', gap: 2, background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 3 }}>
//               {[
//                 { id: 'crawl',  label: 'Crawl',  Icon: RotateCw },
//                 { id: 'search', label: 'Search', Icon: Search   },
//                 { id: 'scrape', label: 'Scrape', Icon: FileText },
//                 { id: 'map',    label: 'Map',    Icon: Map      },
//               ].map(({ id, label, Icon }) => (
//                 <button
//                   key={id}
//                   type="button"
//                   onClick={() => switchTab(id)}
//                   className={activeTab === id ? 'tab-active' : 'tab-inactive'}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: 5,
//                     padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
//                     fontSize: 10, fontWeight: 700, letterSpacing: '.07em', fontFamily: 'inherit',
//                     transition: 'all .15s',
//                   }}
//                 >
//                   <Icon style={{ width: 11, height: 11 }} />
//                   {label.toUpperCase()}
//                 </button>
//               ))}
//             </div>

//             <button type="submit" disabled={isLoading || !inputValue.trim()} className="run-btn">
//               {isLoading
//                 ? <Loader2 style={{ width: 16, height: 16, color: '#09090b', animation: 'spin 1s linear infinite' }} />
//                 : <ArrowRight style={{ width: 16, height: 16, color: '#09090b', strokeWidth: 2.5 }} />
//               }
//             </button>
//           </div>
//         </form>

//         {/* Status message */}
//         {statusMessage && (
//           <div
//             className="anim-3"
//             style={{
//               display: 'flex', alignItems: 'center', gap: 8,
//               padding: '9px 14px', borderRadius: 8, marginBottom: 20,
//               background: statusType === 'error' ? 'rgba(239,68,68,.07)' : 'rgba(16,185,129,.07)',
//               border: `1px solid ${statusType === 'error' ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'}`,
//               fontSize: 11, color: statusType === 'error' ? '#f87171' : '#34d399', letterSpacing: '.03em',
//             }}
//           >
//             <Zap style={{ width: 12, height: 12, flexShrink: 0 }} />
//             {statusMessage}
//           </div>
//         )}

//         {/* Output area */}
//         <div className="anim-4">

//           {/* A. CRAWL */}
//           {activeTab === 'crawl' && (
//             <>
//               <div className="section-label">{jobs.length} Job{jobs.length !== 1 ? 's' : ''}</div>
//               {jobs.length === 0 ? (
//                 <div style={{
//                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//                   padding: '48px 24px', background: '#0d0d0f', border: '1px dashed #1c1c1f', borderRadius: 12,
//                 }}>
//                   <Terminal style={{ width: 28, height: 28, color: '#27272a', marginBottom: 10 }} />
//                   <p style={{ fontSize: 12, color: '#3f3f46', margin: '0 0 4px', letterSpacing: '.04em' }}>No pipeline jobs registered.</p>
//                   <p style={{ fontSize: 11, color: '#27272a', margin: 0 }}>Submit a seed URL to deploy workers.</p>
//                 </div>
//               ) : (
//                 jobs.map((job, index) => {
//                   const isProcessing = job.status === 'processing' || !job.status;
//                   return (
//                     <div key={job.jobId || index} className="job-row">
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {job.seedUrl}
//                         </div>
//                         <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {job.jobId || job._id || 'unknown-node-hash'}
//                         </div>
//                       </div>
//                       <span className={`badge ${isProcessing ? 'badge-indexing' : 'badge-synced'}`}>
//                         <span className={`badge-dot ${isProcessing ? 'badge-dot-pulse' : 'badge-dot-solid'}`} />
//                         {isProcessing ? 'Indexing' : 'Synced'}
//                       </span>
//                       <div style={{
//                         background: '#18181b', border: '1px solid #27272a', color: '#fbbf24',
//                         fontSize: 13, fontWeight: 700, borderRadius: 7, padding: '4px 10px', minWidth: 40, textAlign: 'center',
//                       }}>
//                         {job.pagesCrawled || 0}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </>
//           )}

//           {/* B. SEARCH */}
//           {activeTab === 'search' && searchResults.length > 0 && (
//             <>
//               <div className="section-label">{searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''}</div>
//               {searchResults.map((item, index) => (
//                 <div key={item.id || index} className="result-card">
//                   <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
//                     <div style={{ minWidth: 0 }}>
//                       <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, marginRight: 6 }}>#{index + 1}</span>
//                       <span style={{ fontSize: 12, color: '#e4e4e7', fontWeight: 500 }}>{item.title || 'Untitled'}</span>
//                       <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, wordBreak: 'break-all' }}>{item.url}</div>
//                     </div>
//                     <button className="scrape-btn" type="button" onClick={() => triggerScrapeFromSearch(item.url)}>
//                       Scrape
//                     </button>
//                   </div>
//                   {item.snippets?.map((snippet, sIdx) => (
//                     <div key={sIdx} style={{
//                       background: '#0a0a0c', border: '1px solid #1c1c1f', borderRadius: 7,
//                       padding: '9px 12px', fontSize: 11, color: '#71717a', lineHeight: 1.7,
//                     }}>
//                       <span style={{ color: '#3f3f46', fontWeight: 700 }}>"description": </span>
//                       <span dangerouslySetInnerHTML={{
//                         __html: snippet.replace(/<em>/g, '<em style="background:rgba(251,191,36,.14);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 3px;border-radius:2px;">'),
//                       }} />
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </>
//           )}

//           {/* C. SCRAPE */}
//           {activeTab === 'scrape' && scrapedData && (
//             <div style={{ background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
//               <div style={{ padding: '14px 18px', borderBottom: '1px solid #1c1c1f' }}>
//                 <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 5 }}>Extracted node core</div>
//                 <div style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scrapedData.title || 'Target Extraction'}</div>
//                 <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, wordBreak: 'break-all' }}>{scrapedData.url}</div>
//               </div>
//               <div style={{ display: 'flex', borderBottom: '1px solid #1c1c1f', background: 'rgba(0,0,0,.3)' }}>
//                 <button className={`view-tab ${viewMode === 'MARKDOWN' ? 'view-tab-active' : 'view-tab-inactive'}`} type="button" onClick={() => setViewMode('MARKDOWN')}>
//                   Markdown
//                 </button>
//                 <button className={`view-tab ${viewMode === 'JSON' ? 'view-tab-active' : 'view-tab-inactive'}`} type="button" onClick={() => setViewMode('JSON')}>
//                   {'{ }'} JSON Node
//                 </button>
//               </div>
//               <div style={{
//                 padding: '14px 18px', background: 'rgba(0,0,0,.5)', maxHeight: 420,
//                 overflowY: 'auto', fontSize: 11, lineHeight: 1.8, fontFamily: 'inherit',
//                 color: viewMode === 'JSON' ? '#34d399' : '#a1a1aa', whiteSpace: 'pre-wrap',
//               }}>
//                 {viewMode === 'MARKDOWN'
//                   ? [
//                       `# ${scrapedData.title || ''}`,
//                       scrapedData.metaDescription ? `\n> ${scrapedData.metaDescription}\n` : '',
//                       ...(scrapedData.h1Headers || []).map(h => `## ${h}`),
//                       '',
//                       scrapedData.cleanTextContent || 'No text content found.',
//                     ].join('\n')
//                   : JSON.stringify(scrapedData, null, 2)
//                 }
//               </div>
//             </div>
//           )}

//           {/* D. MAP */}
//           {activeTab === 'map' && mappedData && (
//             <div style={{ background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #1c1c1f' }}>
//                 <div>
//                   <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>Architecture matrix</div>
//                   <div style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500 }}>{mappedData.host || 'Endpoint tree'}</div>
//                 </div>
//                 <span style={{
//                   background: '#1c1c1f', border: '1px solid #27272a', color: '#52525b',
//                   fontSize: 9, fontFamily: 'inherit', fontWeight: 700, padding: '4px 10px',
//                   borderRadius: 5, letterSpacing: '.1em', textTransform: 'uppercase',
//                 }}>
//                   {(mappedData.endpoints || mappedData.discoveredEndpoints || []).length} paths
//                 </span>
//               </div>
//               <div style={{ padding: 8, maxHeight: 360, overflowY: 'auto', background: 'rgba(0,0,0,.5)' }}>
//                 {(mappedData.endpoints || mappedData.discoveredEndpoints || []).length > 0
//                   ? (mappedData.endpoints || mappedData.discoveredEndpoints).map((path, idx) => {
//                       const full = path.startsWith('http') ? path : `${mappedData.host || ''}${path}`;
//                       return (
//                         <div key={idx} className="map-item">
//                           <span style={{ fontSize: 9, color: '#27272a', fontWeight: 700, minWidth: 20, textAlign: 'right' }}>
//                             {String(idx + 1).padStart(2, '0')}
//                           </span>
//                           <span className="map-path">{full}</span>
//                         </div>
//                       );
//                     })
//                   : <div style={{ textAlign: 'center', padding: '32px', fontSize: 11, color: '#3f3f46', fontStyle: 'italic' }}>No paths discovered.</div>
//                 }
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }











// import React, { useState, useEffect, useRef } from 'react';
// import { Search, RotateCw, ArrowRight, Globe, FileText, Map, Terminal, Zap, Loader2 } from 'lucide-react';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('crawl');
//   const [inputValue, setInputValue] = useState('');
//   const [maxDepth, setMaxDepth] = useState(2);
//   const [jobs, setJobs] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [scrapedData, setScrapedData] = useState(null);
//   const [mappedData, setMappedData] = useState(null);
//   const [viewMode, setViewMode] = useState('MARKDOWN');
//   const [isLoading, setIsLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [statusType, setStatusType] = useState('info');
//   const inputRef = useRef(null);
//   const leftPanelRef = useRef(null);
//   const rightPanelRef = useRef(null);

//   const modeMatrix = {
//     crawl:  { endpoint: 'http://localhost:5000/api/crawl/start', placeholder: 'https://target-domain.com/path',              inputType: 'url'  },
//     search: { endpoint: 'http://localhost:5000/api/search',       placeholder: 'Query Elasticsearch index...',               inputType: 'text' },
//     scrape: { endpoint: 'http://localhost:5000/api/scrape',       placeholder: 'Enter target URL to scrape raw text...',     inputType: 'url'  },
//     map:    { endpoint: 'http://localhost:5000/api/map',          placeholder: 'Enter root domain URL to map paths...',      inputType: 'url'  },
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

//   // ── Side panel animation effect ──────────────────────────────────────────
//   useEffect(() => {
//     const DATA = [
//       'A3:FF:00:7E','crawling...','GET /path','200 OK','indexed','queue:7',
//       'depth:02','parsing','robots.txt','sitemap.xml','0x4A2F','seed→node',
//       '✓ cached','/api/scrape','workers:4','hash:ab3f','resolve','lookup',
//       '301 redir','chunk:14kb','DOM ready','links:23','extract','pipeline',
//     ];
//     const STATUS = [
//       'WORKER NODE ACTIVE','PIPELINE RUNNING','INDEXING IN PROGRESS',
//       'ELASTICSEARCH SYNC','QUEUE PROCESSING','DATA EXTRACTION',
//       'NODES CONNECTED','CRAWL DEPTH 02','CACHE HIT RATE 94%',
//     ];

//     const panels = [
//       { ref: leftPanelRef.current },
//       { ref: rightPanelRef.current },
//     ];
//     const timers = [];

//     panels.forEach(({ ref: panel }) => {
//       if (!panel) return;
//       const w = panel.offsetWidth;

//       const addStream = () => {
//         const el = document.createElement('div');
//         el.className = 'side-data-stream';
//         el.textContent = DATA[Math.floor(Math.random() * DATA.length)];
//         const dur = 6 + Math.random() * 10;
//         el.style.left = Math.random() * Math.max(10, w - 80) + 'px';
//         el.style.animationDuration = dur + 's';
//         el.style.animationDelay = '-' + (Math.random() * dur) + 's';
//         el.style.opacity = (0.2 + Math.random() * 0.4).toString();
//         panel.appendChild(el);
//         setTimeout(() => el.remove(), dur * 1000 + 500);
//       };

//       const addScan = () => {
//         const el = document.createElement('div');
//         el.className = 'side-scan-line';
//         const dur = 5 + Math.random() * 8;
//         el.style.animationDuration = dur + 's';
//         el.style.animationDelay = '-' + (Math.random() * dur) + 's';
//         panel.appendChild(el);
//         setTimeout(() => el.remove(), dur * 1000 + 500);
//       };

//       const addDot = () => {
//         const el = document.createElement('div');
//         el.className = 'side-hex-node';
//         const dur = 2 + Math.random() * 3;
//         el.style.left = (10 + Math.random() * Math.max(10, w - 20)) + 'px';
//         el.style.top = (5 + Math.random() * 90) + '%';
//         el.style.animationDuration = dur + 's';
//         el.style.animationDelay = '-' + (Math.random() * dur) + 's';
//         panel.appendChild(el);
//         setTimeout(() => el.remove(), 8000);
//       };

//       const addStatus = () => {
//         const el = document.createElement('div');
//         el.className = 'side-status-line';
//         el.textContent = STATUS[Math.floor(Math.random() * STATUS.length)];
//         const dur = 4 + Math.random() * 6;
//         el.style.top = (10 + Math.random() * 80) + '%';
//         el.style.left = '12px';
//         el.style.animationDuration = dur + 's';
//         el.style.animationDelay = '-' + (Math.random() * dur) + 's';
//         panel.appendChild(el);
//         setTimeout(() => el.remove(), dur * 1000 + 500);
//       };

//       const addBlink = () => {
//         const el = document.createElement('div');
//         el.className = 'side-blink';
//         el.textContent = '█';
//         el.style.left = (5 + Math.random() * Math.max(5, w - 15)) + 'px';
//         el.style.top = (5 + Math.random() * 90) + '%';
//         panel.appendChild(el);
//         setTimeout(() => el.remove(), 5000);
//       };

//       for (let i = 0; i < 6; i++) addStream();
//       for (let i = 0; i < 2; i++) addScan();
//       for (let i = 0; i < 5; i++) addDot();
//       for (let i = 0; i < 3; i++) addStatus();
//       for (let i = 0; i < 2; i++) addBlink();

//       timers.push(
//         setInterval(addStream, 1200),
//         setInterval(addScan,   6000),
//         setInterval(addDot,    2500),
//         setInterval(addStatus, 5000),
//         setInterval(addBlink,  3000),
//       );
//     });

//     return () => timers.forEach(clearInterval);
//   }, []);
//   // ─────────────────────────────────────────────────────────────────────────

//   const triggerScrapeFromSearch = async (targetUrl) => {
//     setIsLoading(true);
//     setStatusMessage('');
//     setActiveTab('scrape');
//     setInputValue(targetUrl);
//     setScrapedData(null);
//     try {
//       const response = await fetch(modeMatrix.scrape.endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url: targetUrl }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Scrape operation failure.');
//       setScrapedData(data.payload || data);
//       setStatusMessage('Pipeline [SCRAPE] initialized successfully via query reference map.');
//       setStatusType('success');
//     } catch (err) {
//       setStatusMessage(err.message);
//       setStatusType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEngineExecute = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;
//     setIsLoading(true);
//     setStatusMessage('');
//     if (activeTab === 'search') setSearchResults([]);
//     if (activeTab === 'scrape') setScrapedData(null);
//     if (activeTab === 'map') setMappedData(null);

//     try {
//       if (activeTab === 'search') {
//         const response = await fetch(`${modeMatrix.search.endpoint}?q=${encodeURIComponent(inputValue)}`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Elasticsearch cluster error');
//         setSearchResults(data.results || []);
//         setStatusMessage(`Successfully found ${data.results?.length || 0} relative matches.`);
//         setStatusType('success');
//       } else {
//         let payload = activeTab === 'crawl'
//           ? { seedUrl: inputValue, maxDepth: Number(maxDepth) }
//           : { url: inputValue };
//         const response = await fetch(modeMatrix[activeTab].endpoint, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || `${activeTab.toUpperCase()} pipeline failed.`);
//         setStatusMessage(`Pipeline [${activeTab.toUpperCase()}] initialized successfully.`);
//         setStatusType('success');
//         if (activeTab === 'scrape') setScrapedData(data.payload || data);
//         else if (activeTab === 'map') setMappedData(data.payload || data);
//         else if (activeTab === 'crawl') { setInputValue(''); fetchJobs(); }
//       }
//     } catch (err) {
//       setStatusMessage(err.message);
//       setStatusType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const switchTab = (id) => {
//     setActiveTab(id);
//     setInputValue('');
//     setSearchResults([]);
//     setScrapedData(null);
//     setMappedData(null);
//     setStatusMessage('');
//   };

//   return (
//     <div
//       className="relative w-full min-h-screen flex flex-col items-center justify-start"
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
//         @keyframes pulseDot {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50%       { opacity: 0.4; transform: scale(0.7); }
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .anim-1 { animation: fadeSlideUp .5s ease both .05s; }
//         .anim-2 { animation: fadeSlideUp .5s ease both .15s; }
//         .anim-3 { animation: fadeSlideUp .5s ease both .25s; }
//         .anim-4 { animation: fadeSlideUp .5s ease both .35s; }

//         .console-wrap {
//           background: #0d0d0f;
//           border: 1px solid #27272a;
//           border-radius: 14px;
//           overflow: hidden;
//           transition: border-color .2s;
//         }
//         .console-wrap:focus-within {
//           border-color: #fbbf24;
//           box-shadow: 0 0 0 3px rgba(251,191,36,0.06);
//         }
//         .console-input {
//           flex: 1;
//           background: transparent;
//           border: none;
//           outline: none;
//           color: #fafafa;
//           font-size: 13px;
//           font-family: inherit;
//           font-weight: 400;
//         }
//         .console-input::placeholder { color: #3f3f46; }

//         .tab-active   { background: #fbbf24; color: #09090b; }
//         .tab-inactive { background: transparent; color: #52525b; }
//         .tab-inactive:hover { color: #a1a1aa; background: #18181b; }

//         .depth-select {
//           background: #18181b;
//           border: 1px solid #3f3f46;
//           color: #fbbf24;
//           border-radius: 5px;
//           font-family: 'IBM Plex Mono', monospace;
//           font-size: 11px;
//           font-weight: 700;
//           cursor: pointer;
//           outline: none;
//           padding: 4px 8px;
//         }
//         .depth-select:hover { border-color: #fbbf24; }

//         .run-btn {
//           width: 36px; height: 36px;
//           background: #fbbf24;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//           transition: background .15s, transform .1s;
//         }
//         .run-btn:hover  { background: #f59e0b; transform: scale(1.05); }
//         .run-btn:active { transform: scale(0.95); }
//         .run-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }

//         .stat-bar {
//           display: flex;
//           gap: 1px;
//           border-radius: 10px;
//           overflow: hidden;
//           background: #27272a;
//           margin-bottom: 32px;
//         }
//         .stat-cell {
//           flex: 1;
//           background: #111113;
//           padding: 10px 14px;
//         }
//         .stat-label { font-size: 9px; letter-spacing: .15em; color: #3f3f46; font-weight: 700; text-transform: uppercase; margin-bottom: 3px; }
//         .stat-val   { font-size: 17px; font-weight: 700; color: #fbbf24; }

//         .result-card {
//           background: #111113;
//           border: 1px solid #1c1c1f;
//           border-radius: 12px;
//           padding: 16px 18px;
//           margin-bottom: 8px;
//           transition: border-color .2s;
//           animation: fadeSlideUp .3s ease both;
//         }
//         .result-card:hover { border-color: #3f3f46; }

//         .job-row {
//           background: #111113;
//           border: 1px solid #1c1c1f;
//           border-radius: 10px;
//           padding: 14px 16px;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           margin-bottom: 8px;
//           transition: border-color .2s;
//         }
//         .job-row:hover { border-color: #3f3f46; }

//         .badge {
//           display: inline-flex; align-items: center; gap: 5px;
//           padding: 3px 8px; border-radius: 5px;
//           font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
//         }
//         .badge-indexing { background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.2); color: #fbbf24; }
//         .badge-synced   { background: rgba(16,185,129,.06);  border: 1px solid rgba(16,185,129,.2); color: #34d399; }
//         .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
//         .badge-dot-pulse { background: #fbbf24; animation: pulseDot 1.2s ease-in-out infinite; }
//         .badge-dot-solid { background: #34d399; }

//         .section-label {
//           font-size: 9px; letter-spacing: .2em; color: #3f3f46; font-weight: 700; text-transform: uppercase;
//           display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
//         }
//         .section-label::after { content: ''; flex: 1; height: 1px; background: #1c1c1f; }

//         .view-tab { padding: 8px 14px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace; background: transparent; border: none; cursor: pointer; transition: all .15s; }
//         .view-tab-active   { color: #fbbf24; border-bottom: 2px solid #fbbf24; }
//         .view-tab-inactive { color: #52525b; }
//         .view-tab-inactive:hover { color: #a1a1aa; }

//         .map-item { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 6px; transition: background .15s; }
//         .map-item:hover { background: #1c1c1f; }
//         .map-item:hover .map-path { color: #fbbf24; }
//         .map-path { font-size: 11px; color: #52525b; word-break: break-all; transition: color .15s; }

//         .scrape-btn {
//           background: transparent; border: 1px solid #27272a; color: #52525b;
//           font-size: 9px; font-family: 'IBM Plex Mono', monospace; font-weight: 700;
//           letter-spacing: .1em; text-transform: uppercase; padding: 4px 9px;
//           border-radius: 5px; cursor: pointer; flex-shrink: 0; transition: all .2s;
//         }
//         .scrape-btn:hover { border-color: rgba(251,191,36,.4); color: #fbbf24; }

//         /* ── Side panel animations ── */
//         .side-panel {
//           position: fixed;
//           top: 0;
//           width: calc((100vw - 672px) / 2);
//           height: 100vh;
//           overflow: hidden;
//           pointer-events: none;
//           z-index: 0;
//         }
//         .side-panel.left  { left: 0; }
//         .side-panel.right { right: 0; }

//         @keyframes floatUp {
//           0%   { transform: translateY(100vh); opacity: 0; }
//           10%  { opacity: 1; }
//           90%  { opacity: 1; }
//           100% { transform: translateY(-120px); opacity: 0; }
//         }
//         @keyframes scanLine {
//           0%   { transform: translateY(-100%); opacity: 0; }
//           5%   { opacity: 1; }
//           95%  { opacity: 1; }
//           100% { transform: translateY(100vh); opacity: 0; }
//         }
//         @keyframes blinkText {
//           0%, 49% { opacity: 1; }
//           50%, 100% { opacity: 0; }
//         }
//         @keyframes fadeInOut {
//           0%, 100% { opacity: 0; }
//           20%, 80%  { opacity: 1; }
//         }
//         @keyframes pulseDot2 {
//           0%, 100% { transform: scale(1); opacity: 0.6; }
//           50%       { transform: scale(1.4); opacity: 1; }
//         }
//         @keyframes gridScroll {
//           0%   { background-position: 0 0; }
//           100% { background-position: 0 40px; }
//         }

//         .side-grid-bg {
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px);
//           background-size: 40px 40px;
//           animation: gridScroll 4s linear infinite;
//         }
//         .side-scan-line {
//           position: absolute;
//           left: 0; right: 0;
//           height: 2px;
//           background: linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent);
//           animation: scanLine linear infinite;
//         }
//         .side-data-stream {
//           position: absolute;
//           font-family: 'IBM Plex Mono', monospace;
//           font-size: 9px;
//           font-weight: 600;
//           color: rgba(251,191,36,0.5);
//           white-space: nowrap;
//           letter-spacing: 0.08em;
//           animation: floatUp linear infinite;
//         }
//         .side-hex-node {
//           position: absolute;
//           width: 6px; height: 6px;
//           border-radius: 50%;
//           background: rgba(251,191,36,0.7);
//           animation: pulseDot2 ease-in-out infinite;
//         }
//         .side-status-line {
//           position: absolute;
//           font-family: 'IBM Plex Mono', monospace;
//           font-size: 8px;
//           color: rgba(251,191,36,0.25);
//           letter-spacing: 0.12em;
//           white-space: nowrap;
//           animation: fadeInOut ease-in-out infinite;
//         }
//         .side-blink {
//           position: absolute;
//           font-family: 'IBM Plex Mono', monospace;
//           font-size: 9px;
//           color: rgba(251,191,36,0.4);
//           animation: blinkText 1.2s step-end infinite;
//         }
//         .side-corner { position: absolute; width: 18px; height: 18px; opacity: 0.2; }
//         .side-corner.tl { top: 20px; left: 20px;   border-top: 1px solid #fbbf24;    border-left: 1px solid #fbbf24;  }
//         .side-corner.tr { top: 20px; right: 20px;  border-top: 1px solid #fbbf24;    border-right: 1px solid #fbbf24; }
//         .side-corner.bl { bottom: 20px; left: 20px;  border-bottom: 1px solid #fbbf24; border-left: 1px solid #fbbf24;  }
//         .side-corner.br { bottom: 20px; right: 20px; border-bottom: 1px solid #fbbf24; border-right: 1px solid #fbbf24; }
//         .side-vline {
//           position: absolute; top: 0; bottom: 0; width: 1px;
//           background: linear-gradient(to bottom, transparent, rgba(251,191,36,0.08) 30%, rgba(251,191,36,0.08) 70%, transparent);
//         }
//       `}</style>

//       {/* Left side panel */}
//       <div ref={leftPanelRef} className="side-panel left">
//         <div className="side-grid-bg" />
//         <div className="side-vline" style={{ right: 0 }} />
//         <div className="side-corner tl" />
//         <div className="side-corner bl" />
//       </div>

//       {/* Right side panel */}
//       <div ref={rightPanelRef} className="side-panel right">
//         <div className="side-grid-bg" />
//         <div className="side-vline" style={{ left: 0 }} />
//         <div className="side-corner tr" />
//         <div className="side-corner br" />
//       </div>

//       <div className="relative z-10 w-full max-w-4xl px-6 pt-14 pb-32">

//         {/* Header badge */}
//         <div className="anim-1 flex items-center gap-2 mb-8">
//           <span
//             style={{
//               width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', flexShrink: 0,
//               animation: 'pulseDot 2s ease-in-out infinite', display: 'inline-block',
//             }}
//           />
//           <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#52525b', fontWeight: 700 }}>
//             CRAWLER ENGINE — V2.0 ACTIVE
//           </span>
//         </div>

//         {/* Hero */}
//         <div className="anim-2 mb-8">
//           <h1 style={{
//             fontFamily: "'Syne', sans-serif",
//             fontSize: 'clamp(36px, 6vw, 56px)',
//             fontWeight: 800,
//             lineHeight: 1.05,
//             color: '#fafafa',
//             letterSpacing: '-0.02em',
//             margin: '0 0 14px',
//           }}>
//             Power AI agents<br />
//             with <span style={{ color: '#fbbf24' }}>clean web data.</span>
//           </h1>
//           <p style={{ fontSize: 12, color: '#52525b', lineHeight: 1.8, maxWidth: 360, margin: 0 }}>
//             Distributed engine to crawl, index, and interface with target domains at scale.
//           </p>
//         </div>

//         {/* Live stat bar */}
//         <div className="anim-2 stat-bar">
//           <div className="stat-cell">
//             <div className="stat-label">Pipeline jobs</div>
//             <div className="stat-val">{jobs.length}</div>
//           </div>
//           <div className="stat-cell">
//             <div className="stat-label">Mode</div>
//             <div className="stat-val" style={{ fontSize: 13, paddingTop: 3 }}>{activeTab.toUpperCase()}</div>
//           </div>
//           <div className="stat-cell">
//             <div className="stat-label">Status</div>
//             <div className="stat-val" style={{ fontSize: 13, paddingTop: 3, color: isLoading ? '#fbbf24' : '#34d399' }}>
//               {isLoading ? 'RUNNING' : 'IDLE'}
//             </div>
//           </div>
//         </div>

//         {/* Terminal console input */}
//         <form onSubmit={handleEngineExecute} className="anim-3 console-wrap mb-4">
//           {/* Window chrome */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px 0' }}>
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
//             <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.05em', paddingLeft: 6 }}>
//               crawler ~ {activeTab}
//             </span>
//           </div>

//           {/* Input row */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
//             <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, flexShrink: 0 }}>›_</span>
//             <input
//               ref={inputRef}
//               className="console-input"
//               type={modeMatrix[activeTab].inputType}
//               required
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder={modeMatrix[activeTab].placeholder}
//               autoComplete="off"
//             />
//             {activeTab === 'crawl' && (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
//                 <span style={{ fontSize: 9, color: '#3f3f46', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Depth</span>
//                 <select
//                   className="depth-select"
//                   value={maxDepth}
//                   onChange={(e) => setMaxDepth(e.target.value)}
//                 >
//                   <option value={1}>01</option>
//                   <option value={2}>02</option>
//                   <option value={3}>03</option>
//                 </select>
//               </div>
//             )}
//           </div>

//           {/* Divider */}
//           <div style={{ height: 1, background: '#18181b', margin: '0 16px' }} />

//           {/* Toolbar */}
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: 10 }}>
//             <div style={{ display: 'flex', gap: 2, background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 3 }}>
//               {[
//                 { id: 'crawl',  label: 'Crawl',  Icon: RotateCw },
//                 { id: 'search', label: 'Search', Icon: Search   },
//                 { id: 'scrape', label: 'Scrape', Icon: FileText },
//                 { id: 'map',    label: 'Map',    Icon: Map      },
//               ].map(({ id, label, Icon }) => (
//                 <button
//                   key={id}
//                   type="button"
//                   onClick={() => switchTab(id)}
//                   className={activeTab === id ? 'tab-active' : 'tab-inactive'}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: 5,
//                     padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
//                     fontSize: 10, fontWeight: 700, letterSpacing: '.07em', fontFamily: 'inherit',
//                     transition: 'all .15s',
//                   }}
//                 >
//                   <Icon style={{ width: 11, height: 11 }} />
//                   {label.toUpperCase()}
//                 </button>
//               ))}
//             </div>

//             <button type="submit" disabled={isLoading || !inputValue.trim()} className="run-btn">
//               {isLoading
//                 ? <Loader2 style={{ width: 16, height: 16, color: '#09090b', animation: 'spin 1s linear infinite' }} />
//                 : <ArrowRight style={{ width: 16, height: 16, color: '#09090b', strokeWidth: 2.5 }} />
//               }
//             </button>
//           </div>
//         </form>

//         {/* Status message */}
//         {statusMessage && (
//           <div
//             className="anim-3"
//             style={{
//               display: 'flex', alignItems: 'center', gap: 8,
//               padding: '9px 14px', borderRadius: 8, marginBottom: 20,
//               background: statusType === 'error' ? 'rgba(239,68,68,.07)' : 'rgba(16,185,129,.07)',
//               border: `1px solid ${statusType === 'error' ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'}`,
//               fontSize: 11, color: statusType === 'error' ? '#f87171' : '#34d399', letterSpacing: '.03em',
//             }}
//           >
//             <Zap style={{ width: 12, height: 12, flexShrink: 0 }} />
//             {statusMessage}
//           </div>
//         )}

//         {/* Output area */}
//         <div className="anim-4">

//           {/* A. CRAWL */}
//           {activeTab === 'crawl' && (
//             <>
//               <div className="section-label">{jobs.length} Job{jobs.length !== 1 ? 's' : ''}</div>
//               {jobs.length === 0 ? (
//                 <div style={{
//                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//                   padding: '48px 24px', background: '#0d0d0f', border: '1px dashed #1c1c1f', borderRadius: 12,
//                 }}>
//                   <Terminal style={{ width: 28, height: 28, color: '#27272a', marginBottom: 10 }} />
//                   <p style={{ fontSize: 12, color: '#3f3f46', margin: '0 0 4px', letterSpacing: '.04em' }}>No pipeline jobs registered.</p>
//                   <p style={{ fontSize: 11, color: '#27272a', margin: 0 }}>Submit a seed URL to deploy workers.</p>
//                 </div>
//               ) : (
//                 jobs.map((job, index) => {
//                   const isProcessing = job.status === 'processing' || !job.status;
//                   return (
//                     <div key={job.jobId || index} className="job-row">
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {job.seedUrl}
//                         </div>
//                         <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {job.jobId || job._id || 'unknown-node-hash'}
//                         </div>
//                       </div>
//                       <span className={`badge ${isProcessing ? 'badge-indexing' : 'badge-synced'}`}>
//                         <span className={`badge-dot ${isProcessing ? 'badge-dot-pulse' : 'badge-dot-solid'}`} />
//                         {isProcessing ? 'Indexing' : 'Synced'}
//                       </span>
//                       <div style={{
//                         background: '#18181b', border: '1px solid #27272a', color: '#fbbf24',
//                         fontSize: 13, fontWeight: 700, borderRadius: 7, padding: '4px 10px', minWidth: 40, textAlign: 'center',
//                       }}>
//                         {job.pagesCrawled || 0}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </>
//           )}

//           {/* B. SEARCH */}
//           {activeTab === 'search' && searchResults.length > 0 && (
//             <>
//               <div className="section-label">{searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''}</div>
//               {searchResults.map((item, index) => (
//                 <div key={item.id || index} className="result-card">
//                   <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
//                     <div style={{ minWidth: 0 }}>
//                       <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, marginRight: 6 }}>#{index + 1}</span>
//                       <span style={{ fontSize: 12, color: '#e4e4e7', fontWeight: 500 }}>{item.title || 'Untitled'}</span>
//                       <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, wordBreak: 'break-all' }}>{item.url}</div>
//                     </div>
//                     <button className="scrape-btn" type="button" onClick={() => triggerScrapeFromSearch(item.url)}>
//                       Scrape
//                     </button>
//                   </div>
//                   {item.snippets?.map((snippet, sIdx) => (
//                     <div key={sIdx} style={{
//                       background: '#0a0a0c', border: '1px solid #1c1c1f', borderRadius: 7,
//                       padding: '9px 12px', fontSize: 11, color: '#71717a', lineHeight: 1.7,
//                     }}>
//                       <span style={{ color: '#3f3f46', fontWeight: 700 }}>"description": </span>
//                       <span dangerouslySetInnerHTML={{
//                         __html: snippet.replace(/<em>/g, '<em style="background:rgba(251,191,36,.14);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 3px;border-radius:2px;">'),
//                       }} />
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </>
//           )}

//           {/* C. SCRAPE */}
//           {activeTab === 'scrape' && scrapedData && (
//             <div style={{ background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
//               <div style={{ padding: '14px 18px', borderBottom: '1px solid #1c1c1f' }}>
//                 <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 5 }}>Extracted node core</div>
//                 <div style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scrapedData.title || 'Target Extraction'}</div>
//                 <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, wordBreak: 'break-all' }}>{scrapedData.url}</div>
//               </div>
//               <div style={{ display: 'flex', borderBottom: '1px solid #1c1c1f', background: 'rgba(0,0,0,.3)' }}>
//                 <button className={`view-tab ${viewMode === 'MARKDOWN' ? 'view-tab-active' : 'view-tab-inactive'}`} type="button" onClick={() => setViewMode('MARKDOWN')}>
//                   Markdown
//                 </button>
//                 <button className={`view-tab ${viewMode === 'JSON' ? 'view-tab-active' : 'view-tab-inactive'}`} type="button" onClick={() => setViewMode('JSON')}>
//                   {'{ }'} JSON Node
//                 </button>
//               </div>
//               <div style={{
//                 padding: '14px 18px', background: 'rgba(0,0,0,.5)', maxHeight: 420,
//                 overflowY: 'auto', fontSize: 11, lineHeight: 1.8, fontFamily: 'inherit',
//                 color: viewMode === 'JSON' ? '#34d399' : '#a1a1aa', whiteSpace: 'pre-wrap',
//               }}>
//                 {viewMode === 'MARKDOWN'
//                   ? [
//                       `# ${scrapedData.title || ''}`,
//                       scrapedData.metaDescription ? `\n> ${scrapedData.metaDescription}\n` : '',
//                       ...(scrapedData.h1Headers || []).map(h => `## ${h}`),
//                       '',
//                       scrapedData.cleanTextContent || 'No text content found.',
//                     ].join('\n')
//                   : JSON.stringify(scrapedData, null, 2)
//                 }
//               </div>
//             </div>
//           )}

//           {/* D. MAP */}
//           {activeTab === 'map' && mappedData && (
//             <div style={{ background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #1c1c1f' }}>
//                 <div>
//                   <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>Architecture matrix</div>
//                   <div style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500 }}>{mappedData.host || 'Endpoint tree'}</div>
//                 </div>
//                 <span style={{
//                   background: '#1c1c1f', border: '1px solid #27272a', color: '#52525b',
//                   fontSize: 9, fontFamily: 'inherit', fontWeight: 700, padding: '4px 10px',
//                   borderRadius: 5, letterSpacing: '.1em', textTransform: 'uppercase',
//                 }}>
//                   {(mappedData.endpoints || mappedData.discoveredEndpoints || []).length} paths
//                 </span>
//               </div>
//               <div style={{ padding: 8, maxHeight: 360, overflowY: 'auto', background: 'rgba(0,0,0,.5)' }}>
//                 {(mappedData.endpoints || mappedData.discoveredEndpoints || []).length > 0
//                   ? (mappedData.endpoints || mappedData.discoveredEndpoints).map((path, idx) => {
//                       const full = path.startsWith('http') ? path : `${mappedData.host || ''}${path}`;
//                       return (
//                         <div key={idx} className="map-item">
//                           <span style={{ fontSize: 9, color: '#27272a', fontWeight: 700, minWidth: 20, textAlign: 'right' }}>
//                             {String(idx + 1).padStart(2, '0')}
//                           </span>
//                           <span className="map-path">{full}</span>
//                         </div>
//                       );
//                     })
//                   : <div style={{ textAlign: 'center', padding: '32px', fontSize: 11, color: '#3f3f46', fontStyle: 'italic' }}>No paths discovered.</div>
//                 }
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCw, ArrowRight, Globe, FileText, Map, Terminal, Zap, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('crawl');
  const [inputValue, setInputValue] = useState('');
  const [maxDepth, setMaxDepth] = useState(2);
  const [jobs, setJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [scrapedData, setScrapedData] = useState(null);
  const [mappedData, setMappedData] = useState(null);
  const [viewMode, setViewMode] = useState('MARKDOWN');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info');
  const inputRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const modeMatrix = {
    crawl:  { endpoint: 'http://localhost:5000/api/crawl/start', placeholder: 'https://target-domain.com/path',              inputType: 'url'  },
    search: { endpoint: 'http://localhost:5000/api/search',       placeholder: 'Query Elasticsearch index...',               inputType: 'text' },
    scrape: { endpoint: 'http://localhost:5000/api/scrape',       placeholder: 'Enter target URL to scrape raw text...',     inputType: 'url'  },
    map:    { endpoint: 'http://localhost:5000/api/map',          placeholder: 'Enter root domain URL to map paths...',      inputType: 'url'  },
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

  // ── Side panel animation effect ──────────────────────────────────────────
  useEffect(() => {
    const DATA = [
      'A3:FF:00:7E','crawling...','GET /path','200 OK','indexed','queue:7',
      'depth:02','parsing','robots.txt','sitemap.xml','0x4A2F','seed→node',
      '✓ cached','/api/scrape','workers:4','hash:ab3f','resolve','lookup',
      '301 redir','chunk:14kb','DOM ready','links:23','extract','pipeline',
    ];
    const STATUS = [
      'WORKER NODE ACTIVE','PIPELINE RUNNING','INDEXING IN PROGRESS',
      'ELASTICSEARCH SYNC','QUEUE PROCESSING','DATA EXTRACTION',
      'NODES CONNECTED','CRAWL DEPTH 02','CACHE HIT RATE 94%',
    ];

    const panels = [
      { ref: leftPanelRef.current },
      { ref: rightPanelRef.current },
    ];
    const timers = [];

    panels.forEach(({ ref: panel }) => {
      if (!panel) return;
      const w = panel.offsetWidth;

      const addStream = () => {
        const el = document.createElement('div');
        el.className = 'side-data-stream';
        el.textContent = DATA[Math.floor(Math.random() * DATA.length)];
        const dur = 6 + Math.random() * 10;
        el.style.left = Math.random() * Math.max(10, w - 80) + 'px';
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = '-' + (Math.random() * dur) + 's';
        el.style.opacity = (0.2 + Math.random() * 0.4).toString();
        panel.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000 + 500);
      };

      const addScan = () => {
        const el = document.createElement('div');
        el.className = 'side-scan-line';
        const dur = 5 + Math.random() * 8;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = '-' + (Math.random() * dur) + 's';
        panel.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000 + 500);
      };

      const addDot = () => {
        const el = document.createElement('div');
        el.className = 'side-hex-node';
        const dur = 2 + Math.random() * 3;
        el.style.left = (10 + Math.random() * Math.max(10, w - 20)) + 'px';
        el.style.top = (5 + Math.random() * 90) + '%';
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = '-' + (Math.random() * dur) + 's';
        panel.appendChild(el);
        setTimeout(() => el.remove(), 8000);
      };

      const addStatus = () => {
        const el = document.createElement('div');
        el.className = 'side-status-line';
        el.textContent = STATUS[Math.floor(Math.random() * STATUS.length)];
        const dur = 4 + Math.random() * 6;
        el.style.top = (10 + Math.random() * 80) + '%';
        el.style.left = '12px';
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = '-' + (Math.random() * dur) + 's';
        panel.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000 + 500);
      };

      const addBlink = () => {
        const el = document.createElement('div');
        el.className = 'side-blink';
        el.textContent = '█';
        el.style.left = (5 + Math.random() * Math.max(5, w - 15)) + 'px';
        el.style.top = (5 + Math.random() * 90) + '%';
        panel.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      };

      for (let i = 0; i < 6; i++) addStream();
      for (let i = 0; i < 2; i++) addScan();
      for (let i = 0; i < 5; i++) addDot();
      for (let i = 0; i < 3; i++) addStatus();
      for (let i = 0; i < 2; i++) addBlink();

      timers.push(
        setInterval(addStream, 1200),
        setInterval(addScan,   6000),
        setInterval(addDot,    2500),
        setInterval(addStatus, 5000),
        setInterval(addBlink,  3000),
      );
    });

    return () => timers.forEach(clearInterval);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

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
      if (!response.ok) throw new Error(data.error || 'Scrape operation failure.');
      setScrapedData(data.payload || data);
      setStatusMessage('Pipeline [SCRAPE] initialized successfully via query reference map.');
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
    if (activeTab === 'search') setSearchResults([]);
    if (activeTab === 'scrape') setScrapedData(null);
    if (activeTab === 'map') setMappedData(null);

    try {
      if (activeTab === 'search') {
        const response = await fetch(`${modeMatrix.search.endpoint}?q=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Elasticsearch cluster error');
        setSearchResults(data.results || []);
        setStatusMessage(`Successfully found ${data.results?.length || 0} relative matches.`);
        setStatusType('success');
      } else {
        let payload = activeTab === 'crawl'
          ? { seedUrl: inputValue, maxDepth: Number(maxDepth) }
          : { url: inputValue };
        const response = await fetch(modeMatrix[activeTab].endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `${activeTab.toUpperCase()} pipeline failed.`);
        setStatusMessage(`Pipeline [${activeTab.toUpperCase()}] initialized successfully.`);
        setStatusType('success');
        if (activeTab === 'scrape') setScrapedData(data.payload || data);
        else if (activeTab === 'map') setMappedData(data.payload || data);
        else if (activeTab === 'crawl') { setInputValue(''); fetchJobs(); }
      }
    } catch (err) {
      setStatusMessage(err.message);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (id) => {
    setActiveTab(id);
    setInputValue('');
    setSearchResults([]);
    setScrapedData(null);
    setMappedData(null);
    setStatusMessage('');
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-start"
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
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .anim-1 { animation: fadeSlideUp .5s ease both .05s; }
        .anim-2 { animation: fadeSlideUp .5s ease both .15s; }
        .anim-3 { animation: fadeSlideUp .5s ease both .25s; }
        .anim-4 { animation: fadeSlideUp .5s ease both .35s; }

        .console-wrap {
          background: #0d0d0f;
          border: 1px solid #27272a;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color .2s;
        }
        .console-wrap:focus-within {
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.06);
        }
        .console-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fafafa;
          font-size: 13px;
          font-family: inherit;
          font-weight: 400;
        }
        .console-input::placeholder { color: #3f3f46; }

        .tab-active   { background: #fbbf24; color: #09090b; }
        .tab-inactive { background: transparent; color: #52525b; }
        .tab-inactive:hover { color: #a1a1aa; background: #18181b; }

        .depth-select {
          background: #18181b;
          border: 1px solid #3f3f46;
          color: #fbbf24;
          border-radius: 5px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          padding: 4px 8px;
        }
        .depth-select:hover { border-color: #fbbf24; }

        .run-btn {
          width: 36px; height: 36px;
          background: #fbbf24;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .15s, transform .1s;
        }
        .run-btn:hover  { background: #f59e0b; transform: scale(1.05); }
        .run-btn:active { transform: scale(0.95); }
        .run-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }

        .stat-bar {
          display: flex;
          gap: 1px;
          border-radius: 10px;
          overflow: hidden;
          background: #27272a;
          margin-bottom: 32px;
        }
        .stat-cell {
          flex: 1;
          background: #111113;
          padding: 10px 14px;
        }
        .stat-label { font-size: 9px; letter-spacing: .15em; color: #3f3f46; font-weight: 700; text-transform: uppercase; margin-bottom: 3px; }
        .stat-val   { font-size: 17px; font-weight: 700; color: #fbbf24; }

        .result-card {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 8px;
          transition: border-color .2s;
          animation: fadeSlideUp .3s ease both;
        }
        .result-card:hover { border-color: #3f3f46; }

        .job-row {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 8px;
          transition: border-color .2s;
        }
        .job-row:hover { border-color: #3f3f46; }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 8px; border-radius: 5px;
          font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
        }
        .badge-indexing { background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.2); color: #fbbf24; }
        .badge-synced   { background: rgba(16,185,129,.06);  border: 1px solid rgba(16,185,129,.2); color: #34d399; }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
        .badge-dot-pulse { background: #fbbf24; animation: pulseDot 1.2s ease-in-out infinite; }
        .badge-dot-solid { background: #34d399; }

        .section-label {
          font-size: 9px; letter-spacing: .2em; color: #3f3f46; font-weight: 700; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: #1c1c1f; }

        .view-tab { padding: 8px 14px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace; background: transparent; border: none; cursor: pointer; transition: all .15s; }
        .view-tab-active   { color: #fbbf24; border-bottom: 2px solid #fbbf24; }
        .view-tab-inactive { color: #52525b; }
        .view-tab-inactive:hover { color: #a1a1aa; }

        .map-item { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 6px; transition: background .15s; }
        .map-item:hover { background: #1c1c1f; }
        .map-item:hover .map-path { color: #fbbf24; }
        .map-path { font-size: 11px; color: #52525b; word-break: break-all; transition: color .15s; }

        .scrape-btn {
          background: transparent; border: 1px solid #27272a; color: #52525b;
          font-size: 9px; font-family: 'IBM Plex Mono', monospace; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; padding: 4px 9px;
          border-radius: 5px; cursor: pointer; flex-shrink: 0; transition: all .2s;
        }
        .scrape-btn:hover { border-color: rgba(251,191,36,.4); color: #fbbf24; }

        /* ── Side panel animations ── */
        .side-panel {
          position: fixed;
          top: 0;
          width: calc((100vw - 672px) / 2);
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .side-panel.left  { left: 0; }
        .side-panel.right { right: 0; }

        @keyframes floatUp {
          0%   { transform: translateY(100vh); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
        @keyframes scanLine {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes blinkText {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          20%, 80%  { opacity: 1; }
        }
        @keyframes pulseDot2 {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.4); opacity: 1; }
        }
        @keyframes gridScroll {
          0%   { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }

        .side-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridScroll 4s linear infinite;
        }
        .side-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent);
          animation: scanLine linear infinite;
        }
        .side-data-stream {
          position: absolute;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          color: rgba(251,191,36,0.5);
          white-space: nowrap;
          letter-spacing: 0.08em;
          animation: floatUp linear infinite;
        }
        .side-hex-node {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(251,191,36,0.7);
          animation: pulseDot2 ease-in-out infinite;
        }
        .side-status-line {
          position: absolute;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          color: rgba(251,191,36,0.25);
          letter-spacing: 0.12em;
          white-space: nowrap;
          animation: fadeInOut ease-in-out infinite;
        }
        .side-blink {
          position: absolute;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: rgba(251,191,36,0.4);
          animation: blinkText 1.2s step-end infinite;
        }
        .side-corner { position: absolute; width: 18px; height: 18px; opacity: 0.2; }
        .side-corner.tl { top: 20px; left: 20px;   border-top: 1px solid #fbbf24;    border-left: 1px solid #fbbf24;  }
        .side-corner.tr { top: 20px; right: 20px;  border-top: 1px solid #fbbf24;    border-right: 1px solid #fbbf24; }
        .side-corner.bl { bottom: 20px; left: 20px;  border-bottom: 1px solid #fbbf24; border-left: 1px solid #fbbf24;  }
        .side-corner.br { bottom: 20px; right: 20px; border-bottom: 1px solid #fbbf24; border-right: 1px solid #fbbf24; }
        .side-vline {
          position: absolute; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(251,191,36,0.02) 30%, rgba(251,191,36,0.02) 70%, transparent);
        }
      `}</style>

      {/* Left side panel */}
      <div ref={leftPanelRef} className="side-panel left">
        <div className="side-grid-bg" />
        <div className="side-vline" style={{ right: 0 }} />
        <div className="side-corner tl" />
        <div className="side-corner bl" />
      </div>

      {/* Right side panel */}
      <div ref={rightPanelRef} className="side-panel right">
        <div className="side-grid-bg" />
        <div className="side-vline" style={{ left: 0 }} />
        <div className="side-corner tr" />
        <div className="side-corner br" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 pt-14 pb-32">

        {/* Header badge */}
        <div className="anim-1 flex items-center gap-2 mb-8">
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', flexShrink: 0,
              animation: 'pulseDot 2s ease-in-out infinite', display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#52525b', fontWeight: 700 }}>
            CRAWLER ENGINE — V2.0 ACTIVE
          </span>
        </div>

        {/* Hero */}
        <div className="anim-2 mb-8">
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#fafafa',
            letterSpacing: '-0.02em',
            margin: '0 0 14px',
          }}>
            Power AI agents<br />
            with <span style={{ color: '#fbbf24' }}>clean web data.</span>
          </h1>
          <p style={{ fontSize: 12, color: '#52525b', lineHeight: 1.8, maxWidth: 360, margin: 0 }}>
            Distributed engine to crawl, index, and interface with target domains at scale.
          </p>
        </div>

        {/* Live stat bar */}
        <div className="anim-2 stat-bar">
          <div className="stat-cell">
            <div className="stat-label">Pipeline jobs</div>
            <div className="stat-val">{jobs.length}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Mode</div>
            <div className="stat-val" style={{ fontSize: 13, paddingTop: 3 }}>{activeTab.toUpperCase()}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Status</div>
            <div className="stat-val" style={{ fontSize: 13, paddingTop: 3, color: isLoading ? '#fbbf24' : '#34d399' }}>
              {isLoading ? 'RUNNING' : 'IDLE'}
            </div>
          </div>
        </div>

        {/* Terminal console input */}
        <form onSubmit={handleEngineExecute} className="anim-3 console-wrap mb-4">
          {/* Window chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px 0' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.05em', paddingLeft: 6 }}>
              crawler ~ {activeTab}
            </span>
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
            <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, flexShrink: 0 }}>›_</span>
            <input
              ref={inputRef}
              className="console-input"
              type={modeMatrix[activeTab].inputType}
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={modeMatrix[activeTab].placeholder}
              autoComplete="off"
            />
            {activeTab === 'crawl' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: '#3f3f46', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Depth</span>
                <select
                  className="depth-select"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(e.target.value)}
                >
                  <option value={1}>01</option>
                  <option value={2}>02</option>
                  <option value={3}>03</option>
                </select>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#18181b', margin: '0 16px' }} />

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: 10 }}>
            <div style={{ display: 'flex', gap: 2, background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 3 }}>
              {[
                { id: 'crawl',  label: 'Crawl',  Icon: RotateCw },
                { id: 'search', label: 'Search', Icon: Search   },
                { id: 'scrape', label: 'Scrape', Icon: FileText },
                { id: 'map',    label: 'Map',    Icon: Map      },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchTab(id)}
                  className={activeTab === id ? 'tab-active' : 'tab-inactive'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 10, fontWeight: 700, letterSpacing: '.07em', fontFamily: 'inherit',
                    transition: 'all .15s',
                  }}
                >
                  <Icon style={{ width: 11, height: 11 }} />
                  {label.toUpperCase()}
                </button>
              ))}
            </div>

            <button type="submit" disabled={isLoading || !inputValue.trim()} className="run-btn">
              {isLoading
                ? <Loader2 style={{ width: 16, height: 16, color: '#09090b', animation: 'spin 1s linear infinite' }} />
                : <ArrowRight style={{ width: 16, height: 16, color: '#09090b', strokeWidth: 2.5 }} />
              }
            </button>
          </div>
        </form>

        {/* Status message */}
        {statusMessage && (
          <div
            className="anim-3"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px', borderRadius: 8, marginBottom: 20,
              background: statusType === 'error' ? 'rgba(239,68,68,.07)' : 'rgba(16,185,129,.07)',
              border: `1px solid ${statusType === 'error' ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'}`,
              fontSize: 11, color: statusType === 'error' ? '#f87171' : '#34d399', letterSpacing: '.03em',
            }}
          >
            <Zap style={{ width: 12, height: 12, flexShrink: 0 }} />
            {statusMessage}
          </div>
        )}

        {/* Output area */}
        <div className="anim-4">

          {/* A. CRAWL */}
          {activeTab === 'crawl' && (
            <>
              <div className="section-label">{jobs.length} Job{jobs.length !== 1 ? 's' : ''}</div>
              {jobs.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '48px 24px', background: '#0d0d0f', border: '1px dashed #1c1c1f', borderRadius: 12,
                }}>
                  <Terminal style={{ width: 28, height: 28, color: '#27272a', marginBottom: 10 }} />
                  <p style={{ fontSize: 12, color: '#3f3f46', margin: '0 0 4px', letterSpacing: '.04em' }}>No pipeline jobs registered.</p>
                  <p style={{ fontSize: 11, color: '#27272a', margin: 0 }}>Submit a seed URL to deploy workers.</p>
                </div>
              ) : (
                jobs.map((job, index) => {
                  const isProcessing = job.status === 'processing' || !job.status;
                  return (
                    <div key={job.jobId || index} className="job-row">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.seedUrl}
                        </div>
                        <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.jobId || job._id || 'unknown-node-hash'}
                        </div>
                      </div>
                      <span className={`badge ${isProcessing ? 'badge-indexing' : 'badge-synced'}`}>
                        <span className={`badge-dot ${isProcessing ? 'badge-dot-pulse' : 'badge-dot-solid'}`} />
                        {isProcessing ? 'Indexing' : 'Synced'}
                      </span>
                      <div style={{
                        background: '#18181b', border: '1px solid #27272a', color: '#fbbf24',
                        fontSize: 13, fontWeight: 700, borderRadius: 7, padding: '4px 10px', minWidth: 40, textAlign: 'center',
                      }}>
                        {job.pagesCrawled || 0}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* B. SEARCH */}
          {activeTab === 'search' && searchResults.length > 0 && (
            <>
              <div className="section-label">{searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''}</div>
              {searchResults.map((item, index) => (
                <div key={item.id || index} className="result-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, marginRight: 6 }}>#{index + 1}</span>
                      <span style={{ fontSize: 12, color: '#e4e4e7', fontWeight: 500 }}>{item.title || 'Untitled'}</span>
                      <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, wordBreak: 'break-all' }}>{item.url}</div>
                    </div>
                    <button className="scrape-btn" type="button" onClick={() => triggerScrapeFromSearch(item.url)}>
                      Scrape
                    </button>
                  </div>
                  {item.snippets?.map((snippet, sIdx) => (
                    <div key={sIdx} style={{
                      background: '#0a0a0c', border: '1px solid #1c1c1f', borderRadius: 7,
                      padding: '9px 12px', fontSize: 11, color: '#71717a', lineHeight: 1.7,
                    }}>
                      <span style={{ color: '#3f3f46', fontWeight: 700 }}>"description": </span>
                      <span dangerouslySetInnerHTML={{
                        __html: snippet.replace(/<em>/g, '<em style="background:rgba(251,191,36,.14);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 3px;border-radius:2px;">'),
                      }} />
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* C. SCRAPE */}
          {activeTab === 'scrape' && scrapedData && (
            <div style={{ background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #1c1c1f' }}>
                <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 5 }}>Extracted node core</div>
                <div style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scrapedData.title || 'Target Extraction'}</div>
                <div style={{ fontSize: 10, color: '#3f3f46', marginTop: 3, wordBreak: 'break-all' }}>{scrapedData.url}</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #1c1c1f', background: 'rgba(0,0,0,.3)' }}>
                <button className={`view-tab ${viewMode === 'MARKDOWN' ? 'view-tab-active' : 'view-tab-inactive'}`} type="button" onClick={() => setViewMode('MARKDOWN')}>
                  Markdown
                </button>
                <button className={`view-tab ${viewMode === 'JSON' ? 'view-tab-active' : 'view-tab-inactive'}`} type="button" onClick={() => setViewMode('JSON')}>
                  {'{ }'} JSON Node
                </button>
              </div>
              <div style={{
                padding: '14px 18px', background: 'rgba(0,0,0,.5)', maxHeight: 420,
                overflowY: 'auto', fontSize: 11, lineHeight: 1.8, fontFamily: 'inherit',
                color: viewMode === 'JSON' ? '#34d399' : '#a1a1aa', whiteSpace: 'pre-wrap',
              }}>
                {viewMode === 'MARKDOWN'
                  ? [
                      `# ${scrapedData.title || ''}`,
                      scrapedData.metaDescription ? `\n> ${scrapedData.metaDescription}\n` : '',
                      ...(scrapedData.h1Headers || []).map(h => `## ${h}`),
                      '',
                      scrapedData.cleanTextContent || 'No text content found.',
                    ].join('\n')
                  : JSON.stringify(scrapedData, null, 2)
                }
              </div>
            </div>
          )}

          {/* D. MAP */}
          {activeTab === 'map' && mappedData && (
            <div style={{ background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #1c1c1f' }}>
                <div>
                  <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>Architecture matrix</div>
                  <div style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500 }}>{mappedData.host || 'Endpoint tree'}</div>
                </div>
                <span style={{
                  background: '#1c1c1f', border: '1px solid #27272a', color: '#52525b',
                  fontSize: 9, fontFamily: 'inherit', fontWeight: 700, padding: '4px 10px',
                  borderRadius: 5, letterSpacing: '.1em', textTransform: 'uppercase',
                }}>
                  {(mappedData.endpoints || mappedData.discoveredEndpoints || []).length} paths
                </span>
              </div>
              <div style={{ padding: 8, maxHeight: 360, overflowY: 'auto', background: 'rgba(0,0,0,.5)' }}>
                {(mappedData.endpoints || mappedData.discoveredEndpoints || []).length > 0
                  ? (mappedData.endpoints || mappedData.discoveredEndpoints).map((path, idx) => {
                      const full = path.startsWith('http') ? path : `${mappedData.host || ''}${path}`;
                      return (
                        <div key={idx} className="map-item">
                          <span style={{ fontSize: 9, color: '#27272a', fontWeight: 700, minWidth: 20, textAlign: 'right' }}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="map-path">{full}</span>
                        </div>
                      );
                    })
                  : <div style={{ textAlign: 'center', padding: '32px', fontSize: 11, color: '#3f3f46', fontStyle: 'italic' }}>No paths discovered.</div>
                }
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}