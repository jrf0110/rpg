var errors = {};

/**
 * Authentication Errors
 */

errors.auth = {};

errors.auth.NOT_AUTHENTICATED = {
  type:     "auth"
, code:     "0001"
, httpCode: "401"
, name:     "NOT_AUTHENTICATED"
, message:  "You are not authenticated. Please Login."
};
errors[errors.auth.NOT_AUTHENTICATED.code] = errors.auth.NOT_AUTHENTICATED;

errors.auth.NOT_ALLOWED = {
  type:     "auth"
, code:     "0002"
, httpCode: "403"
, name:     "NOT_ALLOWED"
, message:  "You are not allowed to use this resource."
};
errors[errors.auth.NOT_ALLOWED.code] = errors.auth.NOT_ALLOWED;

errors.auth.INVALID_EMAIL = {
  type:     "auth"
, code:     "0003"
, httpCode: "401"
, name:     "INVALID_EMAIL"
, message:  "Invalid Email. Please try again."
};
errors[errors.auth.INVALID_EMAIL.code] = errors.auth.INVALID_EMAIL;

errors.auth.INVALID_PASSWORD = {
  type:     "auth"
, code:     "0004"
, httpCode: "401"
, name:     "INVALID_PASSWORD"
, message:  "Invalid Password. Please try again."
};
errors[errors.auth.INVALID_PASSWORD.code] = errors.auth.INVALID_PASSWORD;

module.exports = errors;