const config = require('config')

export const SECRET_ACCESS_TOKEN = 'secret_access_token'
export const SECRET_ACCESS_TOKEN_EXPIRE = 15 * 24 * 60 * 60
export const SECRET_REFRESH_ACCESS_TOKEN = 'refresh_access_token'
export const REFRESH_TOKEN_LENGTH = 24
export const SECRET_REFRESH_ACCESS_TOKEN_EXPIRE = 30 * 24 * 60 * 60
export const COOKIE_TOKEN_KEY = 'auth-token'
export const SECRET_SESSION = config.get('session.secret') || 'secret'
export const VERIFY_TYPE = {
    0: 'active_account',
    1: 'forgot_password'
}
export const ACCOUNT_STATUS = {
    NOT_ACTIVE: 1,
    ACTIVE: 1
}