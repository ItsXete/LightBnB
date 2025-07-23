CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `properties` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `owner_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `cost_per_night` INTEGER NOT NULL,
    `parking_spaces` INTEGER NOT NULL,
    `number_of_bathrooms` INTEGER NOT NULL,
    `number_of_bedrooms` INTEGER NOT NULL,
    `thumbnail_photo_url` VARCHAR(255),
    `cover_photo_url` VARCHAR(255),
    `country` VARCHAR(100),
    `street` VARCHAR(100),
    `city` VARCHAR(100),
    `province` VARCHAR(100),
    `post_code` VARCHAR(20),
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `reservations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `guest_id` BIGINT UNSIGNED NOT NULL,
    `property_id` BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (`guest_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`)
);

CREATE TABLE `property_reviews` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `reservation_id` BIGINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `rating` INTEGER NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`)
);
