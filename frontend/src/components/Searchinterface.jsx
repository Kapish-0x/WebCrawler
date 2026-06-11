import React, { useState } from 'react';
import { Search, Loader2, ArrowUpRight, AlertTriangle, Sparkles, Hash, Clock, Database } from 'lucide-react';

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setTotalResults(null);
    setElapsed(null);

    const t0 = performance.now();

    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Elasticsearch index lookup failed');

      setResults(data.results || []);
      setTotalResults(data.totalResults ?? 0);
      setElapsed(((performance.now() - t0) / 1000).toFixed(3));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#09090B',
        minHeight: '100vh',
        fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
        color: '#fafafa',
        padding: '0',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
        ::selection { background: rgba(251,191,36,0.25); }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1;   }
        }

        .si-wrapper { max-width: 760px; margin: 0 auto; padding: 64px 32px 120px; }

        .si-search-bar {
          display: flex;
          align-items: center;
          gap: 0;
          background: #111113;
          border: 1px solid #27272a;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }
        .si-search-bar:focus-within {
          border-color: #fbbf24;
          box-shadow: 0 0 0 4px rgba(251,191,36,0.07);
        }
        .si-icon-zone {
          width: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #3f3f46;
          border-right: 1px solid #1c1c1f;
          height: 60px;
        }
        .si-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0 20px;
          font-size: 15px;
          font-family: inherit;
          font-weight: 500;
          color: #fafafa;
          height: 60px;
          letter-spacing: .01em;
        }
        .si-input::placeholder { color: #3f3f46; }
        .si-exec-btn {
          height: 60px;
          padding: 0 28px;
          background: #fbbf24;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
          color: #09090b;
          transition: background .15s;
          flex-shrink: 0;
        }
        .si-exec-btn:hover    { background: #f59e0b; }
        .si-exec-btn:active   { background: #d97706; }
        .si-exec-btn:disabled { opacity: .4; cursor: not-allowed; }

        .si-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 14px 0;
          animation: fadeSlideUp .3s ease both;
        }
        .si-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #52525b;
          letter-spacing: .06em;
        }
        .si-meta-value { color: #a1a1aa; font-weight: 700; }

        .si-result {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 14px;
          padding: 22px 24px;
          margin-bottom: 12px;
          transition: border-color .2s, transform .15s;
          animation: fadeSlideUp .35s ease both;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .si-result::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #fbbf24;
          opacity: 0;
          transition: opacity .2s;
        }
        .si-result:hover { border-color: #3f3f46; transform: translateX(2px); }
        .si-result:hover::before { opacity: 1; }

        .si-url {
          font-size: 13px;
          font-weight: 700;
          color: #fbbf24;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          max-width: 480px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: .02em;
        }
        .si-url:hover { color: #fde68a; }
        .si-url .ext-icon { opacity: 0; transition: opacity .15s; }
        .si-result:hover .si-url .ext-icon { opacity: 1; }

        .si-score {
          font-size: 11px;
          font-weight: 700;
          color: #27272a;
          letter-spacing: .08em;
          font-family: inherit;
        }

        .si-snippet {
          font-size: 12px;
          line-height: 1.8;
          color: #52525b;
          border-left: 2px solid #1c1c1f;
          padding-left: 14px;
          margin-top: 12px;
          font-family: inherit;
        }

        .si-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #18181b;
          font-size: 10px;
          color: #27272a;
          letter-spacing: .08em;
          font-family: inherit;
        }

        .si-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          animation: fadeSlideUp .3s ease both;
        }

        .si-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 80px 0;
        }
        .si-loader-ring {
          width: 48px; height: 48px;
          border: 2px solid #1c1c1f;
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .si-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          margin-top: 12px;
          font-size: 12px;
          color: #f87171;
          font-family: inherit;
          animation: fadeSlideUp .25s ease both;
          letter-spacing: .03em;
        }

        .si-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .18em;
          color: #3f3f46;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .si-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #18181b;
        }
      `}</style>

      <div className="si-wrapper">

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Database style={{ width: 14, height: 14, color: '#fbbf24' }} />
            <span style={{ fontSize: 10, letterSpacing: '.18em', color: '#52525b', fontWeight: 700 }}>
              INDEX EXPLORER — ELASTICSEARCH
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fafafa',
            lineHeight: 1.1,
            margin: '0 0 10px',
          }}>
            Search Index Nodes
          </h2>
          <p style={{ fontSize: 13, color: '#3f3f46', lineHeight: 1.7, fontFamily: 'inherit' }}>
            Query across Elasticsearch clusters and explore structured relevance metrics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="si-search-bar" style={{ marginBottom: 8 }}>
          <div className="si-icon-zone">
            <Search style={{ width: 18, height: 18 }} />
          </div>
          <form
            onSubmit={handleSearch}
            style={{ flex: 1, display: 'flex' }}
          >
            <input
              type="text"
              required
              placeholder="git, devops, react, rust..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="si-input"
            />
            <button type="submit" disabled={isLoading} className="si-exec-btn">
              {isLoading
                ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                : <Sparkles style={{ width: 14, height: 14 }} />
              }
              EXECUTE
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="si-error">
            <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Meta bar */}
        {totalResults !== null && !isLoading && (
          <div className="si-meta">
            <div className="si-meta-item">
              <Hash style={{ width: 12, height: 12 }} />
              <span>Found</span>
              <span className="si-meta-value">{totalResults}</span>
              <span>records</span>
            </div>
            {elapsed && (
              <div className="si-meta-item">
                <Clock style={{ width: 12, height: 12 }} />
                <span className="si-meta-value">{elapsed}s</span>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        <div style={{ marginTop: 8 }}>
          {isLoading ? (
            <div className="si-loader">
              <div className="si-loader-ring" />
              <p style={{ fontSize: 11, color: '#3f3f46', letterSpacing: '.1em', fontFamily: 'inherit' }}>
                QUERYING SHARDS ACROSS NODES...
              </p>
            </div>
          ) : results.length === 0 && totalResults !== null ? (
            <div className="si-empty">
              <Search style={{ width: 32, height: 32, color: '#27272a', marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '.06em' }}>
                Zero index matches found.
              </p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="si-label">Results</div>
              {results.map((item, idx) => (
                <div key={item.id || idx} className="si-result" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <a href={item.url} target="_blank" rel="noreferrer" className="si-url">
                      {item.url}
                      <ArrowUpRight className="ext-icon" style={{ width: 12, height: 12, flexShrink: 0 }} />
                    </a>
                    {item.score && (
                      <span className="si-score">
                        ↑{Number(item.score).toFixed(5)}
                      </span>
                    )}
                  </div>

                  {item.snippets?.length > 0 && (
                    <div>
                      {item.snippets.map((snippet, sIdx) => (
                        <p
                          key={sIdx}
                          className="si-snippet"
                          dangerouslySetInnerHTML={{
                            __html: snippet.replace(
                              /<em>/g,
                              '<em style="background:rgba(251,191,36,0.14);color:#fbbf24;font-style:normal;font-weight:700;padding:1px 5px;border-radius:3px;">'
                            ),
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="si-footer">
                    <span>JOB: {item.jobId || '—'}</span>
                    <span>
                      {item.indexedAt
                        ? new Date(item.indexedAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : '—'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}