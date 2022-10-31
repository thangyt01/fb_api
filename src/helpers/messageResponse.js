import { HTTP_STATUS } from './code';

export function respondItemSuccess(data, message = 'Success') {
    return {
        code: HTTP_STATUS[1000].code,
        message,
        data,
    };
}

export function respondArraySuccess(data, totalItem, message = 'Success') {
    return {
        code: HTTP_STATUS[1000].code,
        message,
        data,
        totalItem,
    };
}

export function respondWithError(errorCode = HTTP_STATUS[1013].code, message = 'Error', data = {}) {
    return {
        code: errorCode,
        message: errorCode == HTTP_STATUS[1013].code ? 'Lỗi hệ thống. Vui lòng liên hệ kỹ thuật' : message,
        errors: data,
    };
}
