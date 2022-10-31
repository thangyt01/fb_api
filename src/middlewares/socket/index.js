import {
    io
} from '../../../bin/www'

// get name space of socket
let bks = io.of('/')
require('./socket')(bks)