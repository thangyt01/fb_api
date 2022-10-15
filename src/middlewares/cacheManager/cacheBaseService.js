export class CacheBaseService {
    static get driver() {
        throw Error('driver is not required!');
    }
}