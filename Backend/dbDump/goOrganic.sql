-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 13. Jun 2024 um 23:48
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

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
                                                                                   (1, 1, 1, '2024-05-19 03:00:00', 'checkout'),
                                                                                   (2, 1, 1, '2024-05-19 03:00:00', 'checkout'),
                                                                                   (3, 1, 2, '2024-05-19 03:00:00', 'checkout'),
                                                                                   (4, 1, 3, '2024-05-19 03:00:00', 'checkout'),
                                                                                   (5, 1, 3, '2024-05-19 03:00:00', 'checkout'),
                                                                                   (6, 1, 4, '2024-05-19 03:00:00', 'checkout'),
                                                                                   (7, 1, 5, '2024-05-18 03:00:00', 'paid'),
                                                                                   (1, 1, 1, '2024-05-19 03:00:00', 'checkout');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `paymentinformation`
--

CREATE TABLE `paymentinformation` (
                                      `p_id` int(11) NOT NULL,
                                      `userid` int(11) NOT NULL,
                                      `pay_type` varchar(250) NOT NULL,
                                      `pay_info` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `paymentinformation`
--

INSERT INTO `paymentinformation` (`p_id`, `userid`, `pay_type`, `pay_info`) VALUES
                                                                                (1, 1, 'Kreditkarte', '789657433245562'),
                                                                                (2, 1, 'Kreditkarte', '1111111');

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
                         `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
                         `address` varchar(80) NOT NULL,
                         `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`userid`, `salutation`, `firstname`, `lastname`, `plz`, `city`, `mail`, `username`, `password`, `isAdmin`, `address`, `isActive`) VALUES
                                                                                                                                                           (1, 'Herr', 'test1', '123', 1324, 'asd', 'a@a.com', 'asd', '$2y$10$scH0rQUhkCjMy5e4lHZAtuxRQ25IO9xZJKVbph/M9NauMhYbfKwbK', 1, 'asd', 1),
                                                                                                                                                           (2, 'Frau', 'A', 'B', 1234, 'Testort', 'testmail@domain.com', 'asd1', '$2y$10$fpG7OtYe8p4/sZFMO3dj9OZTlgI/rCgAMbKOjZeQpVKYi.vMgscG6', 0, 'C', 1),
                                                                                                                                                           (6, 'Divers', 'Test3', 'test', 1234, 'Testort123', 'test@asdasd.com', 'asd5', '$2y$10$x0LdMeUHSj8E.mZCnNj3uuT8jP0JEvQoGxqmQQExFvpm.L1EqKLzi', 0, 'tester', 1),
                                                                                                                                                           (7, 'Divers', 'Test3', 'test', 1234, 'Testort123', 'test@asdasd.com', 'asd577', '$2y$10$x279CcIznPN4yNKXctskGu2k15W17puXABlr92WGSniJYY44i4n6m', 0, 'tester', 1),
                                                                                                                                                           (11, 'Divers', 'Test3', 'test', 1234, 'Testort123', 'test@asdasd.com', 'asd5773', '$2y$10$qHn3euv.1Ccu2Vi2uRc/g.XDgYQk58/jSjL0ZVZ70Z0FtMmTYDQNK', 0, 'tester', 1),
                                                                                                                                                           (14, 'Divers', '555', '5555', 5555, '5555', '55@asd.com', '9789', '$2y$10$xOBx1AuIvtP7gngrK4giBuQa8nJWocT6r5QRK1xqXW2dyk6PjzZtC', 0, '5555', 1),
                                                                                                                                                           (15, 'Divers', '666', '666', 5555, '5555', '55@asd.com', '9789987', '$2y$10$smopvBRNRXT1jYC/QNfZoub5KQI5aXRvRGeoqhb1s0yIJDy8CGVUa', 0, '5555', 1),
                                                                                                                                                           (16, 'Divers', '666', '666', 5555, '5555', '55@asd.com', '1', '$2y$10$YSlG7E.tH8rHikVKG6hUZ.LwjYtaFncIYDMGCpoAWUArRJJ5ZpU.e', 0, '5555', 1),
                                                                                                                                                           (17, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '2', '$2y$10$g8DysVrZY.8hMInex.02PeYvP8Axarr5IrYLcd5EIbPveoiwUFerO', 0, 'asd', 1),
                                                                                                                                                           (18, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '3', '$2y$10$PGeFoJcVONDKlgp9kZy.7..tVWt7KsUXWK0uoXQ0.VF6oQQSWpp3G', 0, 'asd', 1),
                                                                                                                                                           (21, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '4', '$2y$10$qOY8unKNQdE19ZQn1k3TTuQjeHbkqND1bEjrpF7s55nEe30jCFaMC', 0, 'asd', 1),
                                                                                                                                                           (22, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '5', '$2y$10$0PEbSnKdWCkvWRsoM6MoVOzfbV2W36ohZ9SQwRkMjG3ejhOifIyGG', 0, 'asd', 1),
                                                                                                                                                           (23, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '6', '$2y$10$EAROkmx.BY72SWOa.KsNQu7kVp7zf87SiktLdqg1rMYPvTJIPehGG', 0, 'asd', 1),
                                                                                                                                                           (24, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '7', '$2y$10$af9W0Cu8TtmwL5Ejrxfh3.6hTzzk.FUyszh0ZG/4jEDscKPttLWB.', 0, 'asd', 1),
                                                                                                                                                           (25, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '8', '$2y$10$38sdRFmnrlnUuNGCTuddKutCXSubIwQAFCVMY397hnSJ06GXTac6a', 0, 'asd', 1),
                                                                                                                                                           (27, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '9', '$2y$10$g6tBWcrmXCc/DMljugFVYed17UMLtwbV94pkv23/l1mqCoXPYg95m', 0, 'asd', 1),
                                                                                                                                                           (30, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '10', '$2y$10$9w6uXB49wgwcP5e.8vmrD.JflAxU0ZPkuU.fA5ji4Y5AU4C2Wdihi', 0, 'asd', 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    ADD PRIMARY KEY (`p_id`),
    ADD KEY `fk_user_id` (`userid`);

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
-- AUTO_INCREMENT für Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
    MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
