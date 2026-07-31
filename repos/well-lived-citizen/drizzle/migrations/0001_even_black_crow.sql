CREATE TABLE `consignment_agreements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiryId` int NOT NULL,
	`token` varchar(128) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320) NOT NULL,
	`status` enum('pending','signed','expired','cancelled') NOT NULL DEFAULT 'pending',
	`signatureData` text,
	`pdfStorageKey` varchar(512),
	`pdfStorageUrl` varchar(1024),
	`signerIp` varchar(64),
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`signedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consignment_agreements_id` PRIMARY KEY(`id`),
	CONSTRAINT `consignment_agreements_token_unique` UNIQUE(`token`)
);
