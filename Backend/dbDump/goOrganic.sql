-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 15. Jun 2024 um 18:52
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
                          `order_id` int(11) NOT NULL,
                          `user_id` int(11) NOT NULL,
                          `productname` varchar(255) NOT NULL,
                          `productprice` float NOT NULL,
                          `productquantity` int(11) NOT NULL,
                          `total` float NOT NULL,
                          `paymentmethod` varchar(255) NOT NULL,
                          `orderdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
                                                                                (1, 2, 'Kreditkarte', '789657433245562'),
                                                                                (2, 4, 'Kreditkarte', '475154589461');

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
                                                                                                                                                                  (3, 'Brot', 3.99, 1.99, 1, '../../Backend/productpictures/brot.jpg', 'Brot von Hersteller x', 'Weizenprodukte', 4.5, 15),
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
                         `address` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`userid`, `salutation`, `firstname`, `lastname`, `plz`, `city`, `mail`, `username`, `password`, `isAdmin`, `address`) VALUES
                                                                                                                                               (2, 'Herr', 'Christian', 'Walcher', 1090, 'Wien', 'test@test.at', 'Chris111', '$2y$10$WYeV0qwRPTfQupLKWI3yLOIyouchT5yq/6apYvJixklsLI8zt4sQy', 0, 'Badgasse 14/6'),
                                                                                                                                               (4, 'Herr', 'test1', 'Test1', 1234, 'Test', 'test1@test.test', 'Test1', '$2y$10$a1UyyvcEK8JK0w2gMHxWW.5DGgihOZaxfBeIcpdCbditE.tZMScqq', 0, 'Test1');

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
-- Indizes für die Tabelle `orders`
--
ALTER TABLE `orders`
    ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_userid` (`user_id`);

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
  ADD KEY `fk_userid_voucher` (`user_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
    MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

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
    MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    MODIFY `voucher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
    ADD CONSTRAINT `fk_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`);

--
-- Constraints der Tabelle `paymentinformation`
--
ALTER TABLE `paymentinformation`
    ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);

--
-- Constraints der Tabelle `vouchers`
--
ALTER TABLE `vouchers`
    ADD CONSTRAINT `fk_userid_voucher` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
