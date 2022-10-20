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