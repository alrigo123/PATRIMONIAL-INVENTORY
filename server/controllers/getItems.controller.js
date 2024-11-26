import pool from '../db.js';

//FUNCTIONS TO GET DATA
export const getAllItems = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        const limit = parseInt(req.query.limit) || 50; // Límite de registros por página, por defecto 50
        const offset = (page - 1) * limit; // Cálculo del offset

        const [rows] = await pool.query(
            'SELECT * FROM item ORDER BY N ASC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM item');
        const total = totalRows[0].total;

        res.json({ total, page, limit, items: rows });
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemByCodePat = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]); //with the [] just get an array with the components neede, without that give us more rows

        console.log(row)

        // if (!row.length) return res.status(404).json({ message: 'Item not found' })
        if (!row.length) return res.status(404).json({ message: 'Item not found' })

        res.json(row[0])
        // res.json({ item :  row[0].id })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getItemsQtyByWorker = async (req, res, next) => {
    try {
        // const trabajador = req.query.q;
        const trabajador = `%${req.query.q}%`;
        const [rows] = await pool.query(`
            SELECT 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS
            FROM 
                item
            WHERE 
                TRABAJADOR LIKE ?
            GROUP BY 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION
        `, [trabajador]); // Aplicamos la búsqueda por coincidencia

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const getItemsQtyByDependece = async (req, res, next) => {
    try {
        const dependece = `%${req.query.q}%`; // Parche para que la búsqueda sea parcial con el operador LIKE
        // const dependece = req.query.q; 
        const [rows] = await pool.query(`
            SELECT 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS
            FROM 
                item
            WHERE 
            DEPENDENCIA LIKE ?
            GROUP BY 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION
        `, [dependece]); // Aplicamos la búsqueda por coincidencia

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para la dependencia especificada' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};