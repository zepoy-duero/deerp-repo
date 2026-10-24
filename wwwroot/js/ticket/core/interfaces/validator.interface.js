/**
 * Validator Interface - Defines contract for validation operations
 */
class IValidator {
    validate(data) {
        throw new Error('validate() must be implemented');
    }

    isValid(data) {
        throw new Error('isValid() must be implemented');
    }
}