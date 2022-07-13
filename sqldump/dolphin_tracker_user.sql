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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `access_expired` int DEFAULT NULL,
  `signup_at` varchar(45) NOT NULL,
  `login_at` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,-1,'https://robohash.org/123',36000,'2022-06-26 16:14:01.516','2022-07-11 17:33:21.112','test@email.com','$2b$10$/durZyjSrtQLt6VZYTVWKOpNq5KCY/Jgk8wyGm','test','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjotMSwibmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcm9ib2hhc2gub3JnLzEyMyIsImlhdCI6MTY1NzU2MDgwMX0.oNVbHdxDmwxIGEiD6s7Hkcp0hZ7MksQilQ2yxXba1q4'),(8,2,'https://robohash.org/666',36000,'2022-07-05 00:50:08.323','2022-07-05 02:04:45.148','recorder@test.com','$2b$10$Bq5ymZTxMKanyjg8MLPnv.cHJbwFRJZhDuSNs/','recorder','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjoyLCJuYW1lIjoicmVjb3JkZXIiLCJlbWFpbCI6InJlY29yZGVyQHRlc3QuY29tIiwicGljdHVyZSI6bnVsbCwiaWF0IjoxNjU2OTg2Njg1fQ.we7WOpkom0Ny7O3aG4g7_r9endnpqzZ40ucsfYDsVOs'),(9,1,'https://robohash.org/777',36000,'2022-07-05 00:50:33.626','2022-07-05 02:05:50.610','kuroshio@test.com','$2b$10$UOPfMAk7vr0cgrCv7hIOYeP1.aviUdMO0uhDZy','kuroshiao','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjoxLCJuYW1lIjoia3Vyb3NoaWFvIiwiZW1haWwiOiJrdXJvc2hpb0B0ZXN0LmNvbSIsInBpY3R1cmUiOm51bGwsImlhdCI6MTY1Njk4Njc1MH0.RBgdkwKXnjvkBaN87rsj-nL92DT8fUKUHJihlPUHzpw'),(10,-1,'https://robohash.org/888',36000,'2022-07-05 00:50:48.245','2022-07-12 01:03:54.092','admin@test.com','$2b$10$J6TM4bjwSrABT20c2wG6wuQO/GaloKhKg00ITJ','admin','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjotMSwibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInBpY3R1cmUiOiJodHRwczovL3JvYm9oYXNoLm9yZy84ODgiLCJpYXQiOjE2NTc1ODc4MzR9.Ek6IzGVF9ALfsukIBugMOfwIIQtmQ7yIttoZigkDwXM'),(18,2,'https://robohash.org/17',36000,'2022-07-11 17:31:38.055',NULL,'test@email3.com','$2b$10$UIc3z2nCLKL2xe6Qrj2f9OM5rnHEVdSvmDK2AY','test','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjoyLCJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEBlbWFpbDMuY29tIiwicGljdHVyZSI6bnVsbCwiaWF0IjoxNjU3NTYwNjk4fQ.D3_CR6Jdhc3Sry7EZWgk_k6cl3Ij2g5v-WQE_u5XVKE');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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

-- Dump completed on 2022-07-12 13:21:45
