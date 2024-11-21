import pool from '../db.js';

export const updateDisposition = async (req, res) => {
    const { id } = req.params;
    const { DISPOSICION } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE item SET DISPOSICION = ? WHERE CODIGO_PATRIMONIAL = ?',
            [DISPOSICION, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Disposition updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};


export const getItemByCodePatAndUpdate = async (req, res, next) => {
    try {
        const id = req.params.id;

/* hacer una condicional de que si el id no es igual a 12 caracteres entonces ni busque nada */


// porque despues de 8 ya no quiere buscar

        // // Log para verificar el parámetro recibido
        console.log('ID recibido:', id);

        // Intento de búsqueda del item
        const [rows] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);

  

        // // Log para verificar si el item fue encontrado
        console.log('Resultado de búsqueda:', rows);

        if (!rows.length) {
            console.log('Item no encontrado.');
            return res.status(404).json({ message: 'Item not found' });
        }

        // Aquí se obtiene el item
        const item = rows[0];
        const fechaRegistro = new Date(); // Fecha actual

        // // Log para verificar valores antes de actualizar
        console.log('Preparando para actualizar item con ID:', id);
        console.log('Fecha Registro:', fechaRegistro);

        // Intento de actualizar estado y fecha
        const [updateResult] = await pool.query(
            "UPDATE item SET ESTADO = 1, FECHA_REGISTRO = ? WHERE CODIGO_PATRIMONIAL = ?",
            [fechaRegistro, id]
        );

        // Log para verificar si la actualización fue exitosa
        console.log('Resultado de la actualización:', updateResult);

        // // Verifica si la actualización afectó alguna fila
        if (updateResult.affectedRows === 0) {
            console.log('No se actualizó ningún registro.');
        } else {
            console.log('Registro actualizado correctamente.');
        }

        // Retornar el item con sus datos actualizados
        res.json({ ...item, ESTADO: 1, FECHA_REGISTRO: fechaRegistro });
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json(error);
    }
};


// export const getItemByCodePatAndUpdate = async (req, res, next) => {
//     try {
//         const id = req.params.id;

//         // Verifica que el id tenga exactamente 12 caracteres
//         if (!id || id.length !== 12) {
//             console.log('ID inválido: Debe tener exactamente 12 caracteres.');
//             return res.status(400).json({ message: 'Invalid ID: Must be exactly 12 characters long' });
//         }

//         // Log para verificar el parámetro recibido
//         console.log('ID recibido:', id);

//         // Intento de búsqueda del item
//         const [rows] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);

//         // Log para verificar si el item fue encontrado
//         console.log('Resultado de búsqueda:', rows);

//         if (!rows.length) {
//             console.log('Item no encontrado.');
//             return res.status(404).json({ message: 'Item not found' });
//         }

//         // Aquí se obtiene el item
//         const item = rows[0];
//         const fechaRegistro = new Date(); // Fecha actual

//         // Log para verificar valores antes de actualizar
//         console.log('Preparando para actualizar item con ID:', id);
//         console.log('Fecha Registro:', fechaRegistro);

//         // Intento de actualizar estado y fecha
//         const [updateResult] = await pool.query(
//             "UPDATE item SET ESTADO = 1, FECHA_REGISTRO = ? WHERE CODIGO_PATRIMONIAL = ?",
//             [fechaRegistro, id]
//         );

//         // Log para verificar si la actualización fue exitosa
//         console.log('Resultado de la actualización:', updateResult);

//         // Verifica si la actualización afectó alguna fila
//         if (updateResult.affectedRows === 0) {
//             console.log('No se actualizó ningún registro.');
//         } else {
//             console.log('Registro actualizado correctamente.');
//         }

//         // Retornar el item con sus datos actualizados
//         res.json({ ...item, ESTADO: 1, FECHA_REGISTRO: fechaRegistro });
//     } catch (error) {
//         console.error('Error en la actualización:', error);
//         return res.status(500).json(error);
//     }
// };
 

export const insertExcelData = async (req, res) => {
    const { data } = req.body; // The data array from the React frontend
    try {
        // Start a transaction to ensure atomicity
        await pool.query('START TRANSACTION');

        // Iterate over each row of data and insert into the database
        for (let row of data) {
            const { CODIGO_PATRIMONIAL, DESCRIPCION,
                TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_COMPRA, FECHA_ALTA } = row;

            // SQL query to insert the data into your 'item' table
            const [result] = await pool.query(
                `INSERT INTO item (CODIGO_PATRIMONIAL, DESCRIPCION,
                TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_COMPRA, FECHA_ALTA) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [CODIGO_PATRIMONIAL, DESCRIPCION,
                    TRABAJADOR, DEPENDENCIA, UBICACION,
                    FECHA_COMPRA, FECHA_ALTA]
            );

            // If the insert fails (affectedRows === 0), you can handle it as needed
            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Failed to insert row' });
            }
        }

        // Commit the transaction
        await pool.query('COMMIT');

        res.json({ message: 'Excel data inserted successfully' });
    } catch (error) {
        // If an error occurs, rollback the transaction to avoid partial inserts
        await pool.query('ROLLBACK');
        res.status(500).json({ message: 'Error inserting Excel data', error });
    }
};


// SELECT * FROM item WHERE TRABAJADOR LIKE '%ESTRADA CHILE%' AND ESTADO = 0;