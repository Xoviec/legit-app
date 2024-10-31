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
-- Dumping events for database 'legited'
--

--
-- Dumping routines for database 'legited'
--
/*!50003 DROP PROCEDURE IF EXISTS `get_legited_items` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_legited_items`()
BEGIN
    SELECT 
        legited_items.id,
        items.id AS item_id,
        items.name,
        items.sku,
        items.brand,
        items.image,
        legited_items.legited_at,
        legited_items.current_owner,
        users.nickname AS owner
    FROM users
    INNER JOIN legited_items ON users.id = legited_items.current_owner
    INNER JOIN items ON items.id = legited_items.item_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_items` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_items`(
    IN p_nickname VARCHAR(255),
    IN p_sortBy VARCHAR(255),
    IN p_order VARCHAR(4)
)
BEGIN
    DECLARE total_count INT DEFAULT 0;

    -- Pobranie całkowitej liczby przedmiotów użytkownika o podanym pseudonimie
    SELECT COUNT(*) INTO total_count
    FROM legited_items
    WHERE current_owner = (SELECT id FROM users WHERE nickname = p_nickname);

    -- Przygotowanie dynamicznego zapytania SQL do pobrania listy przedmiotów
    SET @sql_query = CONCAT('
        SELECT 
            legited_items.id,
            items.id AS item_id,
            items.name,
            items.sku,
            items.brand,
            items.image,
            legited_items.legited_at
        FROM users
        INNER JOIN legited_items ON users.id = legited_items.current_owner
        INNER JOIN items ON items.id = legited_items.item_id
        WHERE users.nickname = ?
        ORDER BY ', p_sortBy, ' ', p_order
    );

    -- Wykonanie zapytania z dynamicznym sortowaniem
    PREPARE stmt FROM @sql_query;
    SET @nickname = p_nickname;
    EXECUTE stmt USING @nickname;
    DEALLOCATE PREPARE stmt;

    -- Zwrócenie liczby przedmiotów
    SELECT total_count AS total_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-31  2:02:41
