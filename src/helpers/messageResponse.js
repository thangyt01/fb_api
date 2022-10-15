const httpStatus = require('http-status')
export function respondItemSuccess(data, message = 'Success') {
    return {
        code: httpStatus.OK,
        message,
        data,
    };
}

export function respondArraySuccess(data, totalItem, message = 'Success') {
    return {
        code: httpStatus.OK,
        message,
        data,
        totalItem,
    };
}

export function respondWithError(errorCode = httpStatus.INTERNAL_SERVER_ERROR, message = 'Error', data = {}) {
    return {
        code: errorCode,
        message: errorCode == httpStatus.INTERNAL_SERVER_ERROR ? 'Lỗi hệ thống. Vui lòng liên hệ kỹ thuật' : message,
        errors: data,
    };
}
