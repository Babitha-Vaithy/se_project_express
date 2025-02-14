const BadRequestError = require("./error/BadRequestError");
const ConflictError = require("./error/ConflictError");
const ForbiddenError = require("./error/ForbiddenError");
const NotFoundError = require("./error/NotFoundError");
const UnauthorizedError = require("./error/UnauthorizedError");

const errorcode = (err, next) => {
  if (err.name === "CastError") {
    next(new BadRequestError("Invalid format"));
  } else if (err.name === "ConflictError") {
    next(new ConflictError("Duplicate Key Error"));
  } else if (err.name === "ForbiddenError") {
    next(new ForbiddenError(" Forbidden Error"));
  } else if (err.name === "DocumentNotFoundError") {
    next(new NotFoundError("Document Not Found Error"));
  } else if (err.name === "UnauthorizedError") {
    next(new UnauthorizedError(" Unauthorized Error"));
  } else {
    next(err);
  }
};
module.exports = errorcode;
