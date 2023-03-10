require('dotenv').config();

// User Model
// gender
const GENDER_MALE = 'male';
const GENDER_FEMALE = 'female';
const GENDER_SECRET = 'secret';

// role
const ROLE_CUSTOMER = 'customer'; // customer : only login to client website
const ROLE_ADMIN = 'admin'; // admin : full roles in admin website
const ROLE_CASHIER = 'cashier';
const ROLE_INVENTORY = 'inventory';

// role
const STATUS_PAID = 'paid';
const STATUS_UNPAID = 'unpaid';

const DOCUMENT_TYPE_VIDEO = 'video';
const DOCUMENT_TYPE_IMAGE = 'image';
const DOCUMENT_TYPE_OTHER = 'other';

const PRIVATE_CHAT = 'PRIVATE_CHAT';
const GROUP_CHAT = 'GROUP_CHAT';

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;
const PORT = process.env.PORT;

// Number of loaded posts
const LIMIT_POSTS = 5;

module.exports = {
    GENDER_MALE,
    GENDER_FEMALE,
    GENDER_SECRET,
    ROLE_CUSTOMER,
    ROLE_ADMIN,
    ROLE_CASHIER,
    ROLE_INVENTORY,
    JWT_SECRET,
    MONGO_URI,
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_DATABASE_NAME,
    PORT,
    STATUS_PAID,
    STATUS_UNPAID,
    DOCUMENT_TYPE_VIDEO,
    DOCUMENT_TYPE_IMAGE,
    DOCUMENT_TYPE_OTHER,
    PRIVATE_CHAT,
    GROUP_CHAT,
    LIMIT_POSTS,
};
