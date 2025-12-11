export function successResponse(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

export function paginatedResponse(res, items, total, page, pageSize) {
  return res.json({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  });
}

export function errorResponse(res, message, code = 'ERROR', status = 400) {
  return res.status(status).json({
    success: false,
    error: { code, message }
  });
}
