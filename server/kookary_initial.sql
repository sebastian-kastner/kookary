-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: localhost    Database: kookary
-- ------------------------------------------------------
-- Server version	8.0.30-0ubuntu0.20.04.2

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
-- Current Database: `kookary`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `kookary` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `kookary`;

--
-- Table structure for table `image_to_recipe`
--

DROP TABLE IF EXISTS `image_to_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image_to_recipe` (
  `recipe_id` int NOT NULL,
  `media_object_id` int NOT NULL,
  KEY `FK_recipe_image_to_recipe` (`recipe_id`),
  KEY `FK_media_object_recipe_image` (`media_object_id`),
  CONSTRAINT `FK_media_object_recipe_image` FOREIGN KEY (`media_object_id`) REFERENCES `media_object` (`media_object_id`),
  CONSTRAINT `FK_recipe_image_to_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`),
  PRIMARY KEY (`recipe_id`, `media_object_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_to_recipe`
--

LOCK TABLES `image_to_recipe` WRITE;
/*!40000 ALTER TABLE `image_to_recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `image_to_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredient` (
  `ingredient_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `season_start` int DEFAULT NULL,
  `season_end` int DEFAULT NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES (1,'Artischocke',7,9),(2,'Aubergine',6,10),(3,'Blumenkohl',5,11),(4,'Dicke Bohnen',6,8),(5,'Grüne Bohnen',6,10),(6,'Brokkoli',6,11),(7,'Erbsen',6,8),(8,'Fenchel',6,10),(9,'Frühlingszwiebeln',5,10),(10,'Grünkohl',10,1),(11,'Knollensellerie',6,12),(12,'Kohlrabi',3,10),(13,'Kürbis',8,11),(14,'Mairübchen',5,7),(15,'Mais',7,10),(16,'Mangold',5,10),(17,'Meerettich',10,1),(18,'Karotten',7,11),(19,'Pak Choi',5,10),(20,'Paprikaschote',6,10),(21,'Pastinaken',11,1),(22,'Petersilienwurzel',11,1),(23,'Pfifferlinge',7,10),(24,'Lauch',8,12),(25,'Radieschen',4,10),(26,'Rettich',5,11),(27,'Romanesco',5,10),(28,'Rote Bete',10,1),(29,'Blaukraut',5,11),(30,'Gurke',5,8),(31,'Spargel',4,6),(32,'Spinat',4,10),(33,'Spitzkohl',5,10),(34,'Staudensellerie',6,10),(35,'Steckrübe',11,2),(36,'Steinpilz',8,10),(37,'Süßkartoffel',9,10),(38,'Tomate',7,9),(39,'Weißkohl',9,11),(40,'Wirsing',6,2),(41,'Zucchini',6,9),(42,'Zuckerschoten',5,6),(43,'Äpfel',8,10),(44,'Aprikosen',7,8),(45,'Birnen',7,10),(46,'Brombeeren',7,9),(47,'Erdbeeren',5,7),(48,'Haselnüsse',9,10),(49,'Heidelbeeren',6,9),(50,'Himbeeren',6,9),(51,'Kirschen',6,8),(52,'Maronen',9,12),(53,'Nektarinen',7,9),(54,'Pfirsiche',7,9),(55,'Pflaumen',6,9),(56,'Quitten',10,11),(57,'Rhabarber',3,8),(58,'Walnüsse',9,10),(59,'Weintrauben',9,10),(60,'Zwetschgen',6,9),(61,'Bärlauch',3,5),(62,'Basilikum',6,10),(63,'Chicoree',10,4),(64,'Dill',5,10),(65,'Feldsalat',10,3),(66,'Minze',5,10),(67,'Radicchio',6,10),(68,'Rucola',3,11),(69,'Salbei',5,8),(70,'Schnittlauch',3,9),(71,'Zwiebeln',NULL,NULL);
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_object`
--

DROP TABLE IF EXISTS `media_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_object` (
  `media_object_id` int NOT NULL AUTO_INCREMENT,
  `file_path` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`media_object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_object`
--

LOCK TABLES `media_object` WRITE;
/*!40000 ALTER TABLE `media_object` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_object` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe` (
  `recipe_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `servings` int DEFAULT NULL,
  `source` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `marked` tinyint(1) DEFAULT '0',
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredient`
--

DROP TABLE IF EXISTS `recipe_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredient` (
  `recipe_ingredient_id` int NOT NULL AUTO_INCREMENT,
  `recipe_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  `quantity` varchar(10) DEFAULT NULL,
  `unit` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`recipe_ingredient_id`),
  KEY `recipe_ingredient_FK` (`recipe_id`),
  KEY `recipe_ingredient_FK_1` (`ingredient_id`),
  CONSTRAINT `FK_ingredient_recipe_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`),
  CONSTRAINT `FK_recipe_recipe_ingredient` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredient`
--

LOCK TABLES `recipe_ingredient` WRITE;
/*!40000 ALTER TABLE `recipe_ingredient` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_to_recipe`
--

DROP TABLE IF EXISTS `tag_to_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag_to_recipe` (
  `tag_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`tag_id`,`recipe_id`),
  UNIQUE KEY `chf_tags_to_recipe_UN` (`tag_id`,`recipe_id`),
  UNIQUE KEY `tag_to_recipe_UN` (`tag_id`,`recipe_id`),
  KEY `chf_tags_to_recipe_FK` (`recipe_id`),
  CONSTRAINT `FK_recipe_tag_to_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`),
  CONSTRAINT `FK_tag_tag_to_recipe` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_to_recipe`
--

LOCK TABLES `tag_to_recipe` WRITE;
/*!40000 ALTER TABLE `tag_to_recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag_to_recipe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-02 22:11:52
