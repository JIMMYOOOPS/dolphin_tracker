-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: stylish-database.cskoifygolut.us-east-1.rds.amazonaws.com    Database: dolphin_tracker
-- ------------------------------------------------------
-- Server version	8.0.28

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `dolphin_img`
--

DROP TABLE IF EXISTS `dolphin_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dolphin_img` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(255) DEFAULT NULL,
  `obv_dolphin_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dolphin_img`
--

LOCK TABLES `dolphin_img` WRITE;
/*!40000 ALTER TABLE `dolphin_img` DISABLE KEYS */;
INSERT INTO `dolphin_img` VALUES (1,'','Be'),(2,'https://drive.google.com/uc?export=view&id=1-9HXRCYI4DNSlJBykqqmXH5xctqIqRGQ','Bo'),(3,'','Dc'),(4,'https://drive.google.com/uc?export=view&id=1OjBPx1nnKwaslp0c6Sf7RSpXH9i2QjgT','Fa'),(5,'https://drive.google.com/uc?export=view&id=1ZaGXuLD4ivYN1DjMMkIkcNaTJjDDLzyx','Gg'),(6,'https://drive.google.com/uc?export=view&id=1A1yYHlo6_mlwaEeaAuF1Wq8a1DVXT9wC','Gm'),(7,'','Kb'),(8,'https://drive.google.com/uc?export=view&id=1y6z8gM1eeIsGk8j4s7suCUbvO39PnPdB','Ks'),(9,'https://drive.google.com/uc?export=view&id=1ZBbnuGJH2C2yfxWq0D25e0wyDi5t4VUM','Lh'),(10,'','Mg'),(11,'https://drive.google.com/uc?export=view&id=1DKU0spDTSItfQ0FcUyXRXyToLIR-5-6c','Mn'),(12,'https://drive.google.com/uc?export=view&id=1wFdwbR14Sah9-egaxCDNxtBARAfTaunr','Oo'),(13,'https://drive.google.com/uc?export=view&id=1bUUXMRR-jdAlqiI4wGxPG0f6DTcMbHAc','Pc'),(14,'','Pe'),(15,'https://drive.google.com/uc?export=view&id=1AT5KJW8BsAoKfc6ITSiLhzUWpN8GsUrE','Pm'),(16,'https://drive.google.com/uc?export=view&id=12cBu2WX1aj6JZ2G_RHDQHjKQ4d6pYz87','Sa'),(17,'https://drive.google.com/uc?export=view&id=1Xkih3KfoMt5RNbAn4-jZjVn6DRT6StML','Sb'),(18,'https://drive.google.com/uc?export=view&id=1N_R8X7HMdgglnp8Zmd7FrG4DQ1TAPmck','Sl'),(19,'https://drive.google.com/uc?export=view&id=1p7Fx4bWzICk7v-Ow6d8FTDNC80igIeAs','Tt'),(20,'','Z'),(21,'https://drive.google.com/uc?export=view&id=1cIwstnYSZeAOYNuTVweHMnPA9bw6bUgQ','Zc');
/*!40000 ALTER TABLE `dolphin_img` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-12 13:21:12
