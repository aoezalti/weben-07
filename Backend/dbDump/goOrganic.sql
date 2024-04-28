-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 26. Apr 2024 um 13:41
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `go-organic`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `products`
--

CREATE TABLE `products` (
  `productid` int(11) NOT NULL AUTO_INCREMENT,
  `productname` varchar(50) NOT NULL,
  `regularprize` float NOT NULL,
  `specialprize` float NOT NULL,
  `insale` tinyint(1) NOT NULL,
  `imgpath` varchar(50) NOT NULL,
  `altimg` varchar(50) NOT NULL,
  `category` varchar(55) NOT NULL,
  `currentreview` float NOT NULL,
  `allreviews` int(11) NOT NULL,
  PRIMARY KEY (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `products`
--

INSERT INTO `products` (`productname`, `regularprize`, `specialprize`, `insale`, `imgpath`, `altimg`, `category`, `currentreview`, `allreviews`) VALUES
('Butter', 2.5, 0, 0, '../../Backend/productpictures/butter.jpg', 'Butter von Hersteller x', 'Milchprodukte', 5, 1),
('Käse', 3.99, 0, 0, '../../Backend/productpictures/kaese.jpg', 'Käse von Hersteller x', 'Milchprodukte', 4, 5),
('Brot', 3.99, 1.99, 0, '../../Backend/productpictures/brot.jpg', 'Brot von Hersteller x', 'Weizenprodukte', 4.5, 15),
('Paradeiser', 4.99, 0, 0, '../../Backend/productpictures/paradeiser.jpg', 'Paradeiser von Hersteller x', 'Obst und Gemüse', 5, 20),
('Gemüsemix', 4.99, 3.99, 0, '../../Backend/productpictures/gemuese.jpg', 'Gemüsemix von Hersteller x', 'Obst und Gemüse', 3.5, 20),
('Äpfel', 3.99, 2.49, 0, '../../Backend/productpictures/aepfel.jpg', 'Äpfel von Hersteller x', 'Obst und Gemüse', 5, 20);
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `salutation` enum('Frau','Herr','Divers') NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `plz` int(4) NOT NULL,
  `city` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(250) NOT NULL,
  `paymentInformation` varchar(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `address` varchar(80) NOT NULL,
   PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

