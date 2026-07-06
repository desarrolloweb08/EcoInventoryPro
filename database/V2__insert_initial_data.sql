/*
=========================================================
PROYECTO      : EcoInventory Pro
VERSIÓN       : V2
ARCHIVO       : V2__insert_initial_data.sql
DESCRIPCIÓN   : Datos iniciales del sistema
=========================================================
*/

USE ecoinventory_db;

-- ==========================================
-- ROLES
-- ==========================================

INSERT INTO rol(nombre, descripcion)
VALUES
('Administrador','Acceso completo al sistema'),
('Almacenero','Gestiona productos y movimientos');


-- ==========================================
-- TIPOS DE MOVIMIENTO
-- ==========================================

INSERT INTO tipo_movimiento(nombre, descripcion)
VALUES
('ENTRADA','Ingreso de productos al almacén'),
('SALIDA','Salida de productos del almacén');


-- ==========================================
-- CONFIGURACIÓN
-- ==========================================

INSERT INTO configuracion
(
nombre_empresa,
ruc,
direccion,
telefono,
stock_minimo_global
)
VALUES
(
'EcoInventory Pro',
'20123456789',
'Av. Javier Prado 123 - Lima',
'999999999',
5
);


-- ==========================================
-- USUARIO ADMINISTRADOR
-- ==========================================

INSERT INTO usuario
(
nombres,
apellidos,
correo,
username,
password,
rol_id
)
VALUES
(
'Administrador',
'Sistema',
'admin@ecoinventory.com',
'admin',
'admin123',
1
);