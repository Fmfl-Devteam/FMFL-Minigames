CREATE TABLE IF NOT EXISTS `Counting` (
  `guildId` varchar(25) NOT NULL,
  `channelId` varchar(25) NOT NULL,
  `lastUserId` varchar(25) NOT NULL,
  `counter` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `CountingUsers` (
    `guildId` varchar(25) NOT NULL,
    `userId` varchar(25) NOT NULL,
    `correctCount` int(11) NOT NULL DEFAULT 0,
    `wrongCount` int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (`guildId`, `userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;