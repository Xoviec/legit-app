CREATE DATABASE IF NOT EXISTS kiki;

USE kiki;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NULL,
  password VARCHAR(255) NOT NULL,
  account_type ENUM('user', 'admin') DEFAULT 'user',
  avatar TEXT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE KEY users_nickname_unique (nickname),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS items (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    sku VARCHAR(100) NOT NULL, 
    brand VARCHAR(100) NOT NULL,
    image VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS comments (
    id CHAR(36) PRIMARY KEY, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    comment_by CHAR(36), 
    comment_on CHAR(36), 
    content TEXT, 
    FOREIGN KEY (comment_by) REFERENCES users(id), 
    FOREIGN KEY (comment_on) REFERENCES items(id) 
);

CREATE TABLE legited_items (
    id CHAR(36) PRIMARY KEY,
    item_id CHAR(36),
    legited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_owner CHAR(36),
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (current_owner) REFERENCES users(id)
);
