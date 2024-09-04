-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2024 at 10:08 AM
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
-- Table structure for table `btn`
--

CREATE TABLE `btn` (
  `btn_num` varchar(30) NOT NULL,
  `purchasing_doc_no` varchar(30) NOT NULL,
  `invoice_no` varchar(30) DEFAULT NULL,
  `invoice_filename` varchar(150) NOT NULL,
  `invoice_value` varchar(30) DEFAULT NULL,
  `cgst` varchar(15) NOT NULL,
  `igst` varchar(15) NOT NULL,
  `sgst` varchar(15) NOT NULL,
  `e_invoice_no` varchar(30) DEFAULT NULL,
  `e_invoice_filename` varchar(150) DEFAULT NULL,
  `debit_note` varchar(15) DEFAULT NULL,
  `credit_note` varchar(15) DEFAULT NULL,
  `debit_credit_filename` varchar(150) DEFAULT NULL,
  `net_claim_amount` varchar(15) DEFAULT NULL,
  `c_sdbg_date` varchar(30) DEFAULT NULL,
  `c_sdbg_filename` varchar(150) DEFAULT NULL,
  `a_sdbg_date` varchar(30) DEFAULT NULL,
  `demand_raise_filename` varchar(150) DEFAULT NULL,
  `gate_entry_no` varchar(30) DEFAULT NULL,
  `get_entry_filename` varchar(150) DEFAULT NULL,
  `gate_entry_date` varchar(30) DEFAULT NULL,
  `grn_no_1` varchar(30) DEFAULT NULL,
  `grn_no_2` varchar(30) DEFAULT NULL,
  `grn_no_3` varchar(30) DEFAULT NULL,
  `grn_no_4` varchar(30) DEFAULT NULL,
  `icgrn_no_1` varchar(30) DEFAULT NULL,
  `icgrn_no_2` varchar(30) DEFAULT NULL,
  `icgrn_no_3` varchar(30) DEFAULT NULL,
  `icgrn_no_4` varchar(30) DEFAULT NULL,
  `icgrn_total` varchar(30) DEFAULT NULL,
  `c_drawing_date` varchar(30) DEFAULT NULL,
  `a_drawing_date` varchar(30) DEFAULT NULL,
  `c_qap_date` varchar(30) DEFAULT NULL,
  `a_qap_date` varchar(30) DEFAULT NULL,
  `c_ilms_date` varchar(30) DEFAULT NULL,
  `a_ilms_date` varchar(30) DEFAULT NULL,
  `pbg_filename` varchar(150) DEFAULT NULL,
  `hsn_gstn_icgrn` tinyint(1) DEFAULT NULL,
  `ld_gate_entry_date` varchar(30) DEFAULT NULL,
  `ld_contractual_date` varchar(30) DEFAULT NULL,
  `ld_amount` varchar(15) NOT NULL,
  `c_drawing_date_do` varchar(30) DEFAULT NULL,
  `a_drawing_date_do` varchar(30) DEFAULT NULL,
  `drawing_penalty` varchar(15) DEFAULT NULL,
  `c_qap_date_do` varchar(30) DEFAULT NULL,
  `a_qap_date_do` varchar(30) DEFAULT NULL,
  `qap_penalty` varchar(15) DEFAULT NULL,
  `c_ilms_date_do` varchar(30) DEFAULT NULL,
  `a_ilms_date_do` varchar(30) DEFAULT NULL,
  `ilms_penalty` varchar(15) DEFAULT NULL,
  `other_penalty` varchar(15) DEFAULT NULL,
  `total_penalty` varchar(15) NOT NULL,
  `net_payable_amount` varchar(15) NOT NULL,
  `updated_by` varchar(30) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `created_by_id` varchar(30) NOT NULL,
  `vendor_code` varchar(10) NOT NULL,
  `icgrn_nos` text NOT NULL,
  `grn_nos` text NOT NULL,
  `gst_rate` varchar(10) NOT NULL,
  `btn_type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `btn`
--
ALTER TABLE `btn`
  ADD PRIMARY KEY (`btn_num`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
