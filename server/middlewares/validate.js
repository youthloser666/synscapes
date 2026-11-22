export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors ? error.errors.map(e => e.message).join(', ') : 'Invalid request payload'
        }
      });
    }
  };
}
