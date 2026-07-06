/*
=========================================================
PROYECTO      : EcoInventory Pro
VERSIÓN       : V1
ARCHIVO       : V1__create_tables.sql
DESCRIPCIÓN   : Creación de tablas principales
BASE DE DATOS : ecoinventory_db
AUTOR         : Carlos Mego
=========================================================
*/

USE ecoinventory_db;

-- =====================================================
-- TABLA: rol
-- =====================================================

CREATE TABLE rol (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: usuario
-- =====================================================

CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    rol_id BIGINT NOT NULL,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: categoria
-- =====================================================

CREATE TABLE categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(250),

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: marca
-- =====================================================

CREATE TABLE marca (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(250),

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: proveedor
-- =====================================================

CREATE TABLE proveedor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    ruc CHAR(11) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    direccion VARCHAR(250),

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: producto
-- =====================================================

CREATE TABLE producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,

    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,

    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,

    categoria_id BIGINT NOT NULL,
    marca_id BIGINT NOT NULL,
    proveedor_id BIGINT NOT NULL,

    imagen VARCHAR(255),

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(id),

    CONSTRAINT fk_producto_marca
        FOREIGN KEY (marca_id)
        REFERENCES marca(id),

    CONSTRAINT fk_producto_proveedor
        FOREIGN KEY (proveedor_id)
        REFERENCES proveedor(id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: tipo_movimiento
-- =====================================================

CREATE TABLE tipo_movimiento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(50) NOT NULL UNIQUE,

    descripcion VARCHAR(200),

    estado BOOLEAN NOT NULL DEFAULT TRUE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: movimiento
-- =====================================================

CREATE TABLE movimiento (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    producto_id BIGINT NOT NULL,

    usuario_id BIGINT NOT NULL,

    tipo_movimiento_id BIGINT NOT NULL,

    cantidad INT NOT NULL,

    costo_unitario DECIMAL(10,2),

    motivo VARCHAR(100),

    observacion VARCHAR(300),

    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimiento_producto
        FOREIGN KEY (producto_id)
        REFERENCES producto(id),

    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id),

    CONSTRAINT fk_movimiento_tipo
        FOREIGN KEY (tipo_movimiento_id)
        REFERENCES tipo_movimiento(id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- TABLA: configuracion
-- =====================================================

CREATE TABLE configuracion (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre_empresa VARCHAR(150) NOT NULL,

    ruc CHAR(11),

    direccion VARCHAR(250),

    telefono VARCHAR(20),

    stock_minimo_global INT DEFAULT 5,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;