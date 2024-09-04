-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2024 at 10:09 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grse_btn`
--

-- --------------------------------------------------------

--
-- Table structure for table `btn_do`
--

CREATE TABLE `btn_do` (
  `btn_num` varchar(15) NOT NULL,
  `contractual_ld` varchar(45) NOT NULL,
  `ld_amount` varchar(15) NOT NULL,
  `drg_penalty` varchar(15) NOT NULL,
  `qap_penalty` varchar(15) NOT NULL,
  `ilms_penalty` varchar(15) NOT NULL,
  `other_deduction` varchar(15) NOT NULL,
  `total_deduction` varchar(15) NOT NULL,
  `net_payable_amout` varchar(15) NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `created_by` varchar(15) NOT NULL,
  `assigned_to` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `btn_do`
--
ALTER TABLE `btn_do`
  ADD PRIMARY KEY (`btn_num`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
