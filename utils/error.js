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
};

module.exports = statusCode;
