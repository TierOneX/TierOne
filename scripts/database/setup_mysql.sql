-- ================================================
-- Script de Inicialización de Base de Datos MySQL
-- Proyecto: TierOne Platform
-- ================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS tierone_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE tierone_db;

-- Crear usuario para la aplicación (opcional, si quieres usar un usuario específico)
-- Descomenta las siguientes líneas si necesitas crear un usuario dedicado
-- CREATE USER IF NOT EXISTS 'tierone_user'@'localhost' IDENTIFIED BY 'TierOne2024!';
-- GRANT ALL PRIVILEGES ON tierone_db.* TO 'tierone_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Mensaje de confirmación
SELECT 'Base de datos tierone_db creada exitosamente!' AS Mensaje;
