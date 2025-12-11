export const healthController = {
  check(req, res) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;
    
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Status - Camisa de Elite</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .container {
      background: #1a1a1a;
      border: 1px solid rgba(201, 162, 39, 0.3);
      border-radius: 16px;
      padding: 48px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #c9a227;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    .subtitle {
      font-size: 14px;
      color: #888;
      margin-bottom: 32px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 32px;
    }
    .status-dot {
      width: 12px;
      height: 12px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-top: 24px;
    }
    .info-item {
      background: #252525;
      padding: 20px;
      border-radius: 12px;
    }
    .info-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #c9a227;
    }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">⚽ CAMISA DE ELITE</div>
    <div class="subtitle">API Backend Service</div>
    
    <div class="status-badge">
      <span class="status-dot"></span>
      Operacional
    </div>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Uptime</div>
        <div class="info-value">${uptimeFormatted}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Versão</div>
        <div class="info-value">1.0.0</div>
      </div>
      <div class="info-item">
        <div class="info-label">Ambiente</div>
        <div class="info-value">${process.env.NODE_ENV || 'development'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Hora do Servidor</div>
        <div class="info-value">${new Date().toLocaleTimeString('pt-BR')}</div>
      </div>
    </div>
    
    <div class="footer">
      ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  </div>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  },
  
  // Endpoint JSON para verificações programáticas
  json(req, res) {
    return res.json({
      status: 'ok',
      time: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  }
};
