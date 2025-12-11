export function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    success: false,
    error: { code, message }
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Rota não encontrada' }
  });
}
