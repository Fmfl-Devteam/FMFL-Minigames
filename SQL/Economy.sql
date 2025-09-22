CREATE TABLE `EconomyUsers` (
  `userId` varchar(25) NOT NULL,
  `guildId` varchar(25) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `bankBalance` int(11) NOT NULL DEFAULT 0,
  `inventory` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`inventory`)),
  `workStreak` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userId`,`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci

CREATE TABLE `EconomyLastExecutes` (
  `userId` varchar(25) NOT NULL,
  `guildId` varchar(25) NOT NULL,
  `work` int(11) NOT NULL DEFAULT 0,
  `beg` int(11) NOT NULL DEFAULT 0,
  `crime` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userId`,`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci