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
-- Datenbank: `go_organic`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `products`
--

CREATE TABLE `products` (
  `productid` int(11) NOT NULL,
  `productname` varchar(50) NOT NULL,
  `regularprize` float NOT NULL,
  `specialprize` float NOT NULL,
  `insale` tinyint(1) NOT NULL,
  `imgpath` varchar(50) NOT NULL,
  `altimg` varchar(50) NOT NULL,
  `category` varchar(55) NOT NULL,
  `currentreview` float NOT NULL,
  `allreviews` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `products`
--

INSERT INTO `products` (`productid`, `productname`, `regularprize`, `specialprize`, `insale`, `imgpath`, `altimg`, `category`, `currentreview`, `allreviews`) VALUES
(1, 'Butter', 2.5, 0, 0, '../../Backend/productpictures/butter.jpeg', 'Butter von Hersteller x', 'Milchprodukt', 5, 1),
(2, 'Wurst', 4.5, 3.5, 1, '../../Backend/productpictures/wurst.jpeg', 'Wurst von Hersteller x', 'Fleischprodukte', 2.5, 2),
(3, 'Käse', 3.99, 0, 0, '../../Backend/productpictures/kaese.jpeg', 'Käse von Hersteller x', 'Milchprodukt', 4, 5),
(4, 'Brot', 3.99, 1.99, 0, '../../Backend/productpictures/brot.jpeg', 'Brot von Hersteller x', 'Weizenprodukt', 1.5, 15),
(5, 'Äpfel', 4.99, 3.99, 0, '../../Backend/productpictures/aepfel.jpeg', 'Äpfel von Hersteller x', 'Obst und Gemüse', 5, 20);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `salutation` enum('Frau','Herr','Divers') NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `plz` int(4) NOT NULL,
  `city` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `paymentInformation` varchar(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `address` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productid`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `products`
--
ALTER TABLE `products`
  MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
