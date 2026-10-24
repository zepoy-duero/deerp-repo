/**
 * Form Validator - Validates form data
 * Single Responsibility: Only validates form inputs
 */
class FormValidator extends IValidator {
    constructor(config = {}) {
        super();
        this.requiredFields = config.requiredFields || [];
        this.customRules = config.customRules || {};
    }

    validate(formElement) {
        const errors = [];

        if (!formElement) {
            return { valid: false, errors };
        }

        if (!formElement.checkValidity()) {
            errors.push('Please fill all required fields correctly.');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    isValid(formElement) {
        return this.validate(formElement).valid;
    }

    addCustomRule(fieldName, rule) {
        this.customRules[fieldName] = rule;
    }

    validateField(fieldName, value) {
        if (this.customRules[fieldName]) {
            return this.customRules[fieldName](value);
        }
        return { valid: true };
    }
}