import axios from 'axios'
import { URL } from './constant'
const config = require('config')
const Logger = require('../../src/libs/logger')
const log = new Logger(__dirname)

const elasticConfig = config.get('elasticSearch')
const host = elasticConfig.host || 'localhost'
const port = elasticConfig.port || 9200
const username = elasticConfig.username
const password = elasticConfig.password

const eHost = username ? `http://${username}:${password}@${host}:${port}` : `htpp://${host}:${port}`
const http = axios.create({
    baseURL: eHost,
    timeout: 10000,
})

export class ElasticSearch {
    static get http() {
        return http
    }

    static async infoNode() {
        try {
            const res = await this.http.get(URL.INFO_NODE)
            return res.data
        } catch (e) {
            log.error('infoNode có lỗi', e)
            return null
        }
    }

    static async listIndex() {
        try {
            const res = await this.http.get(URL.LIST_INDEXS)
            return res.data
        } catch (e) {
            log.error('listIndex có lỗi', e)
            return null
        }
    }

    static async createIndex(index, option = {}) {
        try {
            const { number_of_shards, number_of_replicas } = option
            const body = {
                settings: {
                    index: {
                        number_of_shards,
                        number_of_replicas
                    }
                }
            }
            const res = await this.http.put(URL.BASE + index, body)
            return res.data
        } catch (e) {
            log.error('createIndex có lỗi', e)
            return null
        }
    }

    static async deleteIndex(index) {
        try {
            const res = await this.http.delete(URL.BASE + index)
            return res.data
        } catch (e) {
            log.error('deleteIndex có lỗi', e)
            return null
        }
    }

    static async deleteIndexs(indexs = []) {
        try {
            const strIndexs = indexs.join(',')
            const res = await this.http.delete(URL.BASE + strIndexs)
            return res.data
        } catch (e) {
            log.error('deleteIndexs có lỗi', e)
            return null
        }
    }

    static async deleteAllIndex() {
        try {
            const res = await this.http.delete(URL.DELETE_ALL_INDEX)
            return res.data
        } catch (e) {
            log.error('deleteAllIndex có lỗi', e)
            return null
        }
    }

    static async defineProperties(params) {
        try {
            const { index_name, body } = params
            const res = await this.http.put(URL.BASE + index_name + '/_mapping', body)
            return res.data
        } catch (e) {
            log.error('defineProperties có lỗi', e)
            return null
        }
    }

    static async insertOrUpdateDoc(params) {
        try {
            const { index_name, type_name = '_doc', id = '', record } = params
            const res = await this.http.post(`${URL.BASE}${index_name}/${type_name}/${id}`, record)
            return res.data
        } catch (e) {
            log.error('insertOrUpdateDoc có lỗi', e)
            return null
        }
    }

    static async bulkDocs(records) {
        try {
            const res = await this.http.post(URL.BULK, records, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return res.data
        } catch (e) {
            log.error('bulkDocs có lỗi', e)
            return null
        }
    }

    static async getDoc(params) {
        try {
            const { index_name, type_name = '_doc', id = '', source = false, fields = [] } = params
            let url = `${URL.BASE}${index_name}/${type_name}/${id}`
            if (source) url += '/_source'
            if (fields.length) {
                url += `?_source=${fields.join(',')}`
            }
            const res = await this.http.get(url)
            return res.data
        } catch (e) {
            log.error('getDoc có lỗi', e)
            return null
        }
    }

    static async search(params) {
        try {
            const { index_name, source = false, fields = [], query, page, limit } = params
            let url = ''
            if (index_name) url += `/${index_name}`
            url += `${URL.SEARCH}`
            if (source) url += '/_source'
            if (fields.length) {
                url += `?_source=${fields.join(',')}`
            }
            const res = await this.http.post(url, {
                from: page * limit,
                size: limit,
                query
            })
            return res.data
        } catch (e) {
            log.error('search có lỗi', e)
            return null
        }
    }

    static async deleteDoc(params) {
        try {
            const { index_name, type_name = '_doc', id = '' } = params
            const res = await this.http.delete(`${URL.BASE}${index_name}/${type_name}/${id}`)
            return res.data
        } catch (e) {
            log.error('deleteDoc có lỗi', e)
            return null
        }
    }
}

// ElasticSearch.query({
//     index_name: 'users',
//     query: {
//         multi_match: {
//             query: "Thang xuan"
//         }
//     }
// })