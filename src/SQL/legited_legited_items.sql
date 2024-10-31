CREATE DATABASE  IF NOT EXISTS `legited` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `legited`;
-- MySQL dump 10.13  Distrib 8.0.39, for macos14.4 (x86_64)
--
-- Host: localhost    Database: legited
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `legited_items`
--

DROP TABLE IF EXISTS `legited_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legited_items` (
  `id` char(36) NOT NULL,
  `item_id` char(36) DEFAULT NULL,
  `legited_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `current_owner` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `current_owner` (`current_owner`),
  CONSTRAINT `legited_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  CONSTRAINT `legited_items_ibfk_2` FOREIGN KEY (`current_owner`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legited_items`
--

LOCK TABLES `legited_items` WRITE;
/*!40000 ALTER TABLE `legited_items` DISABLE KEYS */;
INSERT INTO `legited_items` VALUES ('998726ac-7620-4466-a7fe-3024dee6591c','58fddb90-ed4c-4777-a381-19249199045d','2024-10-31 00:39:01','f852c61e-2dfc-41ea-b83b-07e34fd24df5'),('ecb909c6-20cc-4faf-84f4-832e3a549a04','58fddb90-ed4c-4777-a381-19249199045d','2024-10-31 00:38:57','00899f0d-91ce-407a-b820-d7f70bd902a4'),('f5a32188-27ac-4830-98f9-19914b8d7b07','2e9a412f-ad07-4af8-beb0-eaff5b6fb0bd','2024-10-31 00:38:18','00899f0d-91ce-407a-b820-d7f70bd902a4');
/*!40000 ALTER TABLE `legited_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-31  2:02:41
