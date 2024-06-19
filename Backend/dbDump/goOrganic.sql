-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 19. Jun 2024 um 23:29
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
                                                                                (35, 1, 'Kredikarte', 'asd3244r234'),
                                                                                (36, 1, 'visa', '1'),
                                                                                (37, 1, 'Kreditkarte', 'asd'),
                                                                                (38, 142, 'Kreditkarte', '1111'),
                                                                                (41, 142, 'Kreditkarte', '4778946132164');

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
                                                                                                                                                           (1, 'Divers', 'anders', '123', 1324, 'asd', 'a@a.com', 'admin', '$2y$10$RddRtQKgGUHYFbphne2f2OtoR49Qy22zc9VNYq8TsDUuotKlBpC0a', 1, '1223qw', 1),
                                                                                                                                                           (142, 'Herr', 'test', 'testnn', 1234, 'Teststadt', 'test@test.com', 'testuser1', '$2y$10$UfVhILuLMJ1Bs8hlpz.1M.ml1ez.xssaT/hBbzX9dFp.qQ16QW1d2', 0, 'Testgasse 1', 1);

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
    (4, 1, 100, 100);

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
    ADD KEY `orderitems_ibfk_2` (`product_id`);

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
    ADD KEY `vouchers_ibfk_1` (`user_id`);

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
    MODIFY `orderitem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
    MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT für Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT für Tabelle `products`
--
ALTER TABLE `products`
    MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
    MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT für Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    MODIFY `voucher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orderitems`
--
ALTER TABLE `orderitems`
    ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
    ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE;

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
    ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    ADD CONSTRAINT `vouchers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
