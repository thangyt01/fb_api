-- --------------------------------------------------------

-- Host:                         127.0.0.1

-- Server version:               5.6.30 - MySQL Community Server (GPL)

-- Server OS:                    Win64

-- HeidiSQL Version:             11.3.0.6295

-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */

;

/*!40101 SET NAMES utf8 */

;

/*!50503 SET NAMES utf8mb4 */

;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */

;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */

;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */

;

-- Dumping structure for table nodejs_apis_boilerplate.permissions

CREATE TABLE
    IF NOT EXISTS `permissions` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `model` enum('user', 'service') NOT NULL,
        `action` enum(
            'read',
            'create',
            'update',
            'delete',
            'approve',
            'reset_password',
            'view_all',
            'payment',
            'download'
        ) NOT NULL,
        `created_by` int(10) unsigned DEFAULT NULL,
        `updated_by` int(10) unsigned DEFAULT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `deleted_at` datetime DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8;

-- Dumping data for table nodejs_apis_boilerplate.permissions: ~7 rows (approximately)

/*!40000 ALTER TABLE `permissions` DISABLE KEYS */

;

INSERT INTO
    `permissions` (
        `id`,
        `model`,
        `action`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`,
        `deleted_at`
    )
VALUES (
        1,
        'user',
        'read',
        1,
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        2,
        'user',
        'create',
        1,
        NULL,
        '2022-10-15 09:53:49',
        '2022-10-15 09:53:49',
        NULL
    ), (
        3,
        'user',
        'update',
        1,
        NULL,
        '2022-10-15 09:54:15',
        '2022-10-15 09:54:15',
        NULL
    ), (
        4,
        'user',
        'delete',
        1,
        NULL,
        '2022-10-15 09:54:19',
        '2022-10-15 09:54:26',
        NULL
    ), (
        5,
        'user',
        'approve',
        1,
        NULL,
        '2022-10-15 09:54:35',
        '2022-10-15 09:54:35',
        NULL
    ), (
        6,
        'user',
        'view_all',
        1,
        NULL,
        '2022-10-15 09:54:56',
        '2022-10-15 09:54:56',
        NULL
    ), (
        7,
        'user',
        'download',
        1,
        NULL,
        '2022-10-15 09:55:03',
        '2022-10-15 09:55:03',
        NULL
    );

/*!40000 ALTER TABLE `permissions` ENABLE KEYS */

;

-- Dumping structure for table nodejs_apis_boilerplate.roles

CREATE TABLE
    IF NOT EXISTS `roles` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `description` varchar(255) DEFAULT NULL,
        `created_by` int(10) unsigned DEFAULT NULL,
        `updated_by` int(10) unsigned DEFAULT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `deleted_at` datetime DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8;

-- Dumping data for table nodejs_apis_boilerplate.roles: ~2 rows (approximately)

/*!40000 ALTER TABLE `roles` DISABLE KEYS */

;

INSERT INTO
    `roles` (
        `id`,
        `name`,
        `description`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`,
        `deleted_at`
    )
VALUES (
        1,
        'admin',
        'Quản trị viên hệ thống',
        1,
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        2,
        'user',
        'Người dùng',
        1,
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        3,
        'mod',
        'Mod',
        1,
        NULL,
        NULL,
        NULL,
        NULL
    );

/*!40000 ALTER TABLE `roles` ENABLE KEYS */

;

-- Dumping structure for table nodejs_apis_boilerplate.role_permissions

CREATE TABLE
    IF NOT EXISTS `role_permissions` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `role_id` int(10) unsigned NOT NULL,
        `model` enum('user', 'service') NOT NULL,
        `action` enum(
            'read',
            'create',
            'update',
            'delete',
            'approve',
            'reset_password',
            'view_all',
            'payment',
            'download'
        ) NOT NULL,
        `created_by` int(10) unsigned DEFAULT NULL,
        `updated_by` int(10) unsigned DEFAULT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `deleted_at` datetime DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8;

-- Dumping data for table nodejs_apis_boilerplate.role_permissions: ~4 rows (approximately)

/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */

;

INSERT INTO
    `role_permissions` (
        `id`,
        `role_id`,
        `model`,
        `action`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`,
        `deleted_at`
    )
VALUES (
        1,
        1,
        'user',
        'read',
        1,
        NULL,
        '2022-10-15 09:55:59',
        '2022-10-15 09:58:36',
        NULL
    ), (
        2,
        1,
        'user',
        'create',
        1,
        NULL,
        '2022-10-15 09:58:35',
        '2022-10-15 09:58:37',
        NULL
    ), (
        3,
        1,
        'user',
        'update',
        1,
        NULL,
        '2022-10-15 09:58:46',
        '2022-10-15 09:58:46',
        NULL
    ), (
        4,
        1,
        'user',
        'delete',
        1,
        NULL,
        '2022-10-15 09:58:53',
        '2022-10-15 09:58:55',
        NULL
    );

/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */

;

-- Dumping structure for table nodejs_apis_boilerplate.sequelizemeta

CREATE TABLE
    IF NOT EXISTS `sequelizemeta` (
        `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        PRIMARY KEY (`name`),
        UNIQUE KEY `name` (`name`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

-- Dumping data for table nodejs_apis_boilerplate.sequelizemeta: ~5 rows (approximately)

/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */

;

INSERT INTO
    `sequelizemeta` (`name`)
VALUES ('permission.js'), ('role_permission.js'), ('role.js'), ('user_role.js'), ('user.js');

/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */

;

-- Dumping structure for table nodejs_apis_boilerplate.users

CREATE TABLE
    IF NOT EXISTS `users` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `username` varchar(255) NOT NULL,
        `firstname` varchar(255) NOT NULL,
        `lastname` varchar(255) NOT NULL,
        `birthday` datetime DEFAULT NULL,
        `gender` enum('male', 'female', 'other') DEFAULT 'other',
        `phone` varchar(255) DEFAULT NULL,
        `email` varchar(255) DEFAULT NULL,
        `password` varchar(2000) DEFAULT NULL,
        `avatar_id` int(10) unsigned DEFAULT NULL,
        `status` enum('draft', 'active', 'inactive') NOT NULL DEFAULT 'active',
        `last_login_at` datetime DEFAULT NULL,
        `refresh_token` varchar(255) DEFAULT NULL,
        `refresh_token_exp` datetime DEFAULT NULL,
        `created_by` int(10) unsigned DEFAULT NULL,
        `updated_by` int(10) unsigned DEFAULT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `deleted_at` datetime DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8;

-- Dumping data for table nodejs_apis_boilerplate.users: ~2 rows (approximately)

/*!40000 ALTER TABLE `users` DISABLE KEYS */

;

INSERT INTO
    `users` (
        `id`,
        `username`,
        `firstname`,
        `lastname`,
        `birthday`,
        `gender`,
        `phone`,
        `email`,
        `password`,
        `avatar_id`,
        `status`,
        `last_login_at`,
        `refresh_token`,
        `refresh_token_exp`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`,
        `deleted_at`
    )
VALUES (
        1,
        'admin',
        'thang',
        'dang',
        NULL,
        'other',
        NULL,
        'thangyt00@gmail.com',
        '$2a$08$F80p.aAYFrGI8/YygqnYreB/rIReCoO6z4M8IykUeR1IX125CZd.S',
        NULL,
        'active',
        '2022-10-15 11:39:06',
        'hY5kbl5PUxI3bMWaIqyAz09r',
        '2022-11-14 11:32:56',
        NULL,
        NULL,
        '2022-10-06 18:39:10',
        '2022-10-15 11:39:06',
        NULL
    ), (
        2,
        'thangyt01',
        'thang',
        'dang',
        NULL,
        'other',
        NULL,
        'thangyt00@gmail.com',
        '$2a$08$IW2rvKdjCljlI.8DtZhfbO8WJRJz3mTJp.eXSOwvMQiNj5IJFreqa',
        NULL,
        'active',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '2022-10-06 18:41:22',
        '2022-10-06 18:41:22',
        NULL
    );

/*!40000 ALTER TABLE `users` ENABLE KEYS */

;

-- Dumping structure for table nodejs_apis_boilerplate.user_role

CREATE TABLE
    IF NOT EXISTS `user_role` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `user_id` int(11) unsigned NOT NULL,
        `role_id` int(11) unsigned NOT NULL,
        `created_by` int(10) unsigned DEFAULT NULL,
        `updated_by` int(10) unsigned DEFAULT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `deleted_at` datetime DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8;

-- Dumping data for table nodejs_apis_boilerplate.user_role: ~0 rows (approximately)

/*!40000 ALTER TABLE `user_role` DISABLE KEYS */

;

INSERT INTO
    `user_role` (
        `id`,
        `user_id`,
        `role_id`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`,
        `deleted_at`
    )
VALUES (1, 1, 1, 1, NULL, NULL, NULL, NULL);

/*!40000 ALTER TABLE `user_role` ENABLE KEYS */

;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */

;

/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */

;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */

;

/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */

;