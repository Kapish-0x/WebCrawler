import React, { useState } from 'react';
import { Search, FileText, Map, Orbit, ArrowRight } from 'lucide-react';

export default function EngineControls({ onExecutionStart }) {
  // ==========================================
  // 1. ENGINE RUNTIME STATE
  // ==========================================
  const [activeMode, setActiveMode] = useState('crawl'); 
  const [inputValue, setInputValue] = useState('');
  const [depth, setDepth] = useState(2);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 2. ALL 4 CORE PIPELINE MODES
  // ==========================================
  const modes = [
    { 
      id: 'crawl', 
      label: 'Crawl Platform', 
      icon: Orbit, 
      placeholder: 'Enter seed URL to deploy distributed Kafka cluster workers...',
      endpoint: 'http://localhost:5000/api/crawl/start'
    },
    { 
      id: 'search', 
      label: 'Search Explorer', 
      icon: Search, 
      placeholder: 'Query indexed cluster documents (reads from Elasticsearch)...',
      endpoint: 'http://localhost:5000/api/search'
    },
    { 
      id: 'scrape', 
      label: 'Scrape Target', 
      icon: FileText, 
      placeholder: 'Paste specific URL to extract raw text instantly (synchronous)...',
      endpoint: 'http://localhost:5000/api/scrape'
    },
    { 
      id: 'map', 
      label: 'Map Domain', 
      icon: Map, 
      placeholder: 'Enter host URL to generate a structural sitemap path tree...',
      endpoint: 'http://localhost:5000/api/map'
    }
  ];

  const currentMode = modes.find(m => m.id === activeMode) || modes[0];

  // ==========================================
  // 3. PIPELINE EXECUTION ENGINE ROUTER
  // ==========================================
  const handleExecute = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading) return;

    setLoading(true);

    let payload = {};
    if (activeMode === 'crawl') {
      payload = { seedUrl: inputValue, maxDepth: Number(depth) };
    } else if (activeMode === 'search') {
      payload = { q: inputValue };
    } else {
      payload = { url: inputValue }; // Shared schema for Scrape and Map
    }

    try {
      const response = await fetch(currentMode.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || `Cluster tracking failed on status ${response.status}`);
      }
      
      if (onExecutionStart) {
        onExecutionStart({ 
          mode: activeMode, 
          data: data.payload || data, 
          status: 'success', 
          input: inputValue 
        });
      }
      
      if (activeMode !== 'crawl') {
        setInputValue('');
      }

    } catch (err) {
      console.error(`Execution failure running mode [${activeMode}]:`, err.message);
      if (onExecutionStart) {
        onExecutionStart({ 
          mode: activeMode, 
          error: err.message, 
          status: 'failed' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#111113',
      border: '1px solid #1c1c1f',
      borderRadius: 16,
      padding: 24,
      fontFamily: "inherit",
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      
      {/* Dynamic Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 10, color: '#fbbf24', letterSpacing: '.12em', fontWeight: 700, textTransform: 'uppercase' }}>
          ENGINE INTERFACE // {currentMode.label}
        </p>
        {loading && (
          <span style={{ fontSize: 10, color: '#fbbf24' }}>
            Processing Pipeline...
          </span>
        )}
      </div>

      {/* INPUT ADAPTER BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#0d0d0f',
        border: '1px solid #27272a',
        borderRadius: 10,
        padding: '6px 12px',
        marginBottom: 20,
        boxSizing: 'border-box'
      }}>
        <currentMode.icon 
          style={{ 
            width: 16, 
            height: 16, 
            color: loading ? '#fbbf24' : '#3f3f46',
            flexShrink: 0
          }} 
        />
        
        <input
          type={activeMode === 'search' ? 'text' : 'url'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={currentMode.placeholder}
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fafafa',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            padding: '10px 0',
            width: '100%'
          }}
        />

        {/* Depth dropdown configuration for crawler */}
        {activeMode === 'crawl' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 11,
            color: '#fbbf24',
            fontWeight: 700,
            flexShrink: 0
          }}>
            <span style={{ color: '#52525b', marginRight: 6, fontWeight: 400 }}>DEPTH:</span>
            <select 
              value={depth} 
              onChange={(e) => setDepth(Number(e.target.value))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fbbf24',
                fontFamily: 'inherit',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={1} style={{ background: '#111113' }}>01</option>
              <option value={2} style={{ background: '#111113' }}>02</option>
              <option value={3} style={{ background: '#111113' }}>03</option>
            </select>
          </div>
        )}
      </div>

      {/* LOWER NAVIGATION & TAB CONTROL LAYER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        borderTop: '1px solid #1c1c1f',
        paddingTop: 16
      }}>
        
        {/* ALL FOUR CORE SWITCHES RENDERING GRID */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#0d0d0f',
          padding: 4,
          borderRadius: 10,
          border: '1px solid #1c1c1f',
          flexWrap: 'wrap'
        }}>
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  setActiveMode(mode.id);
                  setInputValue(''); 
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 6,
                  fontSize: 10,
                  letterSpacing: '.12em',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.15s ease',
                  background: isSelected ? '#fbbf24' : 'transparent',
                  color: isSelected ? '#09090b' : '#a1a1aa',
                }}
              >
                <IconComponent style={{ width: 13, height: 13 }} />
                {mode.id}
              </button>
            );
          })}
        </div>

        {/* FIRE ACTION PIPELINE ACTION RUN BUTTON */}
        <button 
          onClick={handleExecute}
          disabled={loading || !inputValue.trim()}
          style={{
            background: '#fbbf24',
            border: 'none',
            borderRadius: 8,
            padding: 12,
            cursor: (loading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
            transition: 'all 0.1s ease',
            opacity: (loading || !inputValue.trim()) ? 0.25 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowRight style={{ width: 16, height: 16, color: '#09090b', strokeWidth: 2.5 }} />
        </button>
      </div>

    </div>
  );
}