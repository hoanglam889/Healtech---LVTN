-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 11, 2026 lúc 10:13 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `clinic_flow_erp`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `qr_code` varchar(100) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_profile_id` int(11) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time DEFAULT NULL,
  `status` enum('PENDING','BOOKED','WAITING','EXAMINING','DOING_SERVICE','DONE','CANCELLED') DEFAULT 'BOOKED',
  `priority_score` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `appointments`
--

INSERT INTO `appointments` (`id`, `qr_code`, `patient_id`, `doctor_profile_id`, `appointment_date`, `appointment_time`, `status`, `priority_score`, `created_at`) VALUES
(13, 'HT-APPT-20260613-0B5397A6', 2, 1, '2026-06-13', '17:00:00', 'DONE', 4, '2026-06-13 13:54:46'),
(14, 'HT-APPT-20260613-ED7E14EB', 2, 1, '2026-06-14', '14:00:00', 'DONE', 6, '2026-06-13 14:05:06'),
(15, 'HT-APPT-20260613-43DC689E', 4, 1, '2026-06-14', '14:00:00', 'DONE', 6, '2026-06-13 14:29:43'),
(16, 'HT-APPT-20260619-63379889', 4, 1, '2026-06-19', '08:00:00', 'CANCELLED', 1, '2026-06-18 17:48:20'),
(17, 'HT-APPT-20260620-F573FC4B', 4, 5, '2026-06-20', '11:00:00', 'DONE', 6, '2026-06-19 17:37:11'),
(18, 'HT-APPT-20260620-388D49C7', 6, 5, '2026-06-20', '10:00:00', 'CANCELLED', 1, '2026-06-19 18:34:58'),
(20, 'HT-APPT-20260620-C275D0CB', 4, 1, '2026-06-20', '16:00:00', 'DONE', 6, '2026-06-20 08:23:58'),
(21, 'HT-APPT-20260620-A9DAD793', 6, 1, '2026-06-20', '16:00:00', 'DONE', 7, '2026-06-20 08:27:18'),
(22, 'HT-APPT-20260620-9A4B703C', 4, 1, '2026-06-20', '16:00:00', 'DONE', 6, '2026-06-20 08:50:41'),
(23, 'HT-APPT-20260620-4A5D1518', 4, 1, '2026-06-20', '16:00:00', 'DONE', 7, '2026-06-20 08:55:49'),
(24, 'HT-APPT-20260620-DA58C814', 7, 1, '2026-06-20', '16:00:00', 'DONE', 6, '2026-06-20 08:56:01'),
(25, 'HT-APPT-20260620-9615C152', 6, 5, '2026-06-20', '16:00:00', 'DONE', 7, '2026-06-20 09:15:34'),
(26, 'HT-APPT-20260620-05389285', 7, 5, '2026-06-20', '16:00:00', 'DONE', 6, '2026-06-20 09:16:26'),
(27, 'HT-APPT-20260620-39206EE1', 6, 5, '2026-06-20', '16:00:00', 'DONE', 4, '2026-06-20 09:27:21'),
(28, 'HT-APPT-20260620-A95509F7', 7, 5, '2026-06-20', '16:00:00', 'DONE', 5, '2026-06-20 09:27:34'),
(29, 'HT-APPT-20260620-D7A9788F', 7, 5, '2026-06-20', '17:00:00', 'DONE', 6, '2026-06-20 09:50:55'),
(30, 'HT-APPT-20260621-61431617', 4, 5, '2026-06-21', '16:00:00', 'DONE', 6, '2026-06-21 08:29:01'),
(31, 'HT-APPT-20260623-4B023A04', 12, 5, '2026-06-23', '13:00:00', 'DONE', 4, '2026-06-23 06:37:43'),
(32, 'HT-APPT-20260623-37852AA5', 13, 5, '2026-06-23', '16:00:00', 'CANCELLED', 1, '2026-06-23 07:12:34'),
(33, 'HT-APPT-20260623-59443307', 13, 5, '2026-06-23', '14:00:00', 'DONE', 7, '2026-06-23 07:32:26'),
(34, 'HT-APPT-20260624-D280DA47', 4, 5, '2026-06-24', '16:00:00', 'DONE', 0, '2026-06-24 09:12:32'),
(35, 'HT-APPT-20260626-8E872968', 10, 5, '2026-06-26', '15:00:00', 'DONE', 7, '2026-06-26 07:10:19'),
(36, 'HT-APPT-20260626-BD0FEC3A', 4, 5, '2026-06-26', '15:00:00', 'DONE', 6, '2026-06-26 07:17:51'),
(37, 'HT-APPT-20260626-B24A8946', 6, 5, '2026-06-26', '15:00:00', 'CANCELLED', 0, '2026-06-26 07:18:11'),
(38, 'HT-APPT-20260626-225A4B7D', 14, 5, '2026-06-26', '15:00:00', 'DONE', 6, '2026-06-26 07:20:05'),
(39, 'HT-APPT-20260626-A58DB456', 13, 5, '2026-06-26', '15:00:00', 'DONE', 9, '2026-06-26 07:21:12'),
(40, 'HT-APPT-20260626-CBC378D5', 4, 1, '2026-06-26', '17:00:00', 'CANCELLED', 4, '2026-06-26 10:27:21'),
(41, 'HT-APPT-20260626-31E279F4', 18, 5, '2026-06-26', '16:00:00', 'CANCELLED', 1, '2026-06-26 16:00:10'),
(42, 'HT-APPT-20260628-AA61F050', 6, 5, '2026-06-28', '15:00:00', 'DONE', 0, '2026-06-28 08:16:25'),
(43, 'HT-APPT-20260628-AEC5FF97', 6, 5, '2026-06-28', '15:00:00', 'DONE', 0, '2026-06-28 08:17:31'),
(44, 'HT-APPT-20260628-7B95ABD4', 4, 5, '2026-06-28', '15:00:00', 'CANCELLED', 1, '2026-06-28 08:27:50'),
(45, 'HT-APPT-20260628-01CA8C49', 4, 5, '2026-06-28', '16:00:00', 'CANCELLED', 6, '2026-06-28 09:10:11'),
(46, 'HT-APPT-20260629-7CD8B9DD', 6, 5, '2026-06-29', '17:00:00', 'CANCELLED', 1, '2026-06-29 07:22:07'),
(47, 'HT-APPT-20260629-F1A13739', 4, 5, '2026-06-29', '19:00:00', 'CANCELLED', 1, '2026-06-29 07:26:30'),
(48, 'HT-APPT-20260629-82ACA80A', 4, 5, '2026-06-29', '20:00:00', 'CANCELLED', 1, '2026-06-29 07:28:32'),
(49, 'HT-APPT-20260702-44B073F0', 10, 5, '2026-07-02', NULL, 'CANCELLED', 1, '2026-07-02 13:27:32'),
(50, 'HT-APPT-20260702-0F155901', 10, 5, '2026-07-02', NULL, 'DONE', 6, '2026-07-02 13:31:27'),
(51, 'HT-APPT-20260702-7EF08ED9', 6, 5, '2026-07-02', NULL, 'DONE', 6, '2026-07-02 13:32:37'),
(52, 'HT-APPT-20260702-995B6AAB', 6, 5, '2026-07-02', NULL, 'DONE', 6, '2026-07-02 13:52:19'),
(53, 'HT-APPT-20260720-FB786334', 10, 5, '2026-07-20', NULL, 'DONE', 0, '2026-07-20 10:40:08'),
(54, 'HT-APPT-20260723-6CCEF4CD', 10, 5, '2026-07-23', NULL, 'DONE', 7, '2026-07-23 01:48:10'),
(55, 'HT-APPT-20260729-B17D1B8D', 14, 5, '2026-07-29', NULL, 'DONE', 7, '2026-07-29 04:11:14'),
(56, 'HT-APPT-20260805-32C0A21D', 4, 2, '2026-08-05', NULL, 'DONE', 0, '2026-08-05 07:05:59'),
(57, 'HT-APPT-20260805-5552E6E9', 14, 2, '2026-08-05', NULL, 'DONE', 0, '2026-08-05 07:07:08'),
(58, 'HT-APPT-20260805-DF9F9CA0', 10, 5, '2026-08-05', NULL, 'DONE', 6, '2026-08-05 07:09:51'),
(59, 'HT-APPT-20260805-0BC26F1D', 6, 5, '2026-08-05', NULL, 'DONE', 6, '2026-08-05 07:25:11'),
(60, 'HT-APPT-20260806-53D31213', 4, 5, '2026-08-06', NULL, 'DONE', 6, '2026-08-06 02:14:24'),
(61, 'HT-APPT-20260806-58799641', 6, 5, '2026-08-06', '09:00:00', 'DONE', 4, '2026-08-06 02:58:00'),
(62, 'HT-APPT-20260806-B96758A5', 14, 5, '2026-08-06', '10:00:00', 'CANCELLED', 7, '2026-08-06 03:04:57'),
(63, 'HT-APPT-20260806-D0D90CC8', 4, 5, '2026-08-06', '10:00:00', 'DONE', 6, '2026-08-06 03:18:50'),
(64, 'HT-APPT-20260806-177318C6', 14, 5, '2026-08-06', '10:00:00', 'DONE', 5, '2026-08-06 03:19:50'),
(65, 'HT-APPT-20260806-75C6D0C2', 10, 5, '2026-08-06', '10:00:00', 'DONE', 5, '2026-08-06 03:22:51'),
(66, 'HT-APPT-20260806-DF77CAD5', 10, 5, '2026-08-06', '10:00:00', 'DONE', 4, '2026-08-06 03:33:09'),
(67, 'HT-APPT-20260806-0A511AA6', 4, 5, '2026-08-06', '11:00:00', 'CANCELLED', 7, '2026-08-06 03:51:53'),
(68, 'HT-APPT-20260806-0CB07040', 4, 5, '2026-08-06', '11:00:00', 'DONE', 6, '2026-08-06 04:18:44'),
(69, 'HT-APPT-20260806-C4F60A58', 4, 5, '2026-08-06', '13:00:00', 'DONE', 0, '2026-08-06 04:20:18'),
(70, 'HT-APPT-20260806-253054E6', 4, 2, '2026-08-06', '13:00:00', 'CANCELLED', 1, '2026-08-06 04:45:05'),
(71, 'HT-APPT-20260807-32CD9397', 6, 2, '2026-08-07', '10:00:00', 'DONE', 6, '2026-08-07 03:16:14'),
(72, 'HT-APPT-20260808-FB14685B', 4, 2, '2026-08-08', '13:00:00', 'DONE', 1007, '2026-08-08 05:17:03'),
(73, 'HT-APPT-20260808-8C2EB464', 14, 2, '2026-08-08', '13:00:00', 'DONE', 7, '2026-08-08 05:21:34'),
(74, 'HT-APPT-20260810-8961B4EE', 4, 2, '2026-08-10', '15:00:00', 'DOING_SERVICE', 6, '2026-08-10 08:00:20'),
(75, 'HT-APPT-20260810-617BA74D', 14, 2, '2026-08-10', '15:00:00', 'CANCELLED', 1, '2026-08-10 08:02:06'),
(76, 'HT-APPT-20260810-5F5AB0E1', 14, 2, '2026-08-10', '15:00:00', 'EXAMINING', 7, '2026-08-10 08:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointment_services`
--

CREATE TABLE `appointment_services` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `snapshot_price` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `appointment_services`
--

INSERT INTO `appointment_services` (`id`, `appointment_id`, `service_id`, `quantity`, `snapshot_price`, `created_at`) VALUES
(2, 31, 3, 1, 100000.00, '2026-06-24 08:27:39'),
(3, 33, 2, 1, 150000.00, '2026-06-24 08:36:35'),
(4, 39, 3, 1, 100000.00, '2026-06-26 08:13:36'),
(5, 36, 4, 1, 50000.00, '2026-06-26 08:42:55'),
(6, 38, 4, 1, 50000.00, '2026-06-26 08:43:10'),
(7, 55, 3, 1, 100000.00, '2026-07-29 04:14:32'),
(8, 57, 3, 1, 100000.00, '2026-08-05 07:11:32'),
(9, 66, 2, 1, 150000.00, '2026-08-06 03:33:41'),
(10, 68, 2, 1, 150000.00, '2026-08-06 04:24:44'),
(11, 69, 3, 1, 100000.00, '2026-08-06 04:27:20'),
(12, 69, 4, 1, 50000.00, '2026-08-06 04:27:20'),
(13, 71, 3, 1, 100000.00, '2026-08-07 03:19:36'),
(14, 72, 3, 1, 100000.00, '2026-08-08 05:18:00'),
(15, 74, 2, 1, 150000.00, '2026-08-10 08:30:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointment_status_logs`
--

CREATE TABLE `appointment_status_logs` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `old_status` enum('BOOKED','WAITING','EXAMINING','DOING_SERVICE','DONE','CANCELLED') DEFAULT NULL,
  `new_status` enum('BOOKED','WAITING','EXAMINING','DOING_SERVICE','DONE','CANCELLED') NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `appointment_status_logs`
--

INSERT INTO `appointment_status_logs` (`id`, `appointment_id`, `old_status`, `new_status`, `changed_by`, `changed_at`, `notes`) VALUES
(1, 40, 'WAITING', 'WAITING', NULL, '2026-06-26 10:47:14', 'Lễ tân dời lịch khám: Giờ (17:00:00 -> 17:00). Bác sĩ ID (5 -> 1). '),
(2, 52, NULL, 'BOOKED', NULL, '2026-07-02 13:52:19', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(3, 53, NULL, 'BOOKED', NULL, '2026-07-20 10:40:08', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(4, 53, 'BOOKED', 'WAITING', NULL, '2026-07-20 10:40:33', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(5, 53, 'WAITING', 'EXAMINING', NULL, '2026-07-20 10:40:41', 'Bác sĩ gọi vào phòng khám'),
(6, 53, 'EXAMINING', 'WAITING', NULL, '2026-07-23 01:14:46', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(7, 53, 'WAITING', 'EXAMINING', NULL, '2026-07-23 01:14:49', 'Bác sĩ gọi vào phòng khám'),
(8, 53, 'EXAMINING', 'DONE', NULL, '2026-07-23 01:14:53', 'Hoàn tất khám bệnh'),
(9, 54, NULL, '', NULL, '2026-07-23 01:48:10', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(10, 54, '', 'BOOKED', NULL, '2026-07-23 01:49:01', 'Thanh toán thành công qua VNPAY'),
(11, 54, 'BOOKED', 'WAITING', NULL, '2026-07-23 01:49:56', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(12, 54, 'WAITING', 'EXAMINING', NULL, '2026-07-23 01:50:06', 'Bác sĩ gọi vào phòng khám'),
(13, 54, 'EXAMINING', 'DONE', NULL, '2026-07-23 01:50:32', 'Hoàn tất khám bệnh'),
(14, 55, NULL, '', NULL, '2026-07-29 04:11:14', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(15, 55, '', 'BOOKED', NULL, '2026-07-29 04:12:15', 'Thanh toán thành công qua VNPAY'),
(16, 55, 'BOOKED', 'WAITING', NULL, '2026-07-29 04:13:51', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(17, 55, 'WAITING', 'EXAMINING', NULL, '2026-07-29 04:14:23', 'Bác sĩ gọi vào phòng khám'),
(18, 55, 'EXAMINING', 'DONE', NULL, '2026-07-29 04:14:43', 'Hoàn tất khám bệnh'),
(19, 56, NULL, 'BOOKED', NULL, '2026-08-05 07:05:59', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(20, 56, 'BOOKED', 'WAITING', NULL, '2026-08-05 07:06:36', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(21, 57, NULL, '', NULL, '2026-08-05 07:07:08', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(22, 57, '', 'BOOKED', NULL, '2026-08-05 07:08:11', 'Thanh toán thành công qua VNPAY'),
(23, 57, 'BOOKED', 'WAITING', NULL, '2026-08-05 07:08:34', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(24, 58, NULL, 'BOOKED', NULL, '2026-08-05 07:09:51', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(25, 58, 'BOOKED', 'WAITING', NULL, '2026-08-05 07:10:08', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(26, 57, 'WAITING', 'EXAMINING', NULL, '2026-08-05 07:10:38', 'Bác sĩ gọi vào phòng khám'),
(27, 57, 'EXAMINING', 'WAITING', NULL, '2026-08-05 07:10:45', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(28, 56, 'WAITING', 'EXAMINING', NULL, '2026-08-05 07:10:48', 'Bác sĩ gọi vào phòng khám'),
(29, 56, 'EXAMINING', 'WAITING', NULL, '2026-08-05 07:10:56', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(30, 57, 'WAITING', 'EXAMINING', NULL, '2026-08-05 07:11:03', 'Bác sĩ gọi vào phòng khám'),
(31, 57, 'EXAMINING', 'DONE', NULL, '2026-08-05 07:11:36', 'Hoàn tất khám bệnh'),
(32, 56, 'WAITING', 'EXAMINING', NULL, '2026-08-05 07:12:09', 'Bác sĩ gọi vào phòng khám'),
(33, 56, 'EXAMINING', 'DONE', NULL, '2026-08-05 07:12:14', 'Hoàn tất khám bệnh'),
(34, 58, 'WAITING', 'EXAMINING', NULL, '2026-08-05 07:13:06', 'Bác sĩ gọi vào phòng khám'),
(35, 58, 'EXAMINING', 'DONE', NULL, '2026-08-05 07:13:17', 'Hoàn tất khám bệnh'),
(36, 59, NULL, 'BOOKED', NULL, '2026-08-05 07:25:11', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(37, 59, 'BOOKED', 'WAITING', NULL, '2026-08-05 07:26:49', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(38, 59, 'WAITING', 'EXAMINING', NULL, '2026-08-05 08:32:17', 'Bác sĩ gọi vào phòng khám'),
(39, 59, 'EXAMINING', 'DONE', NULL, '2026-08-05 08:32:22', 'Hoàn tất khám bệnh'),
(40, 60, NULL, 'BOOKED', NULL, '2026-08-06 02:14:24', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(41, 60, 'BOOKED', 'WAITING', NULL, '2026-08-06 02:15:58', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(42, 60, 'WAITING', 'EXAMINING', NULL, '2026-08-06 02:16:51', 'Bác sĩ gọi vào phòng khám'),
(43, 60, 'EXAMINING', 'DONE', NULL, '2026-08-06 02:17:08', 'Hoàn tất khám bệnh'),
(44, 61, NULL, 'BOOKED', NULL, '2026-08-06 02:58:00', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(45, 61, 'BOOKED', 'WAITING', NULL, '2026-08-06 02:58:11', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(46, 61, 'WAITING', 'EXAMINING', NULL, '2026-08-06 02:58:27', 'Bác sĩ gọi vào phòng khám'),
(47, 61, 'EXAMINING', 'DONE', NULL, '2026-08-06 02:58:36', 'Hoàn tất khám bệnh'),
(48, 62, NULL, 'BOOKED', NULL, '2026-08-06 03:04:57', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(49, 62, 'BOOKED', 'WAITING', NULL, '2026-08-06 03:05:44', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(50, 63, NULL, 'BOOKED', NULL, '2026-08-06 03:18:50', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(51, 63, 'BOOKED', 'WAITING', NULL, '2026-08-06 03:19:05', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(52, 62, 'WAITING', 'CANCELLED', NULL, '2026-08-06 03:19:39', 'Hủy lịch khám'),
(53, 64, NULL, 'BOOKED', NULL, '2026-08-06 03:19:50', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(54, 65, NULL, 'BOOKED', NULL, '2026-08-06 03:22:51', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(55, 63, 'WAITING', 'EXAMINING', NULL, '2026-08-06 03:30:42', 'Bác sĩ gọi vào phòng khám'),
(56, 63, 'EXAMINING', 'DONE', NULL, '2026-08-06 03:31:13', 'Hoàn tất khám bệnh'),
(57, 65, 'BOOKED', 'WAITING', NULL, '2026-08-06 03:32:24', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(58, 64, 'BOOKED', 'WAITING', NULL, '2026-08-06 03:32:34', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(59, 64, 'WAITING', 'EXAMINING', NULL, '2026-08-06 03:32:46', 'Bác sĩ gọi vào phòng khám'),
(60, 64, 'EXAMINING', 'DONE', NULL, '2026-08-06 03:32:49', 'Hoàn tất khám bệnh'),
(61, 65, 'WAITING', 'EXAMINING', NULL, '2026-08-06 03:32:50', 'Bác sĩ gọi vào phòng khám'),
(62, 65, 'EXAMINING', 'DONE', NULL, '2026-08-06 03:32:53', 'Hoàn tất khám bệnh'),
(63, 66, NULL, 'BOOKED', NULL, '2026-08-06 03:33:09', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(64, 66, 'BOOKED', 'WAITING', NULL, '2026-08-06 03:33:20', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(65, 66, 'WAITING', 'EXAMINING', NULL, '2026-08-06 03:33:31', 'Bác sĩ gọi vào phòng khám'),
(66, 66, 'EXAMINING', 'DONE', NULL, '2026-08-06 03:33:42', 'Hoàn tất khám bệnh'),
(67, 67, NULL, '', NULL, '2026-08-06 03:51:53', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(68, 67, '', 'BOOKED', NULL, '2026-08-06 03:52:34', 'Thanh toán thành công qua VNPAY'),
(69, 67, 'BOOKED', 'WAITING', NULL, '2026-08-06 03:52:51', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(70, 67, 'WAITING', 'CANCELLED', NULL, '2026-08-06 03:53:14', 'Hủy lịch khám'),
(71, 68, NULL, 'BOOKED', NULL, '2026-08-06 04:18:44', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(72, 68, 'BOOKED', 'WAITING', NULL, '2026-08-06 04:19:00', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(73, 69, NULL, 'BOOKED', NULL, '2026-08-06 04:20:18', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(74, 69, 'BOOKED', 'WAITING', NULL, '2026-08-06 04:21:06', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(75, 68, 'WAITING', 'EXAMINING', NULL, '2026-08-06 04:21:45', 'Bác sĩ gọi vào phòng khám'),
(76, 68, 'EXAMINING', 'DONE', NULL, '2026-08-06 04:25:56', 'Hoàn tất khám bệnh'),
(77, 69, 'WAITING', 'EXAMINING', NULL, '2026-08-06 04:27:14', 'Bác sĩ gọi vào phòng khám'),
(78, 70, NULL, 'BOOKED', NULL, '2026-08-06 04:45:05', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(79, 69, 'EXAMINING', 'WAITING', NULL, '2026-08-06 04:51:58', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(80, 69, 'WAITING', 'EXAMINING', NULL, '2026-08-07 03:11:45', 'Bác sĩ gọi vào phòng khám'),
(81, 69, 'EXAMINING', 'DONE', NULL, '2026-08-07 03:11:49', 'Hoàn tất khám bệnh'),
(82, 71, NULL, 'BOOKED', NULL, '2026-08-07 03:16:14', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(83, 71, 'BOOKED', 'WAITING', NULL, '2026-08-07 03:19:04', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(84, 71, 'WAITING', 'EXAMINING', NULL, '2026-08-07 03:19:19', 'Bác sĩ gọi vào phòng khám'),
(85, 71, 'EXAMINING', 'DONE', NULL, '2026-08-07 03:23:14', 'Hoàn tất khám bệnh'),
(86, 70, 'BOOKED', 'CANCELLED', NULL, '2026-08-08 05:16:22', 'Hủy lịch khám'),
(87, 72, NULL, 'BOOKED', NULL, '2026-08-08 05:17:03', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(88, 72, 'BOOKED', 'WAITING', NULL, '2026-08-08 05:17:45', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(89, 72, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:17:51', 'Bác sĩ gọi vào phòng khám'),
(90, 72, 'EXAMINING', 'DOING_SERVICE', NULL, '2026-08-08 05:18:11', 'Bác sĩ chỉ định làm cận lâm sàng'),
(91, 72, 'DOING_SERVICE', 'WAITING', NULL, '2026-08-08 05:18:15', 'Đã nộp kết quả cận lâm sàng (Ưu tiên khám)'),
(92, 72, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:18:26', 'Bác sĩ gọi vào phòng khám'),
(93, 72, 'EXAMINING', 'WAITING', NULL, '2026-08-08 05:18:27', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(94, 72, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:18:31', 'Bác sĩ gọi vào phòng khám'),
(95, 72, 'EXAMINING', 'DOING_SERVICE', NULL, '2026-08-08 05:18:33', 'Bác sĩ chỉ định làm cận lâm sàng'),
(96, 72, 'DOING_SERVICE', 'WAITING', NULL, '2026-08-08 05:19:36', 'Đã nộp kết quả cận lâm sàng (Ưu tiên khám)'),
(97, 72, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:19:38', 'Bác sĩ gọi vào phòng khám'),
(98, 72, 'EXAMINING', 'WAITING', NULL, '2026-08-08 05:19:38', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(99, 72, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:19:46', 'Bác sĩ gọi vào phòng khám'),
(100, 72, 'EXAMINING', 'DOING_SERVICE', NULL, '2026-08-08 05:19:47', 'Bác sĩ chỉ định làm cận lâm sàng'),
(101, 72, 'DOING_SERVICE', 'WAITING', NULL, '2026-08-08 05:21:12', 'Đã nộp kết quả cận lâm sàng (Ưu tiên khám)'),
(102, 73, NULL, '', NULL, '2026-08-08 05:21:34', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(103, 73, '', 'BOOKED', NULL, '2026-08-08 05:22:22', 'Thanh toán thành công qua VNPAY'),
(104, 73, 'BOOKED', 'WAITING', NULL, '2026-08-08 05:22:34', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(105, 72, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:22:50', 'Bác sĩ gọi vào phòng khám'),
(106, 72, 'EXAMINING', 'DONE', NULL, '2026-08-08 05:23:13', 'Hoàn tất khám bệnh'),
(107, 73, 'WAITING', 'EXAMINING', NULL, '2026-08-08 05:24:04', 'Bác sĩ gọi vào phòng khám'),
(108, 73, 'EXAMINING', 'DONE', NULL, '2026-08-08 05:24:10', 'Hoàn tất khám bệnh'),
(109, 74, NULL, 'BOOKED', NULL, '2026-08-10 08:00:20', 'Bệnh nhân tạo lịch hẹn (Tiền mặt)'),
(110, 74, 'BOOKED', 'WAITING', NULL, '2026-08-10 08:00:45', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(111, 74, 'WAITING', 'EXAMINING', NULL, '2026-08-10 08:01:50', 'Bác sĩ gọi vào phòng khám'),
(112, 75, NULL, '', NULL, '2026-08-10 08:02:06', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(113, 76, NULL, '', NULL, '2026-08-10 08:02:06', 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)'),
(114, 76, '', 'BOOKED', NULL, '2026-08-10 08:03:07', 'Thanh toán thành công qua VNPAY'),
(115, 76, 'BOOKED', 'WAITING', NULL, '2026-08-10 08:03:42', 'Bệnh nhân đã check-in (Lễ tân xác nhận)'),
(116, 75, '', 'CANCELLED', NULL, '2026-08-10 08:20:00', 'Hệ thống tự động hủy do quá hạn chờ thanh toán VNPAY'),
(117, 74, 'EXAMINING', 'DOING_SERVICE', NULL, '2026-08-10 08:30:25', 'Bác sĩ chỉ định làm cận lâm sàng'),
(118, 76, 'WAITING', 'EXAMINING', NULL, '2026-08-10 08:30:32', 'Bác sĩ gọi vào phòng khám');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `image_url` text DEFAULT NULL,
  `author_name` varchar(100) DEFAULT NULL,
  `is_published` tinyint(4) NOT NULL DEFAULT 1,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `articles`
--

INSERT INTO `articles` (`id`, `title`, `category`, `content`, `image_url`, `author_name`, `is_published`, `user_id`, `created_at`, `updated_at`) VALUES
(3, 'Bệnh Sốt rét và cách phòng tránh', 'Phòng bệnh hơn chữa bệnh', 'Thưa quý vị và bà con!\n\nBệnh sốt rét là bệnh truyền nhiễm do ký sinh trùng sốt rét ký sinh trong máu người bệnh gây nên. Bệnh lây chủ yếu do muỗi A-nô-phen truyền từ người bệnh sang người lành thông qua vết muỗi đốt. Mọi người đều có thể mắc bệnh nếu sống hoặc có qua lại nơi có sốt rét lưu hành và bị muỗi A-nô-phen đốt.\n\n\n\nTrung tâm Kiểm soát bệnh tật Hà Tĩnh tổ chức bắt và định loại muỗi sốt rét tại tổ 4, xã Vũ Quang\n\nBệnh sốt rét gây thiếu máu cho người bệnh. Trẻ em bị mắc bệnh sốt rét cơ thể còi cọc chậm lớn, kém thông minh. Phụ nữ có thai mắc bệnh sốt rét dễ gây sảy thai, thai chết lưu, đẻ non hoặc khi sinh dễ mắc phải những tai biến. Phụ nữ khi mang thai nhiễm ký sinh trùng sốt rét, có thể sinh con bị lây nhiễm bệnh sốt rét từ mẹ …\n\nCách phòng chống bệnh sốt rét:\n\nHiện nay vẫn chưa có vắc xin phòng bệnh Sốt rét, vì vậy biện pháp diệt muỗi, lăng quăng/bọ gậy và phòng chống muỗi đốt vẫn là biện pháp chủ yếu và hiệu quả nhất. Để không mắc bệnh sốt rét người dân cần thực hiện các biện pháp sau:\n\n- Thường xuyên ngủ màn, ngay cả ban ngày và màn cần được tẩm hóa chất diệt muỗi. Đây là biện pháp tốt nhất để phòng bệnh Sốt rét.\n\n- Buổi tối khi làm việc phải mặc quần áo dài tay để phòng muỗi đốt, có thể sử dụng nhang xua muỗi.\n\n- Vệ sinh môi trường xung quanh nơi ở, loại bỏ những nơi trú ẩn của muỗi như phát quang bụi rậm, khơi thông cống rãnh, sắp xếp vật dụng trong nhà ngăn nắp, sạch sẽ, quần áo phải được xếp gọn gàng không nên treo hay móc quần áo trên tường làm chỗ cho muỗi đậu, vv...\n\n- Những người đi làm ở vùng rừng núi cần mang theo màn để ngủ, trước khi đi nên đến cơ sở y tế để được tư vấn phòng chống bệnh sốt rét và khi trở về từ vùng có sốt rét lưu hành nên đến cơ sở y tế để được khám, xét nghiệm, nếu có bị sốt rét sẽ được điều trị kịp thời.\n\n- Khi thấy các triệu chứng của bệnh sốt rét như: Đau đầu, mệt mỏi, đau các cơ, rối loạn tiêu hóa, rét run, sốt nóng sau đó vã mồ hôi hoặc cảm thấy ớn lạnh, gai rét, người bệnh cần đến ngay cơ sở y tế gần nhất để được xét nghiệm, chẩn đoán và điều trị kịp thời..\n\nTrung tâm Kiểm soát bệnh tật Hà Tĩnh', 'public/images/img-1782811027022-4950361.jpg', 'Bác sĩ Phan Huỳnh Hoàng Lâm', 1, NULL, '2026-08-07 12:57:12.961136', '2026-08-07 12:57:12.968105'),
(4, 'Các yếu tố nguy cơ đột quỵ và cách kiểm soát không dùng thuốc', 'Bảo vệ bản thân', 'Đột quỵ là một trong những nguyên nhân hàng đầu gây tử vong và tàn tật. Nhiều yếu tố nguy cơ như tăng huyết áp, xơ vữa động mạch, hút thuốc hay lối sống ít vận động có thể được kiểm soát, giúp giảm đáng kể nguy cơ đột quỵ nếu được phòng ngừa sớm.\n\nĐột quỵ xảy ra khi nào?\n\nĐột quỵ xảy ra khi dòng máu cung cấp oxy và dưỡng chất cho não bị gián đoạn hoặc khi mạch máu não bị vỡ. Khi não không được cung cấp đủ oxy, các tế bào thần kinh có thể tổn thương hoặc chết chỉ sau vài phút. Về cơ bản, đột quỵ được chia thành hai loại chính:\n\nĐột quỵ thiếu máu cục bộ: Xảy ra khi mạch máu cung cấp cho não bị tắc nghẽn bởi cục máu đông hoặc mảng xơ vữa. Đây là dạng phổ biến nhất, chiếm khoảng 85–87% các trường hợp.\n\nĐột quỵ xuất huyết: Xảy ra khi mạch máu trong não bị vỡ, gây chảy máu trong não hoặc quanh não.\n\nMặc dù cơ chế khác nhau, hai loại đột quỵ này lại có nhiều yếu tố nguy cơ chung. Một số yếu tố không thể thay đổi như tuổi tác hoặc yếu tố di truyền, nhưng nhiều yếu tố khác hoàn toàn có thể kiểm soát được thông qua lối sống và chăm sóc sức khỏe.\n\nNguyên nhân gây đột quỵ thiếu máu cục bộ\n\nĐột quỵ thiếu máu cục bộ xảy ra khi một mạch máu cung cấp máu cho não bị tắc nghẽn đột ngột. Sự tắc nghẽn này có thể do cục máu đông hình thành ngay tại mạch máu hoặc do cục máu đông từ nơi khác trong cơ thể di chuyển lên não.\n\nMột số nguyên nhân phổ biến gồm:\n\nRung nhĩ: Rung nhĩ là một dạng rối loạn nhịp tim khiến tim đập nhanh và không đều. Khi tim không bơm máu hiệu quả, máu có thể ứ đọng trong buồng tim và hình thành cục máu đông. Nếu cục máu đông này di chuyển lên não, nó có thể gây tắc mạch và dẫn đến đột quỵ.\n\nXơ vữa động mạch: Xơ vữa động mạch xảy ra khi cholesterol, chất béo và các chất khác tích tụ trên thành động mạch, tạo thành các mảng xơ vữa. Khi các mảng này phát triển lớn hoặc bị vỡ, chúng có thể gây tắc nghẽn mạch máu hoặc tạo cục máu đông, làm giảm lưu lượng máu đến não.\n\nRối loạn đông máu: Một số bệnh lý khiến máu dễ hình thành cục đông bất thường. Ví dụ như huyết khối tĩnh mạch sâu hoặc các rối loạn đông máu do di truyền. Những cục máu đông này có thể di chuyển trong hệ tuần hoàn và gây tắc mạch não.\n\nNhiễm trùng nặng: Một số tình trạng nhiễm trùng nặng như nhiễm khuẩn huyết hoặc viêm màng não có thể làm tăng nguy cơ hình thành cục máu đông trong cơ thể, từ đó làm tăng nguy cơ đột quỵ.\n\nNguyên nhân của đột quỵ xuất huyết\n\nĐột quỵ xuất huyết xảy ra khi mạch máu trong não bị suy yếu và vỡ, khiến máu tràn vào mô não và gây tổn thương. Các nguyên nhân thường gặp bao gồm:\n\nTăng huyết áp kéo dài: Tăng huyết áp là nguyên nhân phổ biến nhất gây đột quỵ xuất huyết. Khi huyết áp cao kéo dài, thành mạch máu bị tổn thương và yếu dần, làm tăng nguy cơ vỡ mạch.\n\nPhình động mạch não: Phình động mạch là tình trạng thành mạch máu bị phồng lên do yếu. Nếu túi phình bị vỡ, máu sẽ tràn vào não và gây xuất huyết.\n\nDị dạng mạch máu: Một số người có dị dạng động tĩnh mạch bẩm sinh, khiến cấu trúc mạch máu bất thường và dễ vỡ.\n\nChấn thương sọ não: Các chấn thương vùng đầu, đặc biệt do tai nạn giao thông hoặc tai nạn sinh hoạt, có thể làm tổn thương mạch máu não và gây xuất huyết.\n\nMột số bệnh lý khác: Các bệnh như xơ gan, rối loạn đông máu hoặc khối u trong não cũng có thể làm tăng nguy cơ chảy máu trong não.\n\nCác yếu tố nguy cơ đột quỵ không thể thay đổi\n\nMột số yếu tố nguy cơ đột quỵ liên quan đến đặc điểm sinh học hoặc di truyền nên không thể thay đổi:\n\nTuổi tác: Nguy cơ đột quỵ tăng dần theo tuổi. Phần lớn các trường hợp xảy ra ở người từ 65 tuổi trở lên, mặc dù bệnh vẫn có thể xảy ra ở người trẻ.\n\nTiền sử gia đình: Nếu trong gia đình có người từng bị đột quỵ hoặc mắc các bệnh tim mạch, nguy cơ của bạn cũng có thể cao hơn.\n\nTiền sử đột quỵ hoặc cơn thiếu máu não thoáng qua: Cơn thiếu máu não thoáng qua (TIA), còn gọi là \"đột quỵ nhẹ\", là dấu hiệu cảnh báo nguy cơ đột quỵ thực sự trong tương lai nếu không được kiểm soát.\n\nNhững yếu tố nguy cơ có thể thay đổi\n\nPhần lớn các yếu tố nguy cơ đột quỵ có liên quan đến lối sống và tình trạng sức khỏe. Việc kiểm soát tốt các yếu tố này có thể giúp giảm đáng kể nguy cơ mắc bệnh.\n\nTăng huyết áp: Đây là yếu tố nguy cơ quan trọng nhất của đột quỵ. Huyết áp cao làm tổn thương thành mạch máu và thúc đẩy hình thành mảng xơ vữa.\n\nĐái tháo đường: Lượng đường trong máu cao kéo dài có thể làm tổn thương mạch máu và tăng nguy cơ xơ vữa động mạch.\n\nRối loạn mỡ máu: Cholesterol LDL cao và triglyceride tăng có thể dẫn đến tích tụ mảng bám trong động mạch.\n\nHút thuốc lá: Thuốc lá làm tăng huyết áp, giảm lượng oxy trong máu và thúc đẩy quá trình xơ vữa động mạch. Người hút thuốc có nguy cơ đột quỵ cao gấp khoảng hai lần so với người không hút.\n\nBéo phì và ít vận động: Thừa cân và lối sống ít vận động làm tăng nguy cơ tăng huyết áp, đái tháo đường và rối loạn mỡ máu – những yếu tố liên quan trực tiếp đến đột quỵ.\n\nLạm dụng rượu bia: Uống quá nhiều rượu có thể làm tăng huyết áp và gây rối loạn nhịp tim, từ đó làm tăng nguy cơ đột quỵ.\n\nCách giảm nguy cơ đột quỵ bằng thay đổi lối sống\n\nPhòng ngừa đột quỵ cần kết hợp giữa kiểm soát bệnh lý và xây dựng lối sống lành mạnh. Trong đó, nhiều biện pháp không dùng thuốc có thể giúp giảm nguy cơ đáng kể:\n\nDuy trì chế độ ăn lành mạnh: Nên ưu tiên thực phẩm giàu chất xơ như rau xanh, trái cây, ngũ cốc nguyên hạt và các loại đậu; hạn chế chất béo bão hòa, thực phẩm chế biến sẵn và giảm lượng muối trong khẩu phần để hỗ trợ kiểm soát huyết áp.\n\nTập thể dục thường xuyên: Hoạt động thể chất giúp cải thiện tuần hoàn máu, kiểm soát cân nặng và giảm nguy cơ bệnh tim mạch. Người trưởng thành nên duy trì ít nhất 150 phút hoạt động thể lực cường độ trung bình mỗi tuần, như đi bộ nhanh, đạp xe hoặc bơi lội.\n\nDuy trì cân nặng hợp lý: Giữ chỉ số khối cơ thể trong mức khỏe mạnh giúp giảm nguy cơ tăng huyết áp, đái tháo đường và rối loạn mỡ máu.\n\nBỏ thuốc lá: Ngừng hút thuốc là một trong những biện pháp quan trọng nhất để giảm nguy cơ đột quỵ và bệnh tim mạch.\n\nHạn chế rượu bia: Nên hạn chế lượng rượu tiêu thụ hằng ngày và tránh uống quá mức.\n\nKhám sức khỏe định kỳ: Kiểm tra huyết áp, đường huyết và mỡ máu thường xuyên giúp phát hiện sớm các yếu tố nguy cơ để có biện pháp kiểm soát kịp thời.', '/public/images/img-1782811566914-9369032.jpg', 'Bác sĩ Bùi Cao Mỹ Ái', 1, NULL, '2026-08-07 12:57:12.961136', '2026-08-07 12:57:12.968105'),
(5, '9 bệnh lây qua đường tình dục phổ biến nhất', 'Phòng bệnh hơn chữa bệnh', 'Các bệnh lây qua đường tình dục có thể lây nhiễm qua bất kỳ hình thức quan hệ tình dục nào kể cả quan hệ qua đường miệng hay qua hậu môn. Những bệnh lây qua đường tình dục thường rất khó chữa và gây hậu quả lâu dài. Thậm chí, nếu không được điều trị đúng cách bệnh có thể tái phát đi tái phát lại nhiều lần hoặc chuyển sang giai đoạn mãn tính.\n\nCác bệnh lây qua đường tình dục có thể xảy ra ở bất kỳ đối tượng nào, không phân biệt độ tuổi, giới tính. Trong đó, nam nữ trong độ tuổi sinh sản là nhóm đối tượng có nguy cơ nhiễm bệnh cao nhất. Dưới đây là tổng hợp 9 bệnh lây qua đường tình dục có tỷ lệ người mắc lớn nhất hiện nay bạn cần lưu ý:\n\n1. Bệnh lậu\nBệnh lậu gây ra bởi vi khuẩn lậu có tên khoa học là Neisseria gonorrhoeae. Ở giai đoạn đầu bệnh lậu hầu như không có biểu hiện cụ thể nào nên rất khó để nhận biết. Khi bệnh đã phát triển nặng có thể làm xuất hiện những triệu chứng như: tiểu đau buốt, dương vật chảy mủ, sưng đau tinh hoàn.\n\nỞ nữ giới, bệnh lậu thường không có triệu chứng điển hình nào nên dễ bị nhầm lẫn với viêm nhiễm âm đạo thông thường. Do đó, nếu thấy dịch tiết âm đạo tăng bất thường, xuất huyết âm đạo giữa chu kỳ, tiểu nhắt...chị em cần lưu ý vì đây có thể là triệu chứng cảnh báo bệnh lậu.\n\n2. Bệnh giang mai\nVi khuẩn giang mai có tên khoa học là Treponema pallidum. Nếu không được phát hiện và điều trị sớm bệnh giang mai có thể trải qua 3 giai đoạn và 1 giai đoạn tiềm ẩn.\n\nSau từ 10 - 90 ngày từ khi tiếp xúc với mầm bệnh, trên cơ thể người bệnh sẽ xuất hiện những vết loét không đau gọi là săng giang mai. Săng giang mai có thể tự biến mất sau 3 - 6 tuần mà không cần điều trị nên người bệnh rất dễ bỏ qua. Bệnh giang mai có thể gây rất nhiều biến chứng nguy hiểm, làm tổn thương nhiều cơ quan trong cơ thể như: khớp, da, thận, não, tai, mắt...thậm chí đe dọa đến tính mạng.\n\n3. Bệnh viêm âm đạo\nCác nguyên nhân hay gặp là Vi khuẩn, Trichomonas ( Trùng roi ), và nấm candida.\n\nBệnh viêm âm đạo do nhiễm Trichomonas và vi khuẩn là một trong số những bệnh lây qua đường tình dục phổ biến nhất hiện nay. Khuẩn Trichomonas là một loại ký sinh trùng có thể tồn tại trong nhiều môi trường khác nhau và rất dễ lây nhiễm. Nữ giới khi mắc bệnh viêm âm đạo sẽ xuất hiện những triệu chứng như: khí hư ra nhiều, mùi hôi bất thường, khí hư lẫn các bọt khí, có màu xanh, xám hoặc vàng xanh. Có thể ngứa ở âm đạo. Ngoài ra, khám trong thấy bề mặt thành âm đạo dễ bị sưng đỏ, phù nề.\n\nBệnh viêm âm đạo do nhiễm vi khuẩn là một trong số những bệnh lây qua đường tình dục phổ biến nhất hiện nay. Có thể nhiễm 1 loại vi khuẩn, hay nhiều loại vi khuẩn cùng lúc. Nữ giới khi mắc bệnh viêm âm đạo sẽ xuất hiện những triệu chứng như: khí hư ra nhiều, mùi hôi bất thường, khí hư có màu vàng đục hay xám. Ngoài ra, khám trong thấy bề mặt thành âm đạo dễ bị sưng đỏ, phù nề.\n\nBệnh viêm âm đạo do nhiễm nấm Candida là một trong số những bệnh lây qua đường tình dục phổ biến nhất hiện nay. Nữ giới khi mắc bệnh viêm âm đạo do nấm candida sẽ xuất hiện những triệu chứng như: khí hư màu trắng, vón cục, như váng sữa và kèm ngứa âm họ âm đạo. Ngoài ra, khám trong thấy bề mặt thành âm đạo dễ bị sưng đỏ và có dịch như váng sữa đóng ở thành âm đạo.\n\n4. Bệnh HIV\nHIV là căn bệnh thế kỷ và cũng là một trong những bệnh lây qua đường tình dục nguy hiểm nhất hiện nay. Virus HIV gây suy giảm miễn dịch của cơ thể và có thể lây nhiễm qua nhiều con đường khác nhau như: quan hệ tình dục, lây qua truyền máu, lây từ mẹ sang con...\n\nChỉ một số ít các trường hợp nhiễm HIV xuất hiện những triệu chứng giống với cảm cúm thông thường kéo dài từ 2 - 4 tuần. Do đó, người bệnh thường không biết mình bị nhiễm HIV nếu không chủ động đi xét nghiệm.\n\n5. Bệnh Herpes sinh dục\nGiống với nhiều bệnh lây qua đường tình dục khác, Herpes sinh dục vẫn có thể lây nhiễm ngay cả khi không gây có triệu chứng bệnh. Do đó, nếu thấy trên cơ thể xuất hiện những mụn nước, nhất là quanh cơ quan sinh dục, hậu môn, sốt nhẹ, sưng đau hạch bạn cần hết sức lưu ý.\n\n6. Bệnh viêm cổ tử cung\nViêm cổ tử cung do nhiễm C. Trachomatis là bệnh rất dễ lây qua đường tình dục. Khi nhiễm bệnh, nữ giới có thể xuất hiện những triệu chứng như: khí hư ra nhiều, chảy máu âm đạo bất thường nhất là sau khi quan hệ.\n\n7. Bệnh sùi mào gà\nĐây là một bệnh lây qua đường tình dục rất phổ biến gây ra do virus HPV. Sùi mào gà có thể lây qua quan hệ tình dục, lây từ mẹ sang con, lây qua đường máu hay lây do tiếp xúc trực tiếp với vết thương hở.\n\nKhi bị nhiễm sùi mào gà, người bệnh sẽ xuất hiện những nốt sần sùi, màu hồng nhạt ở nhiều vị trí như: cơ quan sinh dục nam nữ, cổ tử cung, lỗ tiểu, tầng sinh môn, hậu môn, mắt, mũi, miệng...Phụ nữ mang thai nếu bị nhiễm sùi mào gà có thể lây sang con và ảnh hưởng đến quá trình sinh sản.\n\n8. Bệnh viêm gan siêu vi B\nĐây cũng là một trong những bệnh có thể lây qua đường tình dục. Ngoài ra, viêm gan siêu vi B còn lây qua đường máu và lây từ mẹ sang con. Bệnh có thể không gây triệu chứng nào đáng kể nhưng lại đe dọa đến sức khỏe và tính mạng.\n\nDo đó, nếu thấy xuất hiện triệu chứng bất thường như: vàng da, vàng mắt, nước tiểu sẫm màu, sốt, mệt mỏi, buồn nôn, ăn uống không ngon miệng...bạn nên đi khám sớm để có hướng điều trị đúng cách.\n\n9. Bệnh Chlamydia\nBệnh gây ra bởi một loại vi khuẩn có tên là Chlamydia trachomatis. Bệnh diễn biến khá thầm lặng nên rất khó nhận biết. Nữ giới có thể phát hiện bệnh thông qua các triệu chứng như: khí hư ra nhiều bất thường, tiểu nhắt, đau bụng, đau lưng, buồn nôn, nôn, đau khi quan hệ, chảy máu sau quan hệ...\n\nBệnh Chlamydia nếu không chữa trị sớm có thể gây vô sinh ở nữ giới và nhiều biến chứng nguy hiểm khác.', '/public/images/img-1782997531747-780097016.jpg', 'bác sĩ Phan Huỳnh Hoàng Lâm', 1, 9, '2026-08-07 12:57:12.961136', '2026-08-07 12:57:12.968105');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor_profiles`
--

CREATE TABLE `doctor_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specialty_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_reviews` int(11) NOT NULL DEFAULT 0,
  `average_rating` decimal(3,1) NOT NULL DEFAULT 0.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_profiles`
--

INSERT INTO `doctor_profiles` (`id`, `user_id`, `specialty_id`, `full_name`, `avatar_url`, `experience_years`, `created_at`, `total_reviews`, `average_rating`) VALUES
(1, 4, 1, 'Bùi Cao Mỹ Ái', 'public/images/bs_caomyai.webp', 8, '2026-06-03 17:20:51', 1, 5.0),
(2, 5, 2, 'La Thiện Đức', 'public/images/lathienduc_thankinh.webp', 12, '2026-06-03 17:20:51', 2, 4.5),
(3, 6, 2, 'Phạm Nguyễn Thu Hằng', 'public/images/thuhang_thankinh.webp', 5, '2026-06-03 17:20:51', 0, 0.0),
(4, 7, 3, 'Trần Thị Lệ Uyên', 'public/images/tranthileuyen_sosinh.webp', 10, '2026-06-03 17:20:51', 0, 0.0),
(5, 10, 4, 'Phan Huỳnh Hoàng Lâm', 'public/images/img-1781844740627-818067183.jpg', 1, '2026-06-19 04:35:01', 7, 5.0),
(7, 12, 1, 'Trần Quốc Việt', '/uploads/default-doctor.png', 1, '2026-06-30 08:28:25', 0, 0.0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor_schedules`
--

CREATE TABLE `doctor_schedules` (
  `id` int(11) NOT NULL,
  `doctor_profile_id` int(11) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `max_patients` int(11) DEFAULT 5,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_schedules`
--

INSERT INTO `doctor_schedules` (`id`, `doctor_profile_id`, `shift_id`, `date`, `max_patients`, `created_at`) VALUES
(1, 1, 1, '2026-06-08', 3, '2026-06-05 17:35:53'),
(2, 1, 2, '2026-06-08', 3, '2026-06-05 17:35:53'),
(3, 1, 3, '2026-06-08', 3, '2026-06-05 17:35:53'),
(4, 1, 4, '2026-06-08', 3, '2026-06-05 17:35:53'),
(5, 2, 5, '2026-06-07', 4, '2026-06-05 17:35:53'),
(6, 2, 6, '2026-06-07', 4, '2026-06-05 17:35:53'),
(7, 2, 7, '2026-06-07', 4, '2026-06-05 17:35:53'),
(8, 2, 8, '2026-06-07', 4, '2026-06-05 17:35:53'),
(9, 3, 9, '2026-06-08', 3, '2026-06-05 17:35:53'),
(10, 3, 10, '2026-06-08', 3, '2026-06-05 17:35:53'),
(11, 3, 11, '2026-06-08', 3, '2026-06-05 17:35:53'),
(12, 3, 12, '2026-06-08', 3, '2026-06-05 17:35:53'),
(13, 4, 1, '2026-06-09', 4, '2026-06-05 17:35:53'),
(14, 4, 2, '2026-06-09', 4, '2026-06-05 17:35:53'),
(15, 4, 5, '2026-06-09', 4, '2026-06-05 17:35:53'),
(16, 4, 6, '2026-06-13', 4, '2026-06-05 17:35:53'),
(17, 1, 9, '2026-06-13', 3, '0000-00-00 00:00:00'),
(19, 2, 10, '2026-06-13', 3, '0000-00-00 00:00:00'),
(20, 1, 6, '2026-06-14', 3, '2026-06-13 14:04:16'),
(22, 1, 1, '2026-06-15', 5, '2026-06-19 11:43:09'),
(23, 5, 1, '2026-06-20', 5, '2026-06-19 17:30:45'),
(24, 5, 2, '2026-06-20', 5, '2026-06-19 17:30:45'),
(25, 5, 3, '2026-06-20', 5, '2026-06-19 17:30:45'),
(26, 5, 4, '2026-06-20', 5, '2026-06-19 17:30:45'),
(27, 1, 1, '2026-06-19', 5, '2026-06-19 17:35:41'),
(28, 1, 2, '2026-06-19', 5, '2026-06-19 17:35:41'),
(29, 1, 3, '2026-06-19', 5, '2026-06-19 17:35:41'),
(30, 1, 4, '2026-06-19', 5, '2026-06-19 17:35:41'),
(31, 1, 1, '2026-06-20', 4, '2026-06-20 02:48:09'),
(32, 1, 2, '2026-06-20', 4, '2026-06-20 02:48:09'),
(33, 1, 3, '2026-06-20', 4, '2026-06-20 02:48:09'),
(34, 1, 4, '2026-06-20', 4, '2026-06-20 02:48:09'),
(39, 5, 5, '2026-06-20', 5, '2026-06-20 07:12:01'),
(40, 5, 6, '2026-06-20', 5, '2026-06-20 07:12:01'),
(41, 5, 7, '2026-06-20', 5, '2026-06-20 07:12:01'),
(42, 5, 8, '2026-06-20', 5, '2026-06-20 07:12:01'),
(43, 1, 5, '2026-06-20', 5, '2026-06-20 08:23:29'),
(44, 1, 6, '2026-06-20', 5, '2026-06-20 08:23:29'),
(45, 1, 7, '2026-06-20', 5, '2026-06-20 08:23:29'),
(46, 1, 8, '2026-06-20', 5, '2026-06-20 08:23:29'),
(47, 5, 9, '2026-06-20', 5, '2026-06-20 09:30:41'),
(48, 5, 10, '2026-06-20', 5, '2026-06-20 09:30:41'),
(49, 5, 11, '2026-06-20', 5, '2026-06-20 09:30:41'),
(50, 5, 12, '2026-06-20', 5, '2026-06-20 09:30:41'),
(51, 5, 1, '2026-06-21', 5, '2026-06-20 09:50:20'),
(52, 5, 2, '2026-06-21', 5, '2026-06-20 09:50:20'),
(53, 5, 3, '2026-06-21', 5, '2026-06-20 09:50:20'),
(54, 5, 4, '2026-06-21', 5, '2026-06-20 09:50:20'),
(55, 5, 5, '2026-06-21', 5, '2026-06-21 08:28:40'),
(56, 5, 6, '2026-06-21', 5, '2026-06-21 08:28:40'),
(57, 5, 7, '2026-06-21', 5, '2026-06-21 08:28:40'),
(58, 5, 8, '2026-06-21', 5, '2026-06-21 08:28:40'),
(59, 5, 5, '2026-06-23', 5, '2026-06-23 06:37:13'),
(60, 5, 6, '2026-06-23', 5, '2026-06-23 06:37:13'),
(61, 5, 7, '2026-06-23', 5, '2026-06-23 06:37:13'),
(62, 5, 8, '2026-06-23', 5, '2026-06-23 06:37:13'),
(63, 5, 5, '2026-06-24', 5, '2026-06-24 09:12:17'),
(64, 5, 6, '2026-06-24', 5, '2026-06-24 09:12:17'),
(65, 5, 7, '2026-06-24', 5, '2026-06-24 09:12:17'),
(66, 5, 8, '2026-06-24', 5, '2026-06-24 09:12:17'),
(67, 5, 5, '2026-06-26', 5, '2026-06-26 06:52:45'),
(68, 5, 6, '2026-06-26', 5, '2026-06-26 06:52:45'),
(69, 5, 7, '2026-06-26', 5, '2026-06-26 06:52:45'),
(70, 5, 8, '2026-06-26', 5, '2026-06-26 06:52:45'),
(71, 5, 9, '2026-06-26', 5, '2026-06-26 06:52:49'),
(72, 5, 10, '2026-06-26', 5, '2026-06-26 06:52:49'),
(73, 5, 11, '2026-06-26', 5, '2026-06-26 06:52:49'),
(74, 5, 12, '2026-06-26', 5, '2026-06-26 06:52:49'),
(75, 5, 1, '2026-06-26', 5, '2026-06-26 06:52:52'),
(76, 5, 2, '2026-06-26', 5, '2026-06-26 06:52:52'),
(77, 5, 3, '2026-06-26', 5, '2026-06-26 06:52:52'),
(78, 5, 4, '2026-06-26', 5, '2026-06-26 06:52:52'),
(79, 1, 5, '2026-06-26', 5, '2026-06-26 07:27:52'),
(80, 1, 6, '2026-06-26', 5, '2026-06-26 07:27:52'),
(81, 1, 7, '2026-06-26', 5, '2026-06-26 07:27:52'),
(82, 1, 8, '2026-06-26', 5, '2026-06-26 07:27:52'),
(83, 2, 5, '2026-06-26', 5, '2026-06-26 10:43:38'),
(84, 2, 6, '2026-06-26', 5, '2026-06-26 10:43:38'),
(85, 2, 7, '2026-06-26', 5, '2026-06-26 10:43:38'),
(86, 2, 8, '2026-06-26', 5, '2026-06-26 10:43:38'),
(87, 5, 5, '2026-06-28', 5, '2026-06-28 08:13:03'),
(88, 5, 6, '2026-06-28', 5, '2026-06-28 08:13:03'),
(89, 5, 7, '2026-06-28', 5, '2026-06-28 08:13:03'),
(90, 5, 8, '2026-06-28', 5, '2026-06-28 08:13:03'),
(91, 5, 9, '2026-06-29', 5, '2026-06-29 07:21:56'),
(92, 5, 10, '2026-06-29', 5, '2026-06-29 07:21:56'),
(93, 5, 11, '2026-06-29', 5, '2026-06-29 07:21:56'),
(94, 5, 12, '2026-06-29', 5, '2026-06-29 07:21:56'),
(95, 5, 9, '2026-07-02', 5, '2026-07-02 13:27:18'),
(96, 5, 10, '2026-07-02', 5, '2026-07-02 13:27:18'),
(97, 5, 11, '2026-07-02', 5, '2026-07-02 13:27:18'),
(98, 5, 12, '2026-07-02', 5, '2026-07-02 13:27:18'),
(99, 1, 1, '2026-07-10', 20, '2026-07-10 10:21:01'),
(100, 1, 1, '2026-07-11', 20, '2026-07-10 10:21:01'),
(101, 5, 9, '2026-07-20', 5, '2026-07-20 10:39:48'),
(102, 5, 10, '2026-07-20', 5, '2026-07-20 10:39:48'),
(103, 5, 11, '2026-07-20', 5, '2026-07-20 10:39:48'),
(104, 5, 12, '2026-07-20', 5, '2026-07-20 10:39:48'),
(105, 5, 1, '2026-07-23', 5, '2026-07-23 01:42:55'),
(106, 5, 2, '2026-07-23', 5, '2026-07-23 01:42:55'),
(107, 5, 3, '2026-07-23', 5, '2026-07-23 01:42:55'),
(108, 5, 4, '2026-07-23', 5, '2026-07-23 01:42:55'),
(109, 5, 5, '2026-07-23', 5, '2026-07-23 01:42:59'),
(110, 5, 6, '2026-07-23', 5, '2026-07-23 01:42:59'),
(111, 5, 7, '2026-07-23', 5, '2026-07-23 01:42:59'),
(112, 5, 8, '2026-07-23', 5, '2026-07-23 01:42:59'),
(113, 5, 9, '2026-07-23', 5, '2026-07-23 01:43:02'),
(114, 5, 10, '2026-07-23', 5, '2026-07-23 01:43:02'),
(115, 5, 11, '2026-07-23', 5, '2026-07-23 01:43:02'),
(116, 5, 12, '2026-07-23', 5, '2026-07-23 01:43:02'),
(117, 5, 1, '2026-07-28', 5, '2026-07-28 15:03:21'),
(118, 5, 2, '2026-07-28', 5, '2026-07-28 15:03:21'),
(119, 5, 3, '2026-07-28', 5, '2026-07-28 15:03:21'),
(120, 5, 4, '2026-07-28', 5, '2026-07-28 15:03:21'),
(121, 5, 1, '2026-07-29', 5, '2026-07-29 04:10:56'),
(122, 5, 2, '2026-07-29', 5, '2026-07-29 04:10:56'),
(123, 5, 3, '2026-07-29', 5, '2026-07-29 04:10:56'),
(124, 5, 4, '2026-07-29', 5, '2026-07-29 04:10:56'),
(125, 5, 1, '2026-08-04', 5, '2026-08-03 16:39:01'),
(126, 5, 2, '2026-08-04', 5, '2026-08-03 16:39:01'),
(127, 5, 3, '2026-08-04', 5, '2026-08-03 16:39:01'),
(128, 5, 4, '2026-08-04', 5, '2026-08-03 16:39:01'),
(129, 2, 5, '2026-08-05', 5, '2026-08-05 07:05:38'),
(130, 2, 6, '2026-08-05', 5, '2026-08-05 07:05:38'),
(131, 2, 7, '2026-08-05', 5, '2026-08-05 07:05:38'),
(132, 2, 8, '2026-08-05', 5, '2026-08-05 07:05:38'),
(133, 5, 5, '2026-08-05', 5, '2026-08-05 07:09:14'),
(134, 5, 6, '2026-08-05', 5, '2026-08-05 07:09:14'),
(135, 5, 7, '2026-08-05', 5, '2026-08-05 07:09:14'),
(136, 5, 8, '2026-08-05', 5, '2026-08-05 07:09:14'),
(137, 2, 1, '2026-08-06', 5, '2026-08-06 02:11:34'),
(138, 2, 2, '2026-08-06', 5, '2026-08-06 02:11:34'),
(139, 2, 3, '2026-08-06', 5, '2026-08-06 02:11:34'),
(140, 2, 4, '2026-08-06', 5, '2026-08-06 02:11:34'),
(141, 5, 1, '2026-08-06', 5, '2026-08-06 02:11:39'),
(142, 5, 2, '2026-08-06', 5, '2026-08-06 02:11:39'),
(143, 5, 3, '2026-08-06', 5, '2026-08-06 02:11:39'),
(144, 5, 4, '2026-08-06', 5, '2026-08-06 02:11:39'),
(145, 1, 1, '2026-08-06', 5, '2026-08-06 02:11:46'),
(146, 1, 2, '2026-08-06', 5, '2026-08-06 02:11:46'),
(147, 1, 3, '2026-08-06', 5, '2026-08-06 02:11:46'),
(148, 1, 4, '2026-08-06', 5, '2026-08-06 02:11:46'),
(149, 5, 1, '2026-08-07', 5, '2026-08-06 02:12:30'),
(150, 5, 2, '2026-08-07', 5, '2026-08-06 02:12:30'),
(151, 5, 3, '2026-08-07', 5, '2026-08-06 02:12:30'),
(152, 5, 4, '2026-08-07', 5, '2026-08-06 02:12:30'),
(153, 5, 5, '2026-08-06', 5, '2026-08-06 04:20:00'),
(154, 5, 6, '2026-08-06', 5, '2026-08-06 04:20:00'),
(155, 5, 7, '2026-08-06', 5, '2026-08-06 04:20:00'),
(156, 5, 8, '2026-08-06', 5, '2026-08-06 04:20:00'),
(157, 1, 5, '2026-08-06', 5, '2026-08-06 04:39:26'),
(158, 1, 6, '2026-08-06', 5, '2026-08-06 04:39:26'),
(159, 1, 7, '2026-08-06', 5, '2026-08-06 04:39:26'),
(160, 1, 8, '2026-08-06', 5, '2026-08-06 04:39:26'),
(161, 3, 5, '2026-08-06', 5, '2026-08-06 04:42:06'),
(162, 3, 6, '2026-08-06', 5, '2026-08-06 04:42:06'),
(163, 3, 7, '2026-08-06', 5, '2026-08-06 04:42:06'),
(164, 3, 8, '2026-08-06', 5, '2026-08-06 04:42:06'),
(165, 2, 5, '2026-08-06', 5, '2026-08-06 04:43:36'),
(166, 2, 6, '2026-08-06', 5, '2026-08-06 04:43:36'),
(167, 2, 7, '2026-08-06', 5, '2026-08-06 04:43:36'),
(168, 2, 8, '2026-08-06', 5, '2026-08-06 04:43:36'),
(169, 2, 1, '2026-08-07', 5, '2026-08-07 03:14:08'),
(170, 2, 2, '2026-08-07', 5, '2026-08-07 03:14:08'),
(171, 2, 3, '2026-08-07', 5, '2026-08-07 03:14:08'),
(172, 2, 4, '2026-08-07', 5, '2026-08-07 03:14:08'),
(173, 2, 5, '2026-08-08', 5, '2026-08-08 05:16:51'),
(174, 2, 6, '2026-08-08', 5, '2026-08-08 05:16:51'),
(175, 2, 7, '2026-08-08', 5, '2026-08-08 05:16:51'),
(176, 2, 8, '2026-08-08', 5, '2026-08-08 05:16:51'),
(177, 2, 5, '2026-08-10', 5, '2026-08-10 08:00:01'),
(178, 2, 6, '2026-08-10', 5, '2026-08-10 08:00:01'),
(179, 2, 7, '2026-08-10', 5, '2026-08-10 08:00:01'),
(180, 2, 8, '2026-08-10', 5, '2026-08-10 08:00:01'),
(181, 5, 5, '2026-08-11', 5, '2026-08-11 07:56:02'),
(182, 5, 6, '2026-08-11', 5, '2026-08-11 07:56:02'),
(183, 5, 7, '2026-08-11', 5, '2026-08-11 07:56:02'),
(184, 5, 8, '2026-08-11', 5, '2026-08-11 07:56:02'),
(185, 1, 5, '2026-08-11', 5, '2026-08-11 07:56:25'),
(186, 1, 6, '2026-08-11', 5, '2026-08-11 07:56:25'),
(187, 1, 7, '2026-08-11', 5, '2026-08-11 07:56:25'),
(188, 1, 8, '2026-08-11', 5, '2026-08-11 07:56:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('UNPAID','PAID','CANCELLED') DEFAULT 'UNPAID',
  `payment_method` enum('VNPAY','CASH') DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`id`, `appointment_id`, `total_amount`, `status`, `payment_method`, `paid_at`, `created_at`) VALUES
(13, 13, 150000.00, 'PAID', 'CASH', '2026-06-13 13:55:56', '2026-06-13 13:54:46'),
(14, 14, 150000.00, 'PAID', 'CASH', '2026-06-13 14:30:54', '2026-06-13 14:05:06'),
(15, 15, 150000.00, 'PAID', 'CASH', '2026-06-19 17:39:51', '2026-06-13 14:29:43'),
(16, 16, 150000.00, 'PAID', 'CASH', '2026-06-19 17:40:08', '2026-06-18 17:48:21'),
(17, 17, 150000.00, 'PAID', 'CASH', '2026-06-19 17:43:10', '2026-06-19 17:37:11'),
(18, 18, 150000.00, 'UNPAID', 'CASH', NULL, '2026-06-19 18:34:58'),
(20, 20, 150000.00, 'PAID', 'CASH', '2026-06-20 08:41:18', '2026-06-20 08:23:58'),
(21, 21, 150000.00, 'PAID', 'VNPAY', '2026-06-20 08:27:18', '2026-06-20 08:27:18'),
(22, 22, 150000.00, 'PAID', 'CASH', '2026-06-20 08:54:22', '2026-06-20 08:50:41'),
(23, 23, 150000.00, 'PAID', 'VNPAY', '2026-06-20 08:55:49', '2026-06-20 08:55:49'),
(24, 24, 150000.00, 'PAID', 'CASH', '2026-06-20 08:58:24', '2026-06-20 08:56:01'),
(25, 25, 150000.00, 'PAID', 'VNPAY', '2026-06-20 09:15:34', '2026-06-20 09:15:34'),
(26, 26, 150000.00, 'PAID', 'VNPAY', '2026-06-20 09:19:59', '2026-06-20 09:16:26'),
(27, 27, 150000.00, 'PAID', 'VNPAY', '2026-06-20 09:29:51', '2026-06-20 09:27:21'),
(28, 28, 150000.00, 'PAID', 'VNPAY', '2026-06-20 09:27:34', '2026-06-20 09:27:34'),
(29, 29, 150000.00, 'PAID', 'CASH', '2026-06-20 09:52:52', '2026-06-20 09:50:55'),
(30, 30, 150000.00, 'PAID', 'CASH', '2026-06-24 09:15:01', '2026-06-21 08:29:01'),
(31, 31, 250000.00, 'PAID', 'VNPAY', '2026-06-26 06:37:16', '2026-06-23 06:37:43'),
(32, 32, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-06-23 07:12:34'),
(33, 33, 300000.00, 'PAID', 'VNPAY', '2026-06-26 06:20:55', '2026-06-23 07:32:26'),
(34, 34, 150000.00, 'PAID', 'CASH', '2026-06-26 06:52:14', '2026-06-24 09:12:32'),
(35, 35, 150000.00, 'PAID', 'VNPAY', '2026-06-26 07:10:19', '2026-06-26 07:10:19'),
(36, 36, 200000.00, 'PAID', 'CASH', '2026-06-26 10:26:49', '2026-06-26 07:17:51'),
(37, 37, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-06-26 07:18:11'),
(38, 38, 200000.00, 'PAID', 'CASH', '2026-06-26 10:26:53', '2026-06-26 07:20:05'),
(39, 39, 250000.00, 'PAID', 'CASH', '2026-06-26 08:41:00', '2026-06-26 07:21:12'),
(40, 40, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-06-26 10:27:21'),
(41, 41, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-06-26 16:00:10'),
(42, 42, 150000.00, 'PAID', 'CASH', '2026-06-28 08:32:41', '2026-06-28 08:16:25'),
(43, 43, 150000.00, 'PAID', 'CASH', '2026-06-29 07:47:34', '2026-06-28 08:17:31'),
(44, 44, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-06-28 08:27:50'),
(45, 45, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-06-28 09:10:11'),
(46, 46, 150000.00, 'CANCELLED', 'VNPAY', '2026-06-29 07:22:07', '2026-06-29 07:22:07'),
(47, 47, 150000.00, 'CANCELLED', 'VNPAY', NULL, '2026-06-29 07:26:30'),
(48, 48, 150000.00, 'CANCELLED', 'VNPAY', '2026-06-29 07:30:06', '2026-06-29 07:28:32'),
(49, 49, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-07-02 13:27:32'),
(50, 50, 150000.00, 'PAID', 'VNPAY', '2026-07-02 13:37:37', '2026-07-02 13:31:27'),
(51, 51, 150000.00, 'PAID', 'CASH', '2026-07-02 13:36:22', '2026-07-02 13:32:37'),
(52, 52, 150000.00, 'PAID', 'CASH', '2026-07-02 13:53:30', '2026-07-02 13:52:19'),
(53, 53, 150000.00, 'PAID', 'CASH', '2026-07-23 01:16:27', '2026-07-20 10:40:08'),
(54, 54, 150000.00, 'PAID', 'VNPAY', '2026-07-23 01:49:01', '2026-07-23 01:48:10'),
(55, 55, 250000.00, 'PAID', 'VNPAY', '2026-07-29 04:15:41', '2026-07-29 04:11:14'),
(56, 56, 150000.00, 'PAID', 'CASH', '2026-08-05 07:12:29', '2026-08-05 07:05:59'),
(57, 57, 250000.00, 'PAID', 'CASH', '2026-08-05 07:12:00', '2026-08-05 07:07:08'),
(58, 58, 150000.00, 'PAID', 'VNPAY', '2026-08-05 07:17:11', '2026-08-05 07:09:51'),
(59, 59, 150000.00, 'PAID', 'VNPAY', '2026-08-05 07:27:31', '2026-08-05 07:25:11'),
(60, 60, 150000.00, 'PAID', 'CASH', '2026-08-06 02:17:20', '2026-08-06 02:14:24'),
(61, 61, 150000.00, 'PAID', 'CASH', '2026-08-06 03:19:21', '2026-08-06 02:58:00'),
(62, 62, 150000.00, 'CANCELLED', 'CASH', '2026-08-06 03:05:34', '2026-08-06 03:04:57'),
(63, 63, 150000.00, 'PAID', 'CASH', '2026-08-06 03:19:05', '2026-08-06 03:18:50'),
(64, 64, 150000.00, 'PAID', 'VNPAY', '2026-08-06 03:20:56', '2026-08-06 03:19:50'),
(65, 65, 150000.00, 'PAID', 'CASH', '2026-08-06 03:31:55', '2026-08-06 03:22:51'),
(66, 66, 300000.00, 'PAID', 'CASH', '2026-08-06 03:34:15', '2026-08-06 03:33:09'),
(67, 67, 150000.00, 'CANCELLED', 'VNPAY', '2026-08-06 03:52:34', '2026-08-06 03:51:53'),
(68, 68, 300000.00, 'PAID', 'CASH', '2026-08-08 05:20:20', '2026-08-06 04:18:44'),
(69, 69, 300000.00, 'PAID', 'CASH', '2026-08-08 05:20:16', '2026-08-06 04:20:18'),
(70, 70, 150000.00, 'CANCELLED', 'CASH', NULL, '2026-08-06 04:45:05'),
(71, 71, 250000.00, 'PAID', 'CASH', '2026-08-08 05:20:12', '2026-08-07 03:16:14'),
(72, 72, 250000.00, 'PAID', 'CASH', '2026-08-08 05:20:33', '2026-08-08 05:17:03'),
(73, 73, 150000.00, 'PAID', 'VNPAY', '2026-08-08 05:22:22', '2026-08-08 05:21:34'),
(74, 74, 300000.00, 'UNPAID', 'CASH', '2026-08-10 08:00:45', '2026-08-10 08:00:20'),
(75, 75, 150000.00, 'UNPAID', 'VNPAY', NULL, '2026-08-10 08:02:06'),
(76, 76, 150000.00, 'PAID', 'VNPAY', '2026-08-10 08:03:07', '2026-08-10 08:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `symptoms` text NOT NULL,
  `diagnosis` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `medical_records`
--

INSERT INTO `medical_records` (`id`, `appointment_id`, `symptoms`, `diagnosis`, `notes`, `created_at`) VALUES
(2, 13, 'abc', 'abc', 'abc', '2026-06-13 13:55:35'),
(3, 14, 'abcd', 'abcd', 'abcd', '2026-06-13 14:30:26'),
(4, 15, 'HT-APPT-20260613-43DC689E', 'HT-APPT-20260613-43DC689E', 'HT-APPT-20260613-43DC689E', '2026-06-13 14:31:08'),
(6, 17, 'đau khớp tay', 'thiếu chất x', 'Ăn nhiều rau', '2026-06-20 07:00:04'),
(7, 20, 'ádasd', 'ádasdas', 'ádasdsa', '2026-06-20 08:25:11'),
(8, 21, 'feef', 'dfsfd', 'sdfsdf', '2026-06-20 08:28:07'),
(9, 22, 'sád', 'ádasdasd', 'ádasdsad', '2026-06-20 08:51:06'),
(10, 23, 'dfadfa', 'sdasdas', 'dsadasd', '2026-06-20 08:57:32'),
(11, 24, 'đấc', 'sadasd', 'sadasdsa', '2026-06-20 08:58:00'),
(12, 25, 'ewqeqwe', 'ưqeqwe', 'ưqeqwe', '2026-06-20 09:18:05'),
(13, 26, 'Gãy tay', 'Gãy tay', 'Gãy tay, bó bột', '2026-06-20 09:19:38'),
(14, 28, 'chấn thương cổ chân', 'chấn thương cổ chân', 'chấn thương cổ chân', '2026-06-20 09:29:12'),
(15, 27, 'chấn thương cổ chân', 'chấn thương cổ chân', 'chấn thương cổ chân', '2026-06-20 09:29:23'),
(16, 29, 'gãy tay', 'gãy tay', 'gãy tay', '2026-06-20 09:52:25'),
(17, 30, 'abc', 'abc', 'abc', '2026-06-21 08:30:48'),
(18, 31, 'Đau đầu', 'Mất ngủ, dẫn đến thiếu máu', '- 6 viên Panadol\n- ăn nhiều rau', '2026-06-24 08:27:56'),
(19, 33, 'ngáo ngáo', 'Dương tính maithuy', 'Có dương tính mai thúy, làm thủ tục điều trị', '2026-06-24 08:37:14'),
(20, 34, 'èqrqe', 'aefa', 'àdfad', '2026-06-26 06:52:03'),
(21, 39, 'đau đầu kéo dài', 'đau đầu kéo dài, mất ngủ, do stress công việc', 'Tạm nghỉ phép 1 tuần nghỉ ngơi', '2026-06-26 08:13:51'),
(22, 35, 'gãy tay(đã băng bó)', 'gãy tay(đã băng bó)', 'bug logic - thanh toán trước ko kê thêm được dịch vụ', '2026-06-26 08:42:43'),
(23, 36, 'gãy tay ', 'gãy tay ', 'gãy tay ', '2026-06-26 08:42:58'),
(24, 38, 'gãy tay ', 'gãy tay ', 'gãy tay ', '2026-06-26 08:43:12'),
(25, 42, 'sadasd', 'ádasd', 'ádasdsa', '2026-06-28 08:32:20'),
(26, 43, 'sadasd', 'sadas', 'ádasd', '2026-06-28 08:49:03'),
(27, 50, 'adasdas', 'dsadsads', 'ádsda', '2026-07-02 13:36:03'),
(28, 51, 'ádasd', 'sadad', 'ádsada', '2026-07-02 13:36:11'),
(29, 52, 'dầ', 'âsd', 'ádasd', '2026-07-02 13:53:13'),
(30, 53, 'addfas', 'sdads', 'asdasd', '2026-07-23 01:14:53'),
(31, 54, 'Đau đầu', 'Thiểu ngủ, dẫn đến đau đầu', 'alo 123', '2026-07-23 01:50:32'),
(32, 55, 'đau đầu', 'đau đầu', 'đau đầu, nghỉ ngơi vài ngày', '2026-07-29 04:14:43'),
(33, 57, 'Đau đầu', 'Đau đầu', 'Đau đầu', '2026-08-05 07:11:36'),
(34, 56, 'ádasd', 'sdasd', 'ádasd', '2026-08-05 07:12:14'),
(35, 58, 'fasf', 'ầdafdaf', 'adfafd', '2026-08-05 07:13:17'),
(36, 59, 'ádasd', 'sdasd', 'ádasdas', '2026-08-05 08:32:22'),
(37, 60, 'wrqwew', 'asdsadsa', 'asdasdsa', '2026-08-06 02:17:08'),
(38, 61, 'ádsad', 'ádsad', 'sadsad', '2026-08-06 02:58:36'),
(39, 63, 'KHỚP VAI BỊ ĐAU', 'VIÊM GÂN VAI', 'NGHỈ NGƠI KO CHƠI THỂ THAO 2 TUẦN', '2026-08-06 03:31:13'),
(40, 64, 'DẤ', 'SDASD', 'SADAS', '2026-08-06 03:32:49'),
(41, 65, 'ÁDASD', 'ÁDASD', 'SADASD', '2026-08-06 03:32:53'),
(42, 66, 'TEST', 'TEST', 'TEST', '2026-08-06 03:33:42'),
(43, 68, 'ĐAU ĐẦU', 'ĐAU ĐẦU', '', '2026-08-06 04:25:56'),
(44, 69, 'dassad', 'asdsad', 'aadsd', '2026-08-07 03:11:49'),
(45, 71, 'đau đầu', 'đau đầu', 'đau đầu', '2026-08-07 03:23:14'),
(46, 72, 'THIẾU NGỦ ', 'THIẾU NGỦ ', 'THIẾU NGỦ ', '2026-08-08 05:18:11'),
(47, 73, 'ĐÂF', 'ẦDAS', 'ÁDAD', '2026-08-08 05:24:10'),
(48, 74, '', '', '', '2026-08-10 08:30:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `patient_account_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `patient_account_id` int(11) DEFAULT NULL,
  `relationship` varchar(50) DEFAULT 'Bản thân',
  `cccd` varchar(20) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_completed` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `patients`
--

INSERT INTO `patients` (`id`, `patient_account_id`, `relationship`, `cccd`, `full_name`, `dob`, `gender`, `phone`, `address`, `created_at`, `is_completed`) VALUES
(2, 1, 'Bản thân', '012345678901', 'Hoàng Lâm', '1995-10-20', 'MALE', '0987654321', '333 ấp 10, xã Rạch Kiến, Tây Ninh', '2026-06-05 09:15:10', 0),
(4, 4, 'Bản thân', '020202020202', 'Nguyễn Văn Lâm', '2007-11-13', 'MALE', '0797551612', '333 ấp 10, Rạch Kiến, Tây Ninh', '2026-06-13 14:29:26', 1),
(6, 4, 'Khác', '123456789012', 'Lâm 2', '2008-06-24', 'MALE', '0346123711', '333 ấp 10, Rạch Kiến, Tây Ninh', '2026-06-19 18:34:40', 1),
(7, 5, 'Bản thân', '012345678912', 'Hoàng Lâm', '1995-01-01', 'MALE', '0333897665', 'adasda', '2026-06-20 02:48:44', 1),
(9, NULL, 'Bản thân', NULL, 'Phan Lâm', '1995-01-01', 'MALE', NULL, NULL, '2026-06-21 17:07:05', 0),
(10, 7, 'Bản thân', '123456789017', 'Phan Phan', '1995-01-01', 'MALE', '0348654515', 'ấp 10 Long Khê', '2026-06-21 17:13:39', 1),
(11, NULL, 'Bản thân', NULL, 'kam kam', '1995-01-01', 'MALE', NULL, NULL, '2026-06-21 17:25:58', 0),
(12, 18, 'Bản thân', '123456789100', 'Lemlem', '1995-01-01', 'MALE', '0333123671', '3123, Ấp 3, Rạch Kiến, Long An', '2026-06-23 06:31:31', 1),
(13, 18, 'Con cái', '1234567890', 'Nguyễn Văn Cu', '2024-01-30', 'MALE', '0797551612', '3c, 3/2, phường Vườn Lài, TP.HCM', '2026-06-23 07:03:09', 1),
(14, 7, 'Khác', '030303030301', 'Phạm Thu Phương', '2003-05-24', 'FEMALE', '0797551612', 'Củ Chi, TP.HCM', '2026-06-26 07:19:58', 1),
(15, NULL, 'Bản thân', '030104050412', 'Tâm Đoan', '2005-06-14', 'FEMALE', '0343472411', '', '2026-06-26 15:43:43', 0),
(18, NULL, 'Bản thân', NULL, 'Tâm Đoan', '2015-02-10', 'MALE', '020301040201', '', '2026-06-26 16:00:10', 0),
(19, 4, 'Bản thân', '010101020402', 'Phà Phà', '2003-06-17', 'MALE', '0378176752', '333 ấp 10, xã Rạch Kiến, tỉnh Tây Ninh', '2026-06-29 09:09:47', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `patient_accounts`
--

CREATE TABLE `patient_accounts` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `patient_accounts`
--

INSERT INTO `patient_accounts` (`id`, `phone`, `password_hash`, `is_active`, `created_at`, `email`, `otp_code`) VALUES
(1, '0901234567', '$2b$10$wO3.Vj.8x1...dummyhash123456789', 1, '2026-06-05 09:40:27', NULL, NULL),
(2, '0987654321', '$2b$10$xP4.Wk.9y2...dummyhash987654321', 1, '2026-06-05 09:40:27', NULL, NULL),
(3, '0911222333', '$2b$10$yQ5.Zl.0z3...dummyhash112233445', 0, '2026-06-05 09:40:27', NULL, NULL),
(4, '0797551612', '$2b$10$H3ceY54PXcGuctnH9220SOhNDOOsx87rhk98aaQXft.rPjz9kDAjG', 1, '2026-06-05 09:40:27', 'lamphan3107@gmail.com', NULL),
(5, '0333897665', '1', 1, '2026-06-20 02:48:44', NULL, NULL),
(7, '', '12345678', 1, '2026-06-21 17:13:39', 'lamtric23@gmail.com', '268542'),
(18, NULL, 'Hoanglam23', 1, '2026-06-23 06:31:31', 'xuantung10042008hn@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `doctor_profile_id` int(11) NOT NULL,
  `patient_account_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ratings`
--

INSERT INTO `ratings` (`id`, `appointment_id`, `doctor_profile_id`, `patient_account_id`, `rating`, `comment`, `created_at`) VALUES
(1, 42, 5, 4, 5, '', '2026-08-07 12:57:12.922071'),
(2, 43, 5, 4, 5, '', '2026-08-07 12:57:12.922071'),
(3, 36, 5, 4, 5, '', '2026-08-07 12:57:12.922071'),
(4, 34, 5, 4, 5, '', '2026-08-07 12:57:12.922071'),
(5, 30, 5, 4, 5, '', '2026-08-07 12:57:12.922071'),
(6, 20, 1, 4, 5, '', '2026-08-07 12:57:12.922071'),
(7, 51, 5, 4, 5, 'OK ', '2026-08-07 12:57:12.922071'),
(8, 60, 5, 4, 5, 'bác sĩ Lâm đẹp trai quá', '2026-08-07 12:57:12.922071'),
(9, 71, 2, 4, 5, 'ok', '2026-08-07 12:57:12.922071'),
(10, 72, 2, 4, 4, 'TUY HƠI LÂU NHƯNG BÁC SĨ CÓ TÂM', '2026-08-08 12:23:56.328581');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `is_active`, `created_at`) VALUES
(1, 'Siêu âm', 'Siêu âm bụng', 200000.00, 1, '0000-00-00 00:00:00'),
(2, 'Xét nghiệm máu', 'Xét nghiệm máu', 150000.00, 1, '0000-00-00 00:00:00'),
(3, 'Truyền dịch', 'Truyền dịch', 100000.00, 1, '0000-00-00 00:00:00'),
(4, 'Thay băng vết thương', 'Thay băng vết thương', 50000.00, 1, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `shifts`
--

INSERT INTO `shifts` (`id`, `name`, `start_time`, `end_time`) VALUES
(1, 'Ca Sáng 1', '08:00:00', '09:00:00'),
(2, 'Ca Sáng 2', '09:00:00', '10:00:00'),
(3, 'Ca Sáng 3', '10:00:00', '11:00:00'),
(4, 'Ca Sáng 4', '11:00:00', '12:00:00'),
(5, 'Ca Chiều 1', '13:00:00', '14:00:00'),
(6, 'Ca Chiều 2', '14:00:00', '15:00:00'),
(7, 'Ca Chiều 3', '15:00:00', '16:00:00'),
(8, 'Ca Chiều 4', '16:00:00', '17:00:00'),
(9, 'Ca Tối 1', '17:00:00', '18:00:00'),
(10, 'Ca Tối 2', '18:00:00', '19:00:00'),
(11, 'Ca Tối 3', '19:00:00', '20:00:00'),
(12, 'Ca Tối 4', '20:00:00', '21:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `specialties`
--

CREATE TABLE `specialties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `specialties`
--

INSERT INTO `specialties` (`id`, `name`, `icon`, `description`, `created_at`) VALUES
(1, 'Tim mạch', 'Heart', 'Chuyên khám, chẩn đoán và điều trị các bệnh lý liên quan đến tim và mạch máu như cao huyết áp, suy tim, rối loạn nhịp tim.', '2026-06-02 05:06:24'),
(2, 'Thần kinh', 'Brain', 'Chuyên khám và điều trị các bệnh lý về hệ thần kinh trung ương và ngoại biên, bao gồm đau đầu, mất ngủ, rối loạn tiền đình.', '2026-06-02 05:06:24'),
(3, 'Nhi khoa', 'Baby', 'Chăm sóc sức khỏe toàn diện, chẩn đoán và điều trị bệnh cho trẻ sơ sinh, trẻ nhỏ và trẻ vị thành niên.', '2026-06-02 05:06:24'),
(4, 'Cơ xương khớp', 'Bone', 'Chuyên điều trị các chấn thương và bệnh lý liên quan đến hệ thống cơ, xương, khớp, dây chằng và sụn.', '2026-06-02 05:06:24'),
(5, 'Nha khoa', 'Activity', 'Khám, tư vấn và điều trị các vấn đề về răng miệng, hàm mặt, nha khoa thẩm mỹ và phục hình răng.', '2026-06-02 05:06:24'),
(6, 'Da liễu', 'Sparkles', 'Chuyên khám và điều trị các bệnh lý về da, lông, tóc, móng và các bệnh lây truyền qua đường tình dục.', '2026-06-02 05:06:24'),
(7, 'Nội tổng hợp', 'Activity', 'Khoa Nội tổng hợp là khoa lâm sàng nền tảng tiếp nhận thăm khám và điều trị đa dạng các bệnh lý bên trong cơ thể (chưa cần can thiệp phẫu thuật). Khoa phụ trách các chuyên khoa như tim mạch, hô hấp, tiêu hóa, nội tiết, thận niệu, thần kinh và cơ xương khớp.', '2026-06-30 08:34:58');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','DOCTOR','STAFF') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `phone`, `password_hash`, `role`, `is_active`, `created_at`, `email`) VALUES
(4, '044444444444', '1', 'DOCTOR', 1, '2026-06-05 16:40:33', 'lamtric23@gmail.com'),
(5, '005', '$2b$10$7dpqzwsNw9U2rmK7Y/vaxueBByBYj7u95msHGK.PH1QaG8bIHAfoO', 'DOCTOR', 1, '2026-06-05 16:40:33', 'lamphan.holagroup@gmail.com'),
(6, '006', '1', 'DOCTOR', 1, '2026-06-05 16:40:33', NULL),
(7, '007', '1', 'DOCTOR', 1, '2026-06-05 16:40:33', NULL),
(8, '008', '1', 'STAFF', 1, '2026-06-05 16:40:33', 'lt@gmail.com'),
(9, '001', '1', 'ADMIN', 1, '0000-00-00 00:00:00', 'admin@gmail.com'),
(10, '033', '1', 'DOCTOR', 1, '2026-06-19 04:35:01', 'lamphan3107@gmail.com'),
(12, '0343472411', 'Hoanglam23@', 'DOCTOR', 0, '2026-06-30 08:28:25', 'vietnix@gmail.com');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qr_code` (`qr_code`),
  ADD UNIQUE KEY `IDX_8c40b753641657af2d3986c95d` (`qr_code`),
  ADD KEY `doctor_profile_id` (`doctor_profile_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Chỉ mục cho bảng `appointment_services`
--
ALTER TABLE `appointment_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Chỉ mục cho bảng `appointment_status_logs`
--
ALTER TABLE `appointment_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `changed_by` (`changed_by`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Chỉ mục cho bảng `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_87bb15395540ae06337a486a77a` (`user_id`);

--
-- Chỉ mục cho bảng `doctor_profiles`
--
ALTER TABLE `doctor_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `IDX_69995f9059305ab7a9c52cdb10` (`user_id`),
  ADD UNIQUE KEY `REL_69995f9059305ab7a9c52cdb10` (`user_id`),
  ADD KEY `specialty_id` (`specialty_id`);

--
-- Chỉ mục cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shift_id` (`shift_id`),
  ADD KEY `doctor_profile_id` (`doctor_profile_id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`),
  ADD UNIQUE KEY `IDX_70757267b44d3b26bd88966908` (`appointment_id`),
  ADD UNIQUE KEY `REL_70757267b44d3b26bd88966908` (`appointment_id`);

--
-- Chỉ mục cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`),
  ADD UNIQUE KEY `IDX_4185307f688fcdf88d700b2363` (`appointment_id`),
  ADD UNIQUE KEY `REL_4185307f688fcdf88d700b2363` (`appointment_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_account_id` (`patient_account_id`);

--
-- Chỉ mục cho bảng `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cccd` (`cccd`),
  ADD UNIQUE KEY `IDX_0618d0ba3f51af24ecf6822639` (`cccd`),
  ADD KEY `patient_account_id` (`patient_account_id`);

--
-- Chỉ mục cho bảng `patient_accounts`
--
ALTER TABLE `patient_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `IDX_424a501d6da00e20d793503c93` (`email`),
  ADD UNIQUE KEY `IDX_3370ee2e1597cf2c550d7c0f36` (`phone`);

--
-- Chỉ mục cho bảng `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_ratings_appointment_id` (`appointment_id`),
  ADD UNIQUE KEY `REL_6236e5807011bf0e40a9ea0157` (`appointment_id`),
  ADD KEY `idx_ratings_doctor_id` (`doctor_profile_id`),
  ADD KEY `idx_ratings_patient_id` (`patient_account_id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `specialties`
--
ALTER TABLE `specialties`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `IDX_a000cca60bcf04454e72769949` (`phone`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT cho bảng `appointment_services`
--
ALTER TABLE `appointment_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `appointment_status_logs`
--
ALTER TABLE `appointment_status_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT cho bảng `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `doctor_profiles`
--
ALTER TABLE `doctor_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `patient_accounts`
--
ALTER TABLE `patient_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `specialties`
--
ALTER TABLE `specialties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `FK_3330f054416745deaa2cc130700` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_c27adf23b654911e08f2337946c` FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `appointment_services`
--
ALTER TABLE `appointment_services`
  ADD CONSTRAINT `FK_5aafcd787c270f1fd2e01376a6b` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  ADD CONSTRAINT `FK_923e323e598280a0454e1d1b7cf` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `appointment_status_logs`
--
ALTER TABLE `appointment_status_logs`
  ADD CONSTRAINT `FK_0d90d5d48a8146c3b16afdfe26b` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_6aeebd27238d33b54280fd31a84` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `FK_87bb15395540ae06337a486a77a` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `doctor_profiles`
--
ALTER TABLE `doctor_profiles`
  ADD CONSTRAINT `FK_69995f9059305ab7a9c52cdb10e` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8f630bc78a6a1e320684c5ae252` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`);

--
-- Các ràng buộc cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `FK_a89dcf0d53d7bff97ed1747c80f` FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_d012f9548969ef3ebb767cdce92` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`);

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `FK_70757267b44d3b26bd88966908b` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `FK_4185307f688fcdf88d700b23631` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_e1d2142b8118b05539d0703a558` FOREIGN KEY (`patient_account_id`) REFERENCES `patient_accounts` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `FK_351bf6899fcb41f4254ee01e087` FOREIGN KEY (`patient_account_id`) REFERENCES `patient_accounts` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `FK_6236e5807011bf0e40a9ea0157f` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_b2aa709ba7b36ea59045aa55aa4` FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_cae26d8d5e2cbb131c8bfc26270` FOREIGN KEY (`patient_account_id`) REFERENCES `patient_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
