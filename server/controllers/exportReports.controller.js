import pool from '../db.js';

export const getItemsGeneralState = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO 
            FROM item`
        );

        // Validar si hay resultados
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron elementos" });
        }
        res.json(rows);
        // console.log(rows)

    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error.message);
        return res.status(500).json({ error: "Error al obtener los datos de la base de datos" });
    }
};

export const getItemsGeneralDisposition = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION 
            FROM item`
        );

        res.json(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getItemsStateTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO 
            FROM item WHERE ESTADO = 1`
        );

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsStateFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO 
            FROM item WHERE ESTADO = 0`
        );

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsDispositionTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION 
            FROM item WHERE DISPOSICION = 1`
        );

        res.json(rows)
        // console.log(rows)


    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsDispositionFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, TRABAJADOR, 
            FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION 
            FROM item WHERE DISPOSICION = 0`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}