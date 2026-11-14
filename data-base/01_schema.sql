CREATE DATABASE IF NOT EXISTS lumina;

USE lumina;

CREATE TABLE IF NOT EXISTS `role` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80),
  description VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS `app_user` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(150),
  password_hash VARCHAR(255),
  role_id BIGINT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (role_id) REFERENCES `role` (id)
);

CREATE TABLE IF NOT EXISTS `order_status` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80),
  description VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS `product_category` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80),
  slug VARCHAR(100),
  description VARCHAR(255),
  category_type VARCHAR(30),
  active BOOLEAN
);

CREATE TABLE IF NOT EXISTS `product` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  slug VARCHAR(140),
  image_url VARCHAR(500),
  product_category_id BIGINT,
  scent VARCHAR(120),
  weight_grams INT,
  color VARCHAR(120),
  description TEXT,
  price DECIMAL(12, 2),
  stock INT,
  available BOOLEAN,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (product_category_id) REFERENCES `product_category` (id)
);

CREATE TABLE IF NOT EXISTS `favorite` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  app_user_id BIGINT,
  product_id BIGINT,
  created_at DATETIME,
  FOREIGN KEY (app_user_id) REFERENCES `app_user` (id),
  FOREIGN KEY (product_id) REFERENCES `product` (id)
);

CREATE TABLE IF NOT EXISTS `coupon` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40),
  description VARCHAR(255),
  discount_type VARCHAR(30),
  discount_value DECIMAL(12, 2),
  valid_from DATETIME,
  valid_until DATETIME,
  usage_limit INT,
  usage_count INT,
  active BOOLEAN
);

CREATE TABLE IF NOT EXISTS `custom_candle` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  app_user_id BIGINT,
  intention VARCHAR(80),
  scent VARCHAR(120),
  design_color VARCHAR(120),
  message VARCHAR(255),
  preview_image_url VARCHAR(500),
  price DECIMAL(12, 2),
  created_at DATETIME,
  FOREIGN KEY (app_user_id) REFERENCES `app_user` (id)
);

CREATE TABLE IF NOT EXISTS `cart` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  app_user_id BIGINT,
  session_token VARCHAR(120),
  status VARCHAR(30),
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (app_user_id) REFERENCES `app_user` (id)
);

CREATE TABLE IF NOT EXISTS `cart_item` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT,
  product_id BIGINT,
  custom_candle_id BIGINT NULL,
  quantity INT,
  unit_price DECIMAL(12, 2),
  created_at DATETIME,
  FOREIGN KEY (cart_id) REFERENCES `cart` (id),
  FOREIGN KEY (product_id) REFERENCES `product` (id),
  FOREIGN KEY (custom_candle_id) REFERENCES `custom_candle` (id)
);

CREATE TABLE IF NOT EXISTS `user_order` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(30),
  app_user_id BIGINT,
  order_status_id BIGINT,
  subtotal DECIMAL(12, 2),
  discount_total DECIMAL(12, 2),
  tax_total DECIMAL(12, 2),
  total DECIMAL(12, 2),
  coupon_id BIGINT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (app_user_id) REFERENCES `app_user` (id),
  FOREIGN KEY (order_status_id) REFERENCES `order_status` (id),
  FOREIGN KEY (coupon_id) REFERENCES `coupon` (id)
);

CREATE TABLE IF NOT EXISTS `order_item` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  product_id BIGINT,
  custom_candle_id BIGINT NULL,
  product_name VARCHAR(120),
  unit_price DECIMAL(12, 2),
  quantity INT,
  line_total DECIMAL(12, 2),
  FOREIGN KEY (order_id) REFERENCES `user_order` (id),
  FOREIGN KEY (product_id) REFERENCES `product` (id),
  FOREIGN KEY (custom_candle_id) REFERENCES `custom_candle` (id)
);

CREATE TABLE IF NOT EXISTS `contact_message` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  app_user_id BIGINT,
  name VARCHAR(100),
  email VARCHAR(150),
  subject VARCHAR(150),
  message TEXT,
  status VARCHAR(30),
  created_at DATETIME,
  FOREIGN KEY (app_user_id) REFERENCES `app_user` (id)
);
