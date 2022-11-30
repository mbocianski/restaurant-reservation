/**
 * Express API "Method Not Allowed" handler.
 */

function methodNotAllowed(req, res, next) {
  next({ staus: 405, message: `${req.method} is not allowed` });
}

module.exports = methodNotAllowed;
