import pool from '../db.js';

export const searchItems = async (req, res, next) => {
    try {
        const searchTerm = req.query.q; // El término de búsqueda que el usuario ingresa

        const [rows] = await pool.query(
            `SELECT * FROM item 
             WHERE MATCH(DESCRIPCION, TRABAJADOR, DEPENDENCIA) AGAINST (? IN NATURAL LANGUAGE MODE)`,
            [searchTerm]
        );

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron resultados' });

        res.json(rows); // Retorna todos los resultados coincidentes
    } catch (error) {
        return res.status(500).json(error);
    }
};



export const searchItemsByWorkerAndDescription = async (req, res, next) => {
    try {
        // Extraemos los valores de trabajador y descripcion de la consulta
        const trabajador = `%${req.query.trabajador}%`;
        const descripcion = `%${req.query.descripcion}%`;

        // Realizamos la consulta SQL con los parámetros
        const [rows] = await pool.query(`
            SELECT * FROM item WHERE TRABAJADOR LIKE ? AND DESCRIPCION LIKE ? ORDER BY DESCRIPCION
        `, [trabajador, descripcion]);

        // Validamos si hay resultados
        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems con los criterios especificados' });

        res.json(rows); // Enviamos los resultados
    } catch (error) {
        console.error("Error en la consulta:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};