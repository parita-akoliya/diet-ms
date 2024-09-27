import APIError from './APIError';
import SuccessRes from './SuccessRes';
const httpStatus = require('http-status');

class ResponseHelper {
    getErrorMessage(error, errorType, data) {
        let apiError
        switch (errorType) {
            case 'MongoError':
                apiError = new APIError({
                    message: 'Email Address Already Exists',
                    data: data,
                    status: httpStatus.CONFLICT,
                });
                break;
            case 'ValidationError':
                apiError = new APIError({
                    message: error.message,
                    data: data,
                    status: httpStatus.CONFLICT,
                });
                break;
            default:
                apiError = new APIError({
                    message: 'User not Registered',
                    data: data,
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                });
                break;
        }
        return apiError;
    }
    sendSuccessResponse(data, msg, status) {
        return new SuccessRes({
            message: msg,
            data: data,
            status: status
        });
    }
    checkError(error) {
        return this.getErrorMessage(error, error.name, {});
    }
}

module.exports = ResponseHelper;
