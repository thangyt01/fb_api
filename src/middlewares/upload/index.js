import { FILE_MEDIA_TYPE } from '../../components/post/postConstant'
import { HTTP_STATUS } from '../../helpers/code'
import { respondItemSuccess, respondWithError } from '../../helpers/messageResponse'

const File = require('../../../database/mongoDb/model/File')
const streamifier = require('streamifier')
const cloudinary = require('cloudinary').v2
const config = require('config')
const cloudinaryConfig = config.get('cloudinary')

cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret,
})

export const uploadFiles = async (req, res) => {
    try {
        const result = await upload(req)
        if (result.success) {
            res.json(respondItemSuccess(result.data))
        } else {
            res.json(respondWithError(result.code, result.message, result.data))
        }
    } catch (error) {
        console.log("uploadFiles có lỗi", error)
        res.json(respondWithError(HTTP_STATUS[1007].code, HTTP_STATUS[1007].message))
    }
}

const streamUpload = (req) => {
    return Promise.all(req.files.map(file => {
        const params = { folder: cloudinaryConfig.folder, resource_type: 'auto', public_id: getFileName(file.originalname) }
        if (file.mimetype === 'image/webp' || file.mimetype === 'video/mp4') {
            delete params.public_id
        }
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(params,
                (error, result) => {
                    if (result) {
                        resolve(result)
                    } else {
                        reject(error)
                    }
                }
            )
            if (file.size > cloudinaryConfig.max_size) resolve()
            streamifier.createReadStream(file.buffer).pipe(stream)
        })
    }))
}

export async function upload(req, option = {}) {
    if (option.isChangeAvatar) {
        if (!req.file || req.file.mimetype !== 'image/webp') {
            throw new Error('Upload file không hợp lệ!')
        }
        req.files = [req.file]
    }
    let result = await streamUpload(req)
    result = result.filter(item => !!item)
    const files = await File.create(result.map(item => {
        return {
            name: item.public_id,
            origin_name: item.original_filename,
            url: item.url,
            type: Object.values(FILE_MEDIA_TYPE).includes(item.resource_type) ? item.resource_type : FILE_MEDIA_TYPE.OTHER,
            upload_by: req.loginUser.id,
        }
    }))
    return {
        success: true,
        code: HTTP_STATUS[1000].code,
        message: HTTP_STATUS[1000].message,
        data: files
    }
}

function getFileName(fileName) {
    return Date.now() + fileName
}