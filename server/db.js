import { createPool } from 'mysql2/promise'; //pool to use 

// Local Host
const pool = new createPool({
    host: 'localhost',
    // port : 3333,
    user: 'root',
    password: '',
    // database : 'geragri-inventario'
    database: 'bienes-geragri',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// // Clever cloud 
// const pool = new createPool({
//     host : 'baobfvsm079fl2l3b4wv-mysql.services.clever-cloud.com',
//     user : 'umtuhz11zooiir2b',
//     password : 'JlKeGtt6n2csVeFYVFb4',
//     database : 'baobfvsm079fl2l3b4wv',
// waitForConnections: true,
// connectionLimit: 10,
// queueLimit: 0
// })

// // Docker VM server
// const pool = new createPool({
//     host: '192.168.0.55',
//     user: 'root',
//     password: 'cjmxc100',
//     database: 'bienes_geragri',
// waitForConnections: true,
// connectionLimit: 10,
// queueLimit: 0
// }) 

// Docker VM server GERAGRI
// const pool = new createPool({
//     host: '192.168.5.199',
//     user: 'root',
//     password: 'cjmxc100',
//     database: 'bienes_geragri',
// waitForConnections: true,
// connectionLimit: 10,
// queueLimit: 0
// })

// Check database connection
async function checkConnection() {
    try {
        const connection = await pool.getConnection(); // Intentar obtener una conexión
        console.log(`Connected to BD`)
        connection.release(); // Liberar la conexión al pool
    } catch (error) {
        console.error('Error in the database connection:', error.message);
    }
}

// Llamar a la función
checkConnection();

export default pool