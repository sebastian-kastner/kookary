-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 29. Mrz 2022 um 18:48
-- Server-Version: 8.0.28-0ubuntu0.20.04.3
-- PHP-Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `chef`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ingredient`
--

CREATE TABLE `ingredient` (
  `ingredient_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `season_start` int DEFAULT NULL,
  `season_end` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `ingredient`
--

INSERT INTO `ingredient` (`ingredient_id`, `name`, `season_start`, `season_end`) VALUES
(1, 'Artischocke', 6, 8),
(2, 'Aubergine', 5, 9),
(3, 'Blumenkohl', 4, 10),
(4, 'Dicke Bohnen', 5, 7),
(5, 'Grüne Bohnen', 5, 9),
(6, 'Brokkoli', 5, 10),
(7, 'Erbsen', 5, 7),
(8, 'Fenchel', 5, 9),
(9, 'Frühlingszwiebeln', 4, 9),
(10, 'Grünkohl', 9, 0),
(11, 'Knollensellerie', 5, 11),
(12, 'Kohlrabi', 4, 9),
(13, 'Kürbis', 7, 10),
(14, 'Mairübchen', 4, 6),
(15, 'Mais', 6, 9),
(16, 'Mangold', 4, 9),
(17, 'Meerettich', 9, 0),
(18, 'Karotten', 6, 10),
(19, 'Pak Choi', 4, 9),
(20, 'Paprikaschote', 5, 9),
(21, 'Pastinaken', 10, 0),
(22, 'Petersilienwurzel', 10, 0),
(23, 'Pfifferlinge', 6, 9),
(24, 'Lauch', 7, 11),
(25, 'Radieschen', 3, 9),
(26, 'Rettich', 4, 10),
(27, 'Romanesco', 4, 9),
(28, 'Rote Bete', 9, 0),
(29, 'Blaukraut', 4, 10),
(30, 'Gurke', 4, 7),
(31, 'Spargel', 3, 5),
(32, 'Spinat', 3, 9),
(33, 'Spitzkohl', 4, 9),
(34, 'Staudensellerie', 5, 9),
(35, 'Steckrübe', 10, 1),
(36, 'Steinpilz', 7, 9),
(37, 'Süßkartoffel', 8, 9),
(38, 'Tomate', 6, 8),
(39, 'Weißkohl', 8, 10),
(40, 'Wirsing', 5, 1),
(41, 'Zucchini', 5, 8),
(42, 'Zuckerschoten', 4, 5),
(43, 'Äpfel', 7, 9),
(44, 'Aprikosen', 6, 7),
(45, 'Birnen', 6, 9),
(46, 'Brombeeren', 6, 8),
(47, 'Erdbeeren', 4, 6),
(48, 'Haselnüsse', 8, 9),
(49, 'Heidelbeeren', 5, 8),
(50, 'Himbeeren', 5, 8),
(51, 'Kirschen', 5, 7),
(52, 'Maronen', 8, 11),
(53, 'Nektarinen', 6, 8),
(54, 'Pfirsiche', 6, 8),
(55, 'Pflaumen', 5, 8),
(56, 'Quitten', 9, 10),
(57, 'Rhabarber', 2, 7),
(58, 'Walnüsse', 8, 9),
(59, 'Weintrauben', 8, 9),
(60, 'Zwetschgen', 5, 8),
(61, 'Bärlauch', 2, 4),
(62, 'Basilikum', 5, 9),
(63, 'Chicoree', 9, 3),
(64, 'Dill', 4, 9),
(65, 'Feldsalat', 9, 2),
(66, 'Minze', 4, 9),
(67, 'Radicchio', 5, 9),
(68, 'Rucola', 2, 10),
(69, 'Salbei', 4, 7),
(70, 'Schnittlauch', 2, 8);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`ingredient_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `ingredient_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
