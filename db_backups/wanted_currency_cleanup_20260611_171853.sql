-- MySQL dump 10.13  Distrib 8.0.40, for macos12.7 (arm64)
--
-- Host: 127.0.0.1    Database: wanted
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (9,'$ 🇺🇸'),(15,'£ 🇬🇧'),(14,'€ 🇪🇺'),(10,'₽ 🇷🇺'),(12,'c¥ 🇨🇳'),(13,'j¥ 🇯🇵'),(16,'R$ 🇧🇷');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Applications`
--

DROP TABLE IF EXISTS `Applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `award` int DEFAULT NULL,
  `award_desc` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `deadline` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'No deadline',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int NOT NULL DEFAULT '0',
  `executor_id` int DEFAULT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `currency_id` int unsigned DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `archived_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_currency_id` (`currency_id`),
  KEY `idx_app_category_id` (`category_id`),
  KEY `idx_app_currency_id` (`currency_id`),
  CONSTRAINT `fk_app_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_app_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Applications`
--

LOCK TABLES `Applications` WRITE;
/*!40000 ALTER TABLE `Applications` DISABLE KEYS */;
INSERT INTO `Applications` VALUES (1,'Make SARABI sait',1000000000,'bank transfer','Description of this offer. What should employer do? \r\nNo more than 2 rows here. ','3 days','2026-05-15 20:02:34',9,NULL,1,9,1,'2026-05-15 20:02:34'),(2,'\"Yandex Go\" backend UI system',50,'Cash','Description of this offer. What should employer do? \r\nNo more than 2 rows here. ','2 weeks','2026-05-31 16:27:34',2,1,2,10,1,NULL),(3,'Pet a dog',10000,'Cash','Properly..','1 hour','2026-06-02 21:31:57',0,NULL,3,14,1,NULL),(6,'Bring me iPhone 17 pro',990,'Card','From UAE please','1 month','2026-05-29 22:56:01',9,2,3,9,1,'2026-05-29 22:56:01'),(7,'FROSTBERRIES, make UI/UX',3200,'Cash','Company which makes round ice slices with special taste inside ','3 months','2026-05-31 16:14:21',0,NULL,1,14,1,NULL),(8,'Give me a cat',300,'Cash/Card','I\'m in Tokio','No deadline','2026-05-31 16:10:38',0,NULL,3,13,1,NULL),(9,'Pet Ares',800,'Cash','Properly','No deadline','2026-05-31 16:32:37',1,NULL,3,16,1,NULL),(10,'Make Apple sait',900000,'Bank transfer','Fastly','2 years','2026-05-31 16:32:37',1,NULL,3,9,1,NULL),(11,'New made offer',90,'Cash','Description of new offer','2 weeks','2026-05-31 16:32:37',1,NULL,2,12,1,NULL);
/*!40000 ALTER TABLE `Applications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-11 17:18:54
