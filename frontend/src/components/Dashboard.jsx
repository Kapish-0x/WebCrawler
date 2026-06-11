// import React, { useState, useEffect } from 'react';
// import {
//   CheckCircle2, AlertTriangle, Activity, Server, Cpu, RefreshCw
// } from 'lucide-react';
// import EngineControls from './EngineControls'; // Ensure path points to your new component!

// function StatCard({ label, value, sub, accent }) {
//   return (
//     <div style={{
//       background: '#111113',
//       border: '1px solid #1c1c1f',
//       borderRadius: 12,
//       padding: '18px 20px',
//       position: 'relative',
//       overflow: 'hidden',
//     }}>
//       {accent && (
//         <div style={{
//           position: 'absolute',
//           top: 0, left: 0, right: 0,
//           height: 2,
//           background: accent,
//         }} />
//       )}
//       <p style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>
//         {label}
//       </p>
//       <p style={{ fontSize: 26, fontWeight: 700, color: '#fafafa', lineHeight: 1, fontFamily: 'inherit' }}>
//         {value}
//       </p>
//       {sub && (
//         <p style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>{sub}</p>
//       )}
//     </div>
//   );
// }

// export default function Dashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [error, setError] = useState('');
//   const [lastRefresh, setLastRefresh] = useState(null);
  
//   // Track active execution response data to render inside your console/display
//   const [activeExecution, setActiveExecution] = useState(null);

//   const fetchJobs = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/jobs');
//       if (res.ok) {
//         const data = await res.json();
//         setJobs(Array.isArray(data) ? data : data ? [data] : []);
//         setLastRefresh(new Date());
//       }
//     } catch (err) {
//       console.error('Telemetry fetch error:', err.message);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//     const interval = setInterval(fetchJobs, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   // Catch dynamic outputs back from Search, Scrape, Map, or Crawl executions
//   const handlePipelineExecution = (executionResult) => {
//     setError('');
//     if (executionResult.status === 'failed') {
//       setError(executionResult.error);
//       return;
//     }

//     setActiveExecution(executionResult);
//     console.log(`Execution success in state [${executionResult.mode}]:`, executionResult.data);

//     // If a crawl job was started successfully, force-refresh the telemetry table list immediately
//     if (executionResult.mode === 'crawl') {
//       fetchJobs();
//     }
//   };

//   const processingJobs = jobs.filter(j => j.status === 'processing');
//   const completedJobs  = jobs.filter(j => j.status === 'completed');
//   const totalPages     = jobs.reduce((sum, j) => sum + (j.pagesCrawled || 0), 0);

//   return (
//     <div
//       style={{
//         background: '#09090B',
//         minHeight: '100vh',
//         fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
//         color: '#fafafa',
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
//         ::selection { background: rgba(251,191,36,0.25); }

//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ping {
//           75%, 100% { transform: scale(2); opacity: 0; }
//         }
//         @keyframes rowIn {
//           from { opacity: 0; transform: translateX(-8px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }

//         .db-inner { max-width: 960px; margin: 0 auto; padding: 56px 32px 100px; }
//         .db-table-panel {
//           background: #111113;
//           border: 1px solid #1c1c1f;
//           border-radius: 16px;
//           overflow: hidden;
//           margin-top: 32px;
//         }
//         .db-table-header {
//           padding: 18px 24px;
//           border-bottom: 1px solid #1c1c1f;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           background: #0d0d0f;
//         }
//         .db-th {
//           padding: 12px 20px;
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: .14em;
//           color: #3f3f46;
//           text-align: left;
//           background: #0a0a0c;
//           border-bottom: 1px solid #1c1c1f;
//           white-space: nowrap;
//         }
//         .db-tr {
//           border-bottom: 1px solid #0f0f11;
//           transition: background .15s;
//           animation: rowIn .3s ease both;
//         }
//         .db-tr:last-child { border-bottom: none; }
//         .db-tr:hover { background: rgba(255,255,255,0.015); }
//         .db-td {
//           padding: 16px 20px;
//           font-size: 12px;
//           color: #a1a1aa;
//           font-family: inherit;
//           vertical-align: middle;
//         }

//         .badge-processing {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: rgba(251,191,36,0.08);
//           border: 1px solid rgba(251,191,36,0.2);
//           color: #fbbf24;
//           font-size: 10px; font-weight: 700;
//           padding: 5px 10px; border-radius: 6px;
//           letter-spacing: .1em;
//           white-space: nowrap;
//           font-family: inherit;
//         }
//         .badge-completed {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: rgba(16,185,129,0.08);
//           border: 1px solid rgba(16,185,129,0.2);
//           color: #34d399;
//           font-size: 10px; font-weight: 700;
//           padding: 5px 10px; border-radius: 6px;
//           letter-spacing: .1em;
//           white-space: nowrap;
//           font-family: inherit;
//         }
//         .badge-pending {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: rgba(63,63,70,0.4);
//           border: 1px solid #27272a;
//           color: #52525b;
//           font-size: 10px; font-weight: 700;
//           padding: 5px 10px; border-radius: 6px;
//           letter-spacing: .1em;
//           white-space: nowrap;
//           font-family: inherit;
//         }

//         .db-count-pill {
//           background: #fbbf24;
//           color: #09090b;
//           font-size: 11px;
//           font-weight: 700;
//           padding: 3px 10px;
//           border-radius: 20px;
//           font-family: inherit;
//           min-width: 28px;
//           text-align: center;
//         }

//         .db-error {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: rgba(239,68,68,0.07);
//           border: 1px solid rgba(239,68,68,0.2);
//           border-radius: 10px;
//           padding: 13px 16px;
//           font-size: 12px;
//           color: #f87171;
//           margin-bottom: 20px;
//           font-family: inherit;
//           letter-spacing: .03em;
//         }

//         .grid-4 {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 12px;
//           margin-bottom: 28px;
//         }
//         @media (max-width: 700px) {
//           .grid-4 { grid-template-columns: repeat(2, 1fr); }
//         }

//         .spin-slow {
//           animation: spin 4s linear infinite;
//         }
//       `}</style>

//       <div className="db-inner">

//         {/* Header */}
//         <div style={{ marginBottom: 36, animation: 'fadeSlideUp .4s ease both' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
//             <Server style={{ width: 14, height: 14, color: '#fbbf24' }} />
//             <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#52525b', fontWeight: 700 }}>
//               CLUSTER INFRASTRUCTURE — INTERACTIVE OPERATION DECK
//             </span>
//           </div>
//           <h2 style={{
//             fontFamily: "'Syne', sans-serif",
//             fontSize: 'clamp(26px, 4vw, 38px)',
//             fontWeight: 800,
//             letterSpacing: '-0.02em',
//             color: '#fafafa',
//             lineHeight: 1.1,
//             margin: '0 0 10px',
//           }}>
//             Data Engine Room
//           </h2>
//           <p style={{ fontSize: 13, color: '#3f3f46', lineHeight: 1.7, fontFamily: 'inherit' }}>
//             Switch between targeted extraction, mapping routines, broad crawlers, and rapid index searches.
//           </p>
//         </div>

//         {/* Stat Cards */}
//         <div className="grid-4" style={{ animation: 'fadeSlideUp .4s ease both .1s' }}>
//           <StatCard
//             label="TOTAL JOBS"
//             value={jobs.length}
//             sub="registered in broker"
//             accent="#fbbf24"
//           />
//           <StatCard
//             label="PROCESSING"
//             value={processingJobs.length}
//             sub="active workers"
//             accent="#f59e0b"
//           />
//           <StatCard
//             label="COMPLETED"
//             value={completedJobs.length}
//             sub="synchronized"
//             accent="#34d399"
//           />
//           <StatCard
//             label="PAGES INDEXED"
//             value={totalPages.toLocaleString()}
//             sub="across all jobs"
//             accent="#60a5fa"
//           />
//         </div>

//         {/* Global Error Notice Handler */}
//         {error && (
//           <div className="db-error" style={{ animation: 'fadeSlideUp .3s ease both' }}>
//             <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />
//             {error}
//           </div>
//         )}

//         {/* UPGRADED MULTI-MODE ACTION CONTROL DECK */}
//         <div style={{ animation: 'fadeSlideUp .4s ease both .2s' }}>
//           <EngineControls onExecutionStart={handlePipelineExecution} />
//         </div>

//         {/* Jobs Table */}
//         <div className="db-table-panel" style={{ animation: 'fadeSlideUp .4s ease both .3s' }}>
//           <div className="db-table-header">
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//               <Activity style={{ width: 15, height: 15, color: '#52525b' }} />
//               <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#71717a' }}>
//                 ACTIVE QUEUE TELEMETRY
//               </span>
//               <span className="db-count-pill">{jobs.length}</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               {lastRefresh && (
//                 <span style={{ fontSize: 10, color: '#27272a', letterSpacing: '.06em' }}>
//                   {lastRefresh.toLocaleTimeString()}
//                 </span>
//               )}
//               <RefreshCw
//                 className="spin-slow"
//                 style={{ width: 13, height: 13, color: '#27272a' }}
//               />
//             </div>
//           </div>

//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             width: '100%',
//             overflowX: 'auto'
//           }}>
//             {jobs.length === 0 ? (
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '72px 32px',
//                 gap: 12,
//               }}>
//                 <Cpu style={{ width: 32, height: 32, color: '#1c1c1f' }} />
//                 <p style={{ fontSize: 12, color: '#27272a', letterSpacing: '.08em', fontFamily: 'inherit' }}>
//                   NO CLUSTER PIPELINES RECORDED
//                 </p>
//                 <p style={{ fontSize: 11, color: '#1c1c1f', fontFamily: 'inherit' }}>
//                   Submit parameters via the engine deck above to deploy workers.
//                 </p>
//               </div>
//             ) : (
//               <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
//                 <thead>
//                   <tr>
//                     {['Pipeline Hash', 'Root Origin', 'Depth', 'Status', 'Pages Indexed'].map((h, i) => (
//                       <th key={h} className="db-th" style={{ textAlign: i === 4 ? 'right' : 'left' }}>
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {jobs.map((job, idx) => (
//                     <tr
//                       key={job._id || job.jobId || idx}
//                       className="db-tr"
//                       style={{ animationDelay: `${idx * 0.04}s` }}
//                     >
//                       {/* Hash */}
//                       <td className="db-td">
//                         <span style={{ color: '#27272a', fontSize: 11 }}>
//                           {String(job._id || job.jobId || 'N/A').slice(0, 14)}...
//                         </span>
//                       </td>

//                       {/* URL */}
//                       <td className="db-td">
//                         <span style={{
//                           color: '#e4e4e7',
//                           fontWeight: 600,
//                           fontSize: 13,
//                           maxWidth: 260,
//                           display: 'block',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap',
//                         }}>
//                           {job.seedUrl}
//                         </span>
//                       </td>

//                       {/* Depth */}
//                       <td className="db-td">
//                         <span style={{
//                           color: '#52525b',
//                           background: '#18181b',
//                           border: '1px solid #27272a',
//                           padding: '3px 8px',
//                           borderRadius: 4,
//                           fontSize: 11,
//                           fontWeight: 700,
//                         }}>
//                           D:{String(job.maxDepth || '—').padStart(2, '0')}
//                         </span>
//                       </td>

//                       {/* Status */}
//                       <td className="db-td">
//                         {job.status === 'processing' && (
//                           <span className="badge-processing">
//                             <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
//                               <span style={{
//                                 position: 'absolute', inset: 0,
//                                 borderRadius: '50%', background: '#fbbf24',
//                                 animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
//                                 opacity: 0.75,
//                               }} />
//                               <span style={{
//                                 position: 'relative', width: 8, height: 8,
//                                 borderRadius: '50%', background: '#fbbf24',
//                               }} />
//                             </span>
//                             INDEXING
//                           </span>
//                         )}
//                         {job.status === 'completed' && (
//                           <span className="badge-completed">
//                             <CheckCircle2 style={{ width: 11, height: 11 }} />
//                             SYNCED
//                           </span>
//                         )}
//                         {job.status === 'pending' && (
//                           <span className="badge-pending">
//                             PENDING
//                           </span>
//                         )}
//                         {!['processing','completed','pending'].includes(job.status) && (
//                           <span className="badge-pending">UNKNOWN</span>
//                         )}
//                       </td>

//                       {/* Pages */}
//                       <td className="db-td" style={{ textAlign: 'right' }}>
//                         <span style={{
//                           fontFamily: 'inherit',
//                           fontSize: 18,
//                           fontWeight: 700,
//                           color: job.status === 'processing' ? '#fbbf24' : '#e4e4e7',
//                         }}>
//                           {(job.pagesCrawled || 0).toLocaleString()}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }









import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, AlertTriangle, Activity, Server, Cpu, RefreshCw, X
} from 'lucide-react';
import EngineControls from './EngineControls';

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: '#111113',
      border: '1px solid #1c1c1f',
      borderRadius: 12,
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accent && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: accent,
        }} />
      )}
      <p style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 700, color: '#fafafa', lineHeight: 1, fontFamily: 'inherit' }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>{sub}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const [activeJob, setActiveJob] = useState(null); // New state for Playground View

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data ? [data] : []);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error('Telemetry fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2500);
    return () => clearInterval(interval);
  }, []);

  const handlePipelineExecution = (executionResult) => {
    setError('');
    if (executionResult.status === 'failed') {
      setError(executionResult.error);
      return;
    }
    if (executionResult.mode === 'crawl') {
      fetchJobs();
    }
  };

  const processingJobs = jobs.filter(j => j.status === 'processing');
  const completedJobs  = jobs.filter(j => j.status === 'completed');
  const totalPages     = jobs.reduce((sum, j) => sum + (j.pagesCrawled || 0), 0);

  return (
    <div style={{ background: '#09090B', minHeight: '100vh', fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", color: '#fafafa' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .db-inner { max-width: 960px; margin: 0 auto; padding: 56px 32px 100px; }
        .db-table-panel { background: #111113; border: 1px solid #1c1c1f; border-radius: 16px; overflow: hidden; margin-top: 32px; }
        .db-table-header { padding: 18px 24px; border-bottom: 1px solid #1c1c1f; display: flex; align-items: center; justify-content: space-between; background: #0d0d0f; }
        .db-th { padding: 12px 20px; font-size: 10px; font-weight: 700; letter-spacing: .14em; color: #3f3f46; text-align: left; background: #0a0a0c; border-bottom: 1px solid #1c1c1f; }
        .db-tr { border-bottom: 1px solid #0f0f11; cursor: pointer; transition: background .15s; }
        .db-tr:hover { background: rgba(255,255,255,0.03); }
        .db-td { padding: 16px 20px; font-size: 12px; color: #a1a1aa; vertical-align: middle; }
        .badge-processing { display: inline-flex; align-items: center; gap: 6px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); color: #fbbf24; font-size: 10px; font-weight: 700; padding: 5px 10px; border-radius: 6px; }
        .badge-completed { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #34d399; font-size: 10px; font-weight: 700; padding: 5px 10px; border-radius: 6px; }
        .db-count-pill { background: #fbbf24; color: #09090b; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; min-width: 28px; text-align: center; }
        .spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="db-inner">
        {/* Playground Detail View */}
        {activeJob && (
          <div style={{ background: '#111113', border: '1px solid #fbbf24', borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, color: '#fbbf24', margin: 0 }}>Result Inspector</h3>
                <p style={{ fontSize: 12, color: '#52525b', margin: '4px 0 0' }}>{activeJob.seedUrl}</p>
              </div>
              <button onClick={() => setActiveJob(null)} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={16}/></button>
            </div>
            <pre style={{ background: '#000', padding: 20, borderRadius: 8, fontSize: 12, color: '#a1a1aa', maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              {activeJob.markdownContent || 'No output captured yet...'}
            </pre>
          </div>
        )}

        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, color: '#fafafa', margin: '0 0 10px' }}>Data Engine Room</h2>
        </div>

        <div className="grid-4">
          <StatCard label="TOTAL JOBS" value={jobs.length} accent="#fbbf24" />
          <StatCard label="PROCESSING" value={processingJobs.length} accent="#f59e0b" />
          <StatCard label="COMPLETED" value={completedJobs.length} accent="#34d399" />
          <StatCard label="PAGES INDEXED" value={totalPages.toLocaleString()} accent="#60a5fa" />
        </div>

        <EngineControls onExecutionStart={handlePipelineExecution} />

        <div className="db-table-panel">
          <div className="db-table-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Activity size={15} color="#52525b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#71717a' }}>ACTIVE QUEUE TELEMETRY</span>
              <span className="db-count-pill">{jobs.length}</span>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Hash', 'Root Origin', 'Status', 'Pages'].map(h => <th key={h} className="db-th">{h.toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...jobs].reverse().map((job) => (
                <tr key={job._id} className="db-tr" onClick={() => setActiveJob(job)}>
                  <td className="db-td" style={{ color: '#27272a' }}>{String(job._id || '').slice(0, 8)}...</td>
                  <td className="db-td" style={{ color: '#e4e4e7', fontWeight: 600 }}>{job.seedUrl}</td>
                  <td className="db-td">
                    <span className={job.status === 'completed' ? 'badge-completed' : 'badge-processing'}>
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="db-td" style={{ textAlign: 'right' }}>{job.pagesCrawled || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}