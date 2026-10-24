/**
 * User Model - Represents current user information
 */
class UserModel {
    constructor(data = {}) {
        this.USER_CODE = data.USER_CODE || null;
        this.EMP_NAME = data.EMP_NAME || null;
        this.EMAIL_ADDRESS = data.EMAIL_ADDRESS || null;
        this.DATE_TODAY = data.DATE_TODAY || null;
    }

    isValid() {
        return this.USER_CODE && this.EMP_NAME && this.EMAIL_ADDRESS && this.DATE_TODAY;
    }
}