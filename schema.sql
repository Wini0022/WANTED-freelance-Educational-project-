CREATE DATABASE IF NOT EXISTS `wanted`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `wanted`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

START TRANSACTION;

CREATE TABLE `Applications` (
  `id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `award` int DEFAULT NULL,
  `award_desc` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `deadline` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'No deadline',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int NOT NULL DEFAULT '0',
  `executor_id` int DEFAULT NULL,
  `category_id` int UNSIGNED DEFAULT NULL,
  `currency_id` int UNSIGNED DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `archived_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `application_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `executor_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `owner_last_read_message_id` int DEFAULT NULL,
  `executor_last_read_message_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `chat_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `currencies` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `requests` (
  `id` int NOT NULL,
  `application_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `status` tinyint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `admin_comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` tinyint NOT NULL DEFAULT '0',
  `experience_months` int DEFAULT NULL,
  `user_desc` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `Applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_currency_id` (`currency_id`),
  ADD KEY `idx_app_category_id` (`category_id`),
  ADD KEY `idx_app_currency_id` (`currency_id`);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_chat` (`application_id`,`owner_id`,`executor_id`);

ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_time` (`chat_id`,`created_at`);

ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nickname` (`nickname`);

ALTER TABLE `Applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `currencies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Applications`
  ADD CONSTRAINT `fk_app_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_app_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `categories` (`id`, `name`) VALUES
  (1, 'BackEnd'),
  (2, 'FrontEnd'),
  (3, 'Transit');

INSERT INTO `currencies` (`id`, `name`) VALUES
  (9, '$ 🇺🇸'),
  (10, '₽ 🇷🇺'),
  (12, '¥ 🇨🇳'),
  (13, '¥ 🇯🇵'),
  (14, '€ 🇪🇺'),
  (15, '£ 🇬🇧'),
  (16, '$ 🇧🇷');

COMMIT;
