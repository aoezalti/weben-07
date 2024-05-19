-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 19. Mai 2024 um 07:19
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
-- Tabellenstruktur für Tabelle `orders`
--

CREATE TABLE `orders` (
                          `orderid` int(11) NOT NULL,
                          `userid` int(11) DEFAULT NULL,
                          `productid` int(11) DEFAULT NULL,
                          `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
                          `state` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `orders`
--

INSERT INTO `orders` (`orderid`, `userid`, `productid`, `order_date`, `state`) VALUES
                                                                                   (1, 1, 1, '2024-05-19 05:00:00', 'checkout'),
                                                                                   (2, 1, 1, '2024-05-19 05:00:00', 'checkout'),
                                                                                   (3, 1, 2, '2024-05-19 05:00:00', 'checkout'),
                                                                                   (4, 1, 3, '2024-05-19 05:00:00', 'checkout'),
                                                                                   (5, 1, 3, '2024-05-19 05:00:00', 'checkout'),
                                                                                   (6, 1, 4, '2024-05-19 05:00:00', 'checkout'),
                                                                                   (7, 1, 5, '2024-05-18 05:00:00', 'paid');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `products`
--

CREATE TABLE `products` (
                            `productid` int(11) NOT NULL,
                            `productname` varchar(50) NOT NULL,
                            `regularprice` float NOT NULL,
                            `specialprice` float NOT NULL,
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

INSERT INTO `products` (`productid`, `productname`, `regularprice`, `specialprice`, `insale`, `imgpath`, `altimg`, `category`, `currentreview`, `allreviews`) VALUES
                                                                                                                                                                  (1, 'Butter', 2.5, 0, 0, '../../Backend/productpictures/butter.jpg', 'Butter von Hersteller x', 'Milchprodukte', 5, 1),
                                                                                                                                                                  (2, 'Käse', 3.99, 0, 0, '../../Backend/productpictures/kaese.jpg', 'Käse von Hersteller x', 'Milchprodukte', 4, 5),
                                                                                                                                                                  (3, 'Brot', 3.99, 1.99, 0, '../../Backend/productpictures/brot.jpg', 'Brot von Hersteller x', 'Weizenprodukte', 4.5, 15),
                                                                                                                                                                  (4, 'Paradeiser', 4.99, 0, 0, '../../Backend/productpictures/paradeiser.jpg', 'Paradeiser von Hersteller x', 'Obst und Gemüse', 5, 20),
                                                                                                                                                                  (5, 'Gemüsemix', 4.99, 3.99, 0, '../../Backend/productpictures/gemuese.jpg', 'Gemüsemix von Hersteller x', 'Obst und Gemüse', 3.5, 20),
                                                                                                                                                                  (6, 'Äpfel', 3.99, 2.49, 0, '../../Backend/productpictures/aepfel.jpg', 'Äpfel von Hersteller x', 'Obst und Gemüse', 5, 20);

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
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`userid`, `salutation`, `firstname`, `lastname`, `plz`, `city`, `mail`, `username`, `password`, `paymentInformation`, `isAdmin`, `address`) VALUES
    (1, 'Herr', 'Chris', 'Wa', 1090, 'Wien', 'test@test.at', 'ChrisWa', 'Test123', 'Bar', 0, 'Teststrasse 12');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `orders`
--
ALTER TABLE `orders`
    ADD PRIMARY KEY (`orderid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `produktid` (`produktid`);

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
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
    MODIFY `orderid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `products`
--
ALTER TABLE `products`
    MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
    MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
    ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`produktid`) REFERENCES `products` (`productid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
