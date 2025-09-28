-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2025 at 10:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cart_quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customermember`
--

CREATE TABLE `customermember` (
  `cus_id` int(11) NOT NULL,
  `cus_fullname` varchar(100) NOT NULL,
  `cus_address` text NOT NULL,
  `cus_phone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customermember`
--

INSERT INTO `customermember` (`cus_id`, `cus_fullname`, `cus_address`, `cus_phone`) VALUES
(1, 'แอดมิน', '00/00', '0000000000'),
(16, 'กันตินันท์ ร่มโพธิ์', '39/1 หมู่12 ต.พรหมณี อ.เมือง จ.นครนายก 26000', '0649758806'),
(21, 'กันตินันท์ ร่มโพธิ์', '39/1 หมู่12 ต.พรหมณี อ.เมือง จ.นครนายก 26000', '0655697769');

-- --------------------------------------------------------

--
-- Table structure for table `logadmin`
--

CREATE TABLE `logadmin` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` datetime DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logadmin`
--

INSERT INTO `logadmin` (`id`, `user_id`, `login_time`, `ip_address`, `username`, `role`) VALUES
(2, 21, '2025-07-23 21:45:32', '::1', 'partouton1', 'user'),
(3, 1, '2025-07-23 21:45:58', '::1', 'admin', 'admin'),
(4, 21, '2025-07-25 22:29:03', '::1', 'partouton1', 'user'),
(5, 1, '2025-07-25 22:30:11', '::1', 'admin', 'admin'),
(6, 1, '2025-07-26 12:37:50', '::1', 'admin', 'admin'),
(7, 1, '2025-07-26 22:56:00', '::1', 'admin', 'admin'),
(8, 21, '2025-07-26 23:06:01', '::1', 'partouton1', 'user'),
(9, 1, '2025-07-27 21:35:20', '::1', 'admin', 'admin'),
(10, 21, '2025-07-27 21:49:09', '::1', 'partouton1', 'user'),
(11, 1, '2025-07-28 20:55:59', '::1', 'admin', 'admin'),
(12, 1, '2025-07-28 21:00:55', '::1', 'admin', 'admin'),
(13, 21, '2025-07-28 21:02:27', '::1', 'partouton1', 'user'),
(14, 1, '2025-07-29 00:15:41', '::1', 'admin', 'admin'),
(15, 1, '2025-07-29 22:02:58', '::1', 'admin', 'admin'),
(16, 1, '2025-08-06 07:37:24', '::1', 'admin', 'admin'),
(17, 1, '2025-08-06 08:45:25', '::1', 'admin', 'admin'),
(18, 1, '2025-08-06 08:45:54', '::1', 'admin', 'admin'),
(19, 1, '2025-08-06 08:46:12', '::1', 'admin', 'admin'),
(20, 1, '2025-08-06 08:53:40', '::1', 'admin', 'admin'),
(21, 1, '2025-08-06 08:57:17', '::1', 'admin', 'admin'),
(22, 1, '2025-08-06 08:58:54', '::1', 'admin', 'admin'),
(23, 1, '2025-08-06 09:00:02', '::1', 'admin', 'admin'),
(24, 1, '2025-08-06 09:02:27', '::1', 'admin', 'admin'),
(25, 1, '2025-08-06 09:06:40', '::1', 'admin', 'admin'),
(26, 1, '2025-08-06 09:10:44', '::1', 'admin', 'admin'),
(27, 1, '2025-08-06 09:11:51', '::1', 'admin', 'admin'),
(28, 1, '2025-08-06 09:16:08', '::1', 'admin', 'admin'),
(29, 16, '2025-08-06 21:54:34', '::1', 'koonkoo4', 'user'),
(30, 1, '2025-08-07 19:43:39', '::1', 'admin', 'admin'),
(31, 1, '2025-08-07 19:57:36', '::1', 'admin', 'admin'),
(32, 1, '2025-08-07 19:59:40', '::1', 'admin', 'admin'),
(33, 1, '2025-08-07 20:08:22', '::1', 'admin', 'admin'),
(34, 1, '2025-08-07 20:13:52', '::1', 'admin', 'admin'),
(35, 1, '2025-08-07 20:14:52', '::1', 'admin', 'admin'),
(36, 1, '2025-08-07 20:20:05', '::1', 'admin', 'admin'),
(37, 1, '2025-08-07 20:20:21', '::1', 'admin', 'admin'),
(38, 1, '2025-08-07 20:20:34', '::1', 'admin', 'admin'),
(39, 1, '2025-08-13 23:51:00', '::1', 'admin', 'admin'),
(40, 1, '2025-08-13 23:58:09', '::1', 'admin', 'admin'),
(41, 1, '2025-08-14 00:06:23', '::1', 'admin', 'admin'),
(42, 2, '2025-08-14 00:19:07', '::1', 'koonkoo2', 'user'),
(43, 1, '2025-08-14 00:19:59', '::1', 'admin', 'admin'),
(44, 1, '2025-08-14 19:59:23', '::1', 'admin', 'admin'),
(45, 1, '2025-08-14 20:04:03', '::1', 'admin', 'admin'),
(46, 1, '2025-08-14 20:14:57', '::1', 'admin', 'admin'),
(47, 1, '2025-08-14 20:22:52', '::1', 'admin', 'admin'),
(48, 1, '2025-08-14 21:20:12', '::1', 'admin', 'admin'),
(49, 1, '2025-08-15 19:27:12', '::1', 'admin', 'admin'),
(50, 1, '2025-08-15 22:06:01', '::1', 'admin', 'admin'),
(51, 1, '2025-08-15 22:17:08', '::1', 'admin', 'admin'),
(52, 1, '2025-08-15 22:17:52', '::1', 'admin', 'admin'),
(53, 1, '2025-08-15 22:19:41', '::1', 'admin', 'admin'),
(54, 1, '2025-08-15 22:21:04', '::1', 'admin', 'admin'),
(55, 1, '2025-08-15 22:24:06', '::1', 'admin', 'admin'),
(56, 1, '2025-08-15 22:24:49', '::1', 'admin', 'admin'),
(57, 1, '2025-08-15 22:29:55', '::1', 'admin', 'admin'),
(58, 1, '2025-08-15 22:34:23', '::1', 'admin', 'admin'),
(59, 1, '2025-08-15 22:35:10', '::1', 'admin', 'admin'),
(60, 1, '2025-08-15 22:37:47', '::1', 'admin', 'admin'),
(61, 1, '2025-08-15 22:39:02', '::1', 'admin', 'admin'),
(62, 1, '2025-08-15 22:40:48', '::1', 'admin', 'admin'),
(63, 1, '2025-08-15 22:42:10', '::1', 'admin', 'admin'),
(64, 1, '2025-08-15 22:42:51', '::1', 'admin', 'admin'),
(65, 1, '2025-08-17 22:42:39', '::1', 'admin', 'admin'),
(66, 2, '2025-08-20 20:19:39', '::1', 'koonkoo2', 'user'),
(67, 1, '2025-08-20 20:23:19', '::1', 'admin', 'admin'),
(68, 1, '2025-08-20 20:23:39', '::1', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `slip_image` varchar(255) DEFAULT NULL,
  `status` enum('กำลังตรวจสอบสลีป','ชำระเงินสำเร็จ','สินค้ากำลังจัดส่ง','จัดส่งสำเร็จ') DEFAULT 'กำลังตรวจสอบสลีป',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `token`, `expires_at`) VALUES
(6, 21, '53211cc8dcbd8f0f7112a029eaedd5c509281885ff095dea1495fdf149b2f2f0', '2025-08-06 22:49:19'),
(8, 16, '8aabe00d5a580eaa050e92a238c352c013ba244c246b9433ca153e82ba782a07', '2025-08-20 21:31:19'),
(9, 16, '3505db5414c71efd0d1a19f7918fb9b6318f1572ade472b6248216dc7fd1a909', '2025-08-20 21:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `password`, `role`) VALUES
(1, 'admin@gmail.com', 'admin', '123456', 'admin'),
(2, 'partouton@gmail.com', 'koonkoo2', '230348ZA', 'user'),
(16, 'satzath123@gmail.com', 'koonkoo4', '230348Za!', 'user'),
(21, 'partouton1@gmail.com', 'partouton1', '230348Za!', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `customermember`
--
ALTER TABLE `customermember`
  ADD PRIMARY KEY (`cus_id`);

--
-- Indexes for table `logadmin`
--
ALTER TABLE `logadmin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `logadmin`
--
ALTER TABLE `logadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customermember`
--
ALTER TABLE `customermember`
  ADD CONSTRAINT `fk_customermember_user` FOREIGN KEY (`cus_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logadmin`
--
ALTER TABLE `logadmin`
  ADD CONSTRAINT `logadmin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
