import {
    io
} from '../../../bin/www';

// get name space of chat socket
let chatSocket = io.of('/chat');
require('./chatSocket')(chatSocket)