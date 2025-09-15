CREATE TABLE IF NOT EXISTS `RPS_USER_DATA` (
    `guildId` varchar(25) NOT NULL,
    `userId` varchar(25) NOT NULL,
    `wins` int(11) NOT NULL DEFAULT 0,
    `losses` int(11) NOT NULL DEFAULT 0,
    `ties` int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (`guildId`, `userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;