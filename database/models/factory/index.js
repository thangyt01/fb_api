import { faker } from '@faker-js/faker'
import { AuthService } from '../../../src/components/auth/authService'
const moment = require('moment')

export class Factory {
    static async createUsers(quantity) {
        try {
            const p = []
            for (let i = 0; i < quantity; i++) {
                const gender = faker.name.sex()
                const user = {
                    username: faker.internet.userName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    phone: faker.phone.number('##########'),
                    firstname: faker.name.firstName(gender),
                    lastname: faker.name.lastName(gender),
                    gender,
                    address: faker.address.streetAddress(),
                    birthday: moment(faker.date.birthdate({ min: 16, max: 80, mode: 'age' })).format('YYYY-MM-DD')
                }
                p.push(AuthService.register(user))
            }
            await Promise.all(p)
            return true
        } catch (e) {
            console.log("[Factory][createUsers] có lỗi", e)
            return false
        }
    }
}