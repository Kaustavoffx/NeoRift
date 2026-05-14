export const SuspenseFallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle, #1a1a2e 0%, #05070d 100%)',
      fontFamily: 'monospace',
      color: '#00ff00',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'pulse 0.8s ease-in-out infinite',
        }}
      >
        ▮▯▯
      </div>
      <p style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Initializing scene layer...
      </p>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  </div>
)
