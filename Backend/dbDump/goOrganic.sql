-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 16. Jun 2024 um 21:50
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
-- Tabellenstruktur für Tabelle `discounts`
--

CREATE TABLE `discounts` (
                             `discount_id` int(11) NOT NULL,
                             `code` varchar(5) NOT NULL,
                             `discount` float NOT NULL,
                             `expiry_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orderitems`
--

CREATE TABLE `orderitems` (
                              `orderitem_id` int(11) NOT NULL,
                              `order_id` int(11) NOT NULL,
                              `product_id` int(11) NOT NULL,
                              `quantity` int(11) NOT NULL,
                              `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orders`
--

CREATE TABLE `orders` (
                          `order_id` int(11) NOT NULL,
                          `user_id` int(11) NOT NULL,
                          `total` float NOT NULL,
                          `paymentmethod` varchar(255) NOT NULL,
                          `orderdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                          `discount_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total`, `paymentmethod`, `orderdate`, `discount_id`) VALUES
                                                                                                       (1, 1, 2.5, 'Rechnung', '2024-06-16 08:33:05', NULL),
                                                                                                       (2, 1, 2.5, 'Rechnung', '2024-06-16 19:05:47', NULL),
                                                                                                       (3, 1, 3.99, 'Rechnung', '2024-06-16 19:05:47', NULL),
                                                                                                       (4, 1, 4.99, 'Rechnung', '2024-06-16 19:05:47', NULL),
                                                                                                       (5, 1, 3.99, 'Rechnung', '2024-06-16 19:05:47', NULL),
                                                                                                       (6, 1, 3.99, 'Rechnung', '2024-06-16 19:05:47', NULL),
                                                                                                       (7, 1, 4.99, 'Rechnung', '2024-06-16 19:05:47', NULL);

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
                                                                                                                                                           (1, 'Herr', 'test1', '123', 1324, 'asd', 'a@a.com', 'asd', '$2y$10$scH0rQUhkCjMy5e4lHZAtuxRQ25IO9xZJKVbph/M9NauMhYbfKwbK', 0, 'asd', 1),
                                                                                                                                                           (2, 'Frau', 'A', 'B', 1234, 'Testort', 'testmail@domain.com', 'asd1', '$2y$10$fpG7OtYe8p4/sZFMO3dj9OZTlgI/rCgAMbKOjZeQpVKYi.vMgscG6', 0, 'C', 1),
                                                                                                                                                           (6, 'Divers', 'Test3', 'test', 1234, 'Testort123', 'test@asdasd.com', 'asd5', '$2y$10$x0LdMeUHSj8E.mZCnNj3uuT8jP0JEvQoGxqmQQExFvpm.L1EqKLzi', 0, 'tester', 1),
                                                                                                                                                           (7, 'Divers', 'Test3', 'test', 1234, 'Testort123', 'test@asdasd.com', 'asd577', '$2y$10$x279CcIznPN4yNKXctskGu2k15W17puXABlr92WGSniJYY44i4n6m', 0, 'tester', 1),
                                                                                                                                                           (11, 'Divers', 'Test3', 'test', 1234, 'Testort123', 'test@asdasd.com', 'asd5773', '$2y$10$qHn3euv.1Ccu2Vi2uRc/g.XDgYQk58/jSjL0ZVZ70Z0FtMmTYDQNK', 0, 'tester', 1),
                                                                                                                                                           (12, 'Divers', 'lastTest', 'lastTest', 1234, 'wien', 'a@asdasdad.com', 'bittefunktionier', '$2y$10$ExOdzSI5L.gtYw8LkK/wdeW1ShJzgxhjKfqBc4bssa1j.kIskFjii', 0, 'test', 1),
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
                                                                                                                                                           (30, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '10', '$2y$10$9w6uXB49wgwcP5e.8vmrD.JflAxU0ZPkuU.fA5ji4Y5AU4C2Wdihi', 0, 'asd', 1),
                                                                                                                                                           (32, 'Divers', 'as', 'asd', 1234, 'asd', 'asa@asd.acom', '11', '$2y$10$DPK4vUB/GUxxRJK5CuU29uNPCwC0gUS/bwTB2W.tUsn5wXI5SIRwm', 0, 'asd', 1),
                                                                                                                                                           (33, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '12', '$2y$10$1bl30A/23CtqpZljccNkCeNfyH7SQjJ1Lr71xnxGFQgU7XEBmwdGW', 0, '3', 1),
                                                                                                                                                           (34, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '13', '$2y$10$6nEGxCg.x2NdUv3oXisiOuqIgletpAWb3GTDrhQY.ZVQZ/ScO.dma', 0, '3', 1),
                                                                                                                                                           (35, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '14', '$2y$10$yMwkPvrG1aJv6bWJ9KtRR.SSaaYQ0r2J.lokbST1qAZ3sAxPsLMDq', 0, '3', 1),
                                                                                                                                                           (36, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '15', '$2y$10$4UXzC.UeCdLcrGsIfj4tnOz6XYvEG3wTfXiklBOQih.X9UTCf5iGa', 0, '3', 1),
                                                                                                                                                           (37, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '16', '$2y$10$Kp7D/KxDNtOzXpS24xrDSe9bkF5/w0oy7coHJ7Yo2IxBYgsicKUh2', 0, '3', 1),
                                                                                                                                                           (38, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '17', '$2y$10$RepdteLDnY7ko2eYlBMVRepM6wIwV0lZxce4yPoQQhs/QcHLzw5qS', 0, '3', 1),
                                                                                                                                                           (39, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '18', '$2y$10$8B.K2e9T58IY1Iei0.POe.ouJ0ERz3ea2e8HNymxbnn/Qd1vgoafK', 0, '3', 1),
                                                                                                                                                           (40, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '19', '$2y$10$lEcWU5iul6aNno8O/efs5.mo4Wwi9vtFLRJURnjbJ.z8K.3Y1gVq6', 0, '3', 1),
                                                                                                                                                           (41, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '20', '$2y$10$GoB1zNaFKABzC2xa747X2uA1gFBtBpwAUr3wqCDMaEy9JLj6qCEfC', 0, '3', 1),
                                                                                                                                                           (42, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '21', '$2y$10$xgWFS76zW623pM3PDgNK5uhmS2jVR2xp9VPdKlwDoy9Vc0S8U7pe.', 0, '3', 1),
                                                                                                                                                           (43, 'Divers', '1', '2', 1234, '2123', 'a@a.com', '22', '$2y$10$trvgdSesCbkFgFW.Gd5w1O/oJ23ApI//B9wC8QV8hyx14r/JhbSyq', 0, '3', 1),
                                                                                                                                                           (44, 'Divers', '1', '1', 1111, '123', 'a@a.com', '23', '$2y$10$DoprOPbyVeuzoIo20f20S.imhrFkK7en8AAx3tH8STsFzXr.7/XH.', 0, '11', 1),
                                                                                                                                                           (46, 'Divers', '1', '1', 1111, '123', 'a@a.com', '24', '$2y$10$FrEjN/tMJEENMEoFmhinuuHcChk4YkWfzS41O8S5XPqI07cUTjj4q', 0, '11', 1),
                                                                                                                                                           (47, 'Divers', '1', '1', 1111, '123', 'a@a.com', '25', '$2y$10$IXMqIE.jleyDvGi4uFVBqePWMYuf8SzmiEEO.dTfX/C2aOGqTjxli', 0, '11', 1),
                                                                                                                                                           (48, 'Divers', '1', '1', 1111, '123', 'a@a.com', '26', '$2y$10$DaVWfyS/E7kReiPLYZcbG.Kbr8gOgLp2Ew3JM0uroKrX0muxVDD9y', 0, '11', 1),
                                                                                                                                                           (49, 'Divers', '1', '1', 1111, '123', 'a@a.com', '27', '$2y$10$gD8qSP36yRq1FhDtomIRg./P0aSW1.eX3EjQtYVltXSYjpMF2ZZ0O', 0, '11', 1),
                                                                                                                                                           (51, 'Divers', '1', '1', 1111, '123', 'a@a.com', '28', '$2y$10$T5/AxXzfVCRmvbehE7OhreBaTzYiVqpR9kJAwQ9OpVwo52UEcSCwm', 0, '11', 1),
                                                                                                                                                           (52, 'Herr', '1', '1', 1233, '12asd', 'a@a.com', '29', '$2y$10$1KqGrdbf3mQc0FsveqRwMO4xT4cha/KFhL2Qt3smC6piaPrndusMe', 0, '1', 1),
                                                                                                                                                           (53, 'Herr', 'Alex', 'Test', 1150, 'Wien', 'asd@asd.com', 'LX', '$2y$10$lMWPYGaWkvFyPwhnLDnktOLZJQlgUKC.N.Mo8y.MdzeWiPefZO2cW', 0, 'Test', 1),
                                                                                                                                                           (54, 'Frau', 'asd', 'asd', 1234, 'asd', 'test0306@asd.com', 'test0306@asd.com', '$2y$10$IJDQ.fn6QuTqeHtYUmu6QulQn39P6a5hdejqnWEbdLcrqs8duqK/6', 0, 'asd', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `vouchers`
--

CREATE TABLE `vouchers` (
                            `voucher_id` int(11) NOT NULL,
                            `user_id` int(11) NOT NULL,
                            `voucher_value` float NOT NULL,
                            `residual_value` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `vouchers`
--

INSERT INTO `vouchers` (`voucher_id`, `user_id`, `voucher_value`, `residual_value`) VALUES
    (2, 2, 100, 70.07);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `discounts`
--
ALTER TABLE `discounts`
    ADD PRIMARY KEY (`discount_id`),
    ADD UNIQUE KEY `code` (`code`);

--
-- Indizes für die Tabelle `orderitems`
--
ALTER TABLE `orderitems`
    ADD PRIMARY KEY (`orderitem_id`),
    ADD KEY `order_id` (`order_id`),
    ADD KEY `product_id` (`product_id`);

--
-- Indizes für die Tabelle `orders`
--
ALTER TABLE `orders`
    ADD PRIMARY KEY (`order_id`),
    ADD KEY `fk_userid` (`user_id`),
    ADD KEY `discount_id` (`discount_id`);

--
-- Indizes für die Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    ADD PRIMARY KEY (`p_id`),
    ADD KEY `fk_user_id` (`userid`);

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
-- Indizes für die Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    ADD PRIMARY KEY (`voucher_id`),
    ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `discounts`
--
ALTER TABLE `discounts`
    MODIFY `discount_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `orderitems`
--
ALTER TABLE `orderitems`
    MODIFY `orderitem_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
    MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `products`
--
ALTER TABLE `products`
    MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
    MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT für Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    MODIFY `voucher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orderitems`
--
ALTER TABLE `orderitems`
    ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
    ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`productid`);

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
    ADD CONSTRAINT `fk_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`),
    ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`);

--
-- Constraints der Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);

--
-- Constraints der Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    ADD CONSTRAINT `vouchers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
