import { AVATAR_DEFAULT } from "../../components/user/userConstant"

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

export function getRandomStringInt(length) {
    if (length < 1) return ''
    let result = ''
    for (let i = 0; i < length; i++) {
        result += getRandomIntInclusive(0, 9)
    }
    return result
}

export function removeRedundant(obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined) {
            delete obj[key]
        }
    })
}

export function hashMapArray(arr, field) {
    return arr.reduce((obj, item) => {
        obj[item[field]] = item
        return obj
    }, {})
}

export function getAvatarDefault(gender) {
    if (!gender || !AVATAR_DEFAULT[gender]) {
        return AVATAR_DEFAULT.OTHER
    }
    return AVATAR_DEFAULT[gender]
}