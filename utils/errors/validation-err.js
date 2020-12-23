class ValidationError extends Error {
  constructor(message, fieldName) {
    super(message)
    this.fieldName = fieldName
  }
}

module.exports = ValidationError;
