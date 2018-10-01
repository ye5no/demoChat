const errorMessages = {
  10: 'Wrong request',
  100: 'Incorrect username or password',
  101: 'Authorization required',
  102: 'Re-authorization is not possible',
  103: 'E-mail already in use',
  104: 'Incorrect e-mail',
	105: 'Auth error',
  400: 'DB validation error',
  404: 'Not found',
	500: 'Internal error',
  600: 'Wrong request',
  601: 'Required param missed in request',
	800: 'Smart contract address not found',
	801: 'DAPP not available',
};

function AppError(httpError, appError, errors) {
  this.name = 'ApplicationError';
  this.status = httpError;
  this.message = `${appError}: ${errorMessages[appError]}`;
  this.errs = errors;
  this.stack = (new Error()).stack;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

export default AppError;
