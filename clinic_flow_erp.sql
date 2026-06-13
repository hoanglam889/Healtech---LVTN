-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 13, 2026 lúc 04:32 PM
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
  `status` enum('BOOKED','WAITING','EXAMINING','DONE','CANCELLED') DEFAULT 'BOOKED',
  `priority_score` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `appointments`
--

INSERT INTO `appointments` (`id`, `qr_code`, `patient_id`, `doctor_profile_id`, `appointment_date`, `appointment_time`, `status`, `priority_score`, `created_at`) VALUES
(13, 'HT-APPT-20260613-0B5397A6', 2, 1, '2026-06-13', '17:00:00', 'DONE', 4, '2026-06-13 13:54:46'),
(14, 'HT-APPT-20260613-ED7E14EB', 2, 1, '2026-06-14', '14:00:00', 'DONE', 6, '2026-06-13 14:05:06'),
(15, 'HT-APPT-20260613-43DC689E', 4, 1, '2026-06-14', '14:00:00', 'DONE', 6, '2026-06-13 14:29:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointment_status_logs`
--

CREATE TABLE `appointment_status_logs` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `old_status` enum('BOOKED','WAITING','EXAMINING','DONE','CANCELLED') DEFAULT NULL,
  `new_status` enum('BOOKED','WAITING','EXAMINING','DONE','CANCELLED') NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_profiles`
--

INSERT INTO `doctor_profiles` (`id`, `user_id`, `specialty_id`, `full_name`, `avatar_url`, `experience_years`, `created_at`) VALUES
(1, 4, 1, 'Bùi Cao Mỹ Ái', 'public/images/bs_caomyai.webp', 8, '2026-06-03 17:20:51'),
(2, 5, 2, 'La Thiện Đức', 'public/images/lathienduc_thankinh.webp', 12, '2026-06-03 17:20:51'),
(3, 6, 2, 'Phạm Nguyễn Thu Hằng', 'public/images/thuhang_thankinh.webp', 5, '2026-06-03 17:20:51'),
(4, 7, 3, 'Trần Thị Lệ Uyên', 'public/images/tranthileuyen_sosinh.webp', 10, '2026-06-03 17:20:51');

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
(20, 1, 6, '2026-06-14', 3, '2026-06-13 14:04:16');

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
(15, 15, 150000.00, 'UNPAID', 'CASH', NULL, '2026-06-13 14:29:43');

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
(4, 15, 'HT-APPT-20260613-43DC689E', 'HT-APPT-20260613-43DC689E', 'HT-APPT-20260613-43DC689E', '2026-06-13 14:31:08');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `patients`
--

INSERT INTO `patients` (`id`, `patient_account_id`, `relationship`, `cccd`, `full_name`, `dob`, `gender`, `phone`, `address`, `created_at`) VALUES
(2, 1, 'Bản thân', '012345678901', 'Hoàng Lâm', '1995-10-20', 'MALE', '0987654321', '333 ấp 10, xã Rạch Kiến, Tây Ninh', '2026-06-05 09:15:10'),
(3, NULL, 'Vợ/Chồng', NULL, 'Phạm Thu Hà', '2003-12-21', 'FEMALE', '0797551612', NULL, '2026-06-12 17:08:21'),
(4, 4, 'Bản thân', NULL, 'Nguyễn Văn Lâm', '2007-11-13', 'MALE', '0797551612', '333 ấp 10, Rạch Kiến, Tây Ninh', '2026-06-13 14:29:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `patient_accounts`
--

CREATE TABLE `patient_accounts` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `patient_accounts`
--

INSERT INTO `patient_accounts` (`id`, `phone`, `password_hash`, `is_active`, `created_at`) VALUES
(1, '0901234567', '$2b$10$wO3.Vj.8x1...dummyhash123456789', 1, '2026-06-05 09:40:27'),
(2, '0987654321', '$2b$10$xP4.Wk.9y2...dummyhash987654321', 1, '2026-06-05 09:40:27'),
(3, '0911222333', '$2b$10$yQ5.Zl.0z3...dummyhash112233445', 0, '2026-06-05 09:40:27'),
(4, '0797551612', '1', 0, '2026-06-05 09:40:27');

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
(6, 'Da liễu', 'Sparkles', 'Chuyên khám và điều trị các bệnh lý về da, lông, tóc, móng và các bệnh lây truyền qua đường tình dục.', '2026-06-02 05:06:24');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `phone`, `password_hash`, `role`, `is_active`, `created_at`) VALUES
(4, '004', '1', 'DOCTOR', 1, '2026-06-05 16:40:33'),
(5, '005', '1', 'DOCTOR', 1, '2026-06-05 16:40:33'),
(6, '006', '1', 'DOCTOR', 1, '2026-06-05 16:40:33'),
(7, '007', '1', 'DOCTOR', 1, '2026-06-05 16:40:33'),
(8, '008', '1', 'STAFF', 1, '2026-06-05 16:40:33');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qr_code` (`qr_code`),
  ADD KEY `fk_appointments_patient` (`patient_id`),
  ADD KEY `fk_appointments_doctor_profile` (`doctor_profile_id`);

--
-- Chỉ mục cho bảng `appointment_status_logs`
--
ALTER TABLE `appointment_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_status_logs_appointment` (`appointment_id`),
  ADD KEY `fk_status_logs_user` (`changed_by`);

--
-- Chỉ mục cho bảng `doctor_profiles`
--
ALTER TABLE `doctor_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `fk_doctor_profiles_specialty` (`specialty_id`);

--
-- Chỉ mục cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_doctor_schedules_doctor` (`doctor_profile_id`),
  ADD KEY `fk_doctor_schedules_shift` (`shift_id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`);

--
-- Chỉ mục cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notifications_patient_account` (`patient_account_id`);

--
-- Chỉ mục cho bảng `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cccd` (`cccd`),
  ADD KEY `fk_patients_patient_account` (`patient_account_id`);

--
-- Chỉ mục cho bảng `patient_accounts`
--
ALTER TABLE `patient_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

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
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `appointment_status_logs`
--
ALTER TABLE `appointment_status_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `doctor_profiles`
--
ALTER TABLE `doctor_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `patient_accounts`
--
ALTER TABLE `patient_accounts`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointments_doctor_profile` FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_appointments_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `appointment_status_logs`
--
ALTER TABLE `appointment_status_logs`
  ADD CONSTRAINT `fk_status_logs_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_status_logs_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `doctor_profiles`
--
ALTER TABLE `doctor_profiles`
  ADD CONSTRAINT `fk_doctor_profiles_specialty` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`),
  ADD CONSTRAINT `fk_doctor_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `fk_doctor_schedules_doctor` FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_doctor_schedules_shift` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`);

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_invoices_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `fk_medical_records_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_patient_account` FOREIGN KEY (`patient_account_id`) REFERENCES `patient_accounts` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `fk_patients_patient_account` FOREIGN KEY (`patient_account_id`) REFERENCES `patient_accounts` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
