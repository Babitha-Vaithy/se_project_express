const statusCode = {
  CastError: {
    code: 400,
    message: "invalid data",
  },
  DocumentNotFoundError: {
    code: 404,
    message: "Document Not Found",
  },
  serverError: {
    code: 500,
    message: "Internal Server Error",
  },
  DuplicateKeyError: {
    code: 409,
    message: "Duplicate Key Error",
  },
  ForbiddenError: {
    code: 403,
    message: "Access Forbidden",
  },
  UnauthorizedError: {
    code: 401,
    message: "Unauthorized Error",
  },
};

module.exports = statusCode;
