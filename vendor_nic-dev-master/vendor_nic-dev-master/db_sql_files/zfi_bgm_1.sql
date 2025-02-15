-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2024 at 10:52 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

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
-- Table structure for table `zfi_bgm_1`
--

CREATE TABLE `zfi_bgm_1` (
  `FILE_NO` varchar(10) NOT NULL COMMENT 'File No',
  `REF_NO` varchar(30) NOT NULL,
  `BANKERS_NAME` varchar(40) DEFAULT NULL COMMENT 'Bankers Name',
  `BANKERS_BRANCH` varchar(40) DEFAULT NULL COMMENT 'Bankers Branch',
  `BANKERS_ADD1` varchar(40) DEFAULT NULL COMMENT 'Bankers Address1',
  `BANKERS_ADD2` varchar(40) DEFAULT NULL COMMENT 'Bankers Address2',
  `BANKERS_ADD3` varchar(40) DEFAULT NULL COMMENT 'Bankers Address3',
  `BANKERS_CITY` varchar(20) DEFAULT NULL COMMENT 'Bankers City',
  `B_PIN_CODE` int(6) DEFAULT NULL COMMENT 'Pin Code',
  `BANK_GU_NO` varchar(20) DEFAULT NULL COMMENT 'Bank Guarantee No',
  `BG_DATE` date DEFAULT NULL COMMENT 'BG Date',
  `BG_AMOUNT` varchar(13) DEFAULT NULL COMMENT 'BG Amount',
  `PO_NUMBER` varchar(20) DEFAULT NULL COMMENT 'Purchase Order No',
  `DEPARTMENT` varchar(8) DEFAULT NULL COMMENT 'Department',
  `PO_DATE` date DEFAULT NULL COMMENT 'Purchase Order Date',
  `YARD_NO` int(6) DEFAULT NULL COMMENT 'Yard No',
  `VALIDITY_DATE` date DEFAULT NULL COMMENT 'Validity Date',
  `CLAIM_PERIOD` date DEFAULT NULL COMMENT 'Claim Period',
  `CHECKLIST_REF` varchar(15) DEFAULT NULL COMMENT 'Checklist Reference',
  `CHECKLIST_DATE` date DEFAULT NULL COMMENT 'Checklist Date',
  `BG_TYPE` varchar(3) DEFAULT NULL COMMENT 'BG Type',
  `VENDOR_NAME` varchar(40) DEFAULT NULL COMMENT 'Vendor Name',
  `VENDOR_ADD1` varchar(40) DEFAULT NULL COMMENT 'Vendor Address1',
  `VENDOR_ADD2` varchar(40) DEFAULT NULL COMMENT 'Vendor Address2',
  `VENDOR_ADD3` varchar(40) DEFAULT NULL COMMENT 'Vendor Address3',
  `VENDOR_CITY` varchar(20) DEFAULT NULL COMMENT 'Vendor City',
  `V_PIN_CODE` int(6) DEFAULT NULL COMMENT 'Vendors Pin Code',
  `CONFIRMATION` varchar(1) DEFAULT NULL COMMENT 'Confirmation',
  `EXTENTION_DATE1` date DEFAULT NULL COMMENT 'Extention Date1',
  `EXTENTION_DATE2` date DEFAULT NULL COMMENT 'Extention Date2',
  `EXTENTION_DATE3` date DEFAULT NULL COMMENT 'Extention Date3',
  `EXTENTION_DATE4` date DEFAULT NULL COMMENT 'Extention Date4',
  `EXTENTION_DATE5` date DEFAULT NULL COMMENT 'Extention Date5',
  `EXTENTION_DATE6` date DEFAULT NULL COMMENT 'Extention Date6',
  `RELEASE_DATE` date DEFAULT NULL COMMENT 'Release Date',
  `DEM_NOTICE_DATE` date DEFAULT NULL COMMENT 'Demand Notice Date',
  `EXT_LETTER_DATE` date DEFAULT NULL COMMENT ' Extention Letter Date'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='SDBG Payment Advice';

--
-- Dumping data for table `zfi_bgm_1`
--

INSERT INTO `zfi_bgm_1` (`FILE_NO`, `REF_NO`, `BANKERS_NAME`, `BANKERS_BRANCH`, `BANKERS_ADD1`, `BANKERS_ADD2`, `BANKERS_ADD3`, `BANKERS_CITY`, `B_PIN_CODE`, `BANK_GU_NO`, `BG_DATE`, `BG_AMOUNT`, `PO_NUMBER`, `DEPARTMENT`, `PO_DATE`, `YARD_NO`, `VALIDITY_DATE`, `CLAIM_PERIOD`, `CHECKLIST_REF`, `CHECKLIST_DATE`, `BG_TYPE`, `VENDOR_NAME`, `VENDOR_ADD1`, `VENDOR_ADD2`, `VENDOR_ADD3`, `VENDOR_CITY`, `V_PIN_CODE`, `CONFIRMATION`, `EXTENTION_DATE1`, `EXTENTION_DATE2`, `EXTENTION_DATE3`, `EXTENTION_DATE4`, `EXTENTION_DATE5`, `EXTENTION_DATE6`, `RELEASE_DATE`, `DEM_NOTICE_DATE`, `EXT_LETTER_DATE`) VALUES
('33333', 'ref', 'AXIS BANK', 'KOLKATA', 'KOLKATA', 'KOLAKATA', '', 'KOL', 700001, '8765434567890987', NULL, '1133999999999', '40839293', 'QAP', '2023-12-01', 0, '2023-12-01', '2023-12-01', '', NULL, 'YYY', 'DCG DATA CORE SYSTEMS INDIA PRIVATE LIMI', 'KOLKATA', 'SALT LAKE', 'SECTOR 2', 'KOLkAKAT', 700232, 'y', '2023-12-31', NULL, NULL, NULL, NULL, NULL, '2024-01-31', NULL, '2023-12-21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `zfi_bgm_1`
--
ALTER TABLE `zfi_bgm_1`
  ADD PRIMARY KEY (`FILE_NO`,`REF_NO`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
