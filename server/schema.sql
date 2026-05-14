CREATE DATABASE IF NOT EXISTS ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ipnu_ippnu;

CREATE TABLE IF NOT EXISTS member_registrations (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  organization VARCHAR(255) NOT NULL,
  education VARCHAR(255),
  school VARCHAR(255),
  motivation TEXT,
  agree_terms BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_member_registrations_status ON member_registrations (status);
CREATE INDEX idx_member_registrations_submitted_at ON member_registrations (submitted_at DESC);
