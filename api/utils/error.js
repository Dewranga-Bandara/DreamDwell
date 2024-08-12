export const errorHandler = (statusCode, message) => {
    const error = new Error(); // JS Error constructor
    error.statusCode = statusCode;
    error.message = message;
    return error;
  };