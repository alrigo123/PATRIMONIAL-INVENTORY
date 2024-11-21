import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URI = 'http://localhost:3030/items';

const DoubleSearchComp = () => {
    const [trabajador, setTrabajador] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [items, setItems] = useState([]);

    // useEffect para realizar la búsqueda cada vez que cambian trabajador o descripcion
    useEffect(() => {
        const fetchItems = async () => {
            if (trabajador !== '' || descripcion !== '') {
                try {
                    // Realizamos la consulta a la API enviando trabajador y descripcion como parámetros
                    const response = await axios.get(`${URI}/filter`, {
                        params: { trabajador, descripcion },
                    });
                    setItems(response.data); // Guardamos los resultados en el estado
                } catch (error) {
                    console.error('Error al obtener los ítems:', error);
                    setItems([]); // Limpiamos la lista en caso de error
                }
            } else {
                setItems([]); // Limpiamos la lista si ambos campos están vacíos
            }
        };
        fetchItems();
    }, [trabajador, descripcion]); 


    return (
        <div className="container my-4">
            <div className='row g-3'>
                <h1 className="text-center mb-4">Filtrar trabajador e item</h1>
                <div className='col-5'>
                    <input
                        className="form-control mb-4"
                        type="text"
                        placeholder="Buscar por Trabajador"
                        value={trabajador}
                        onChange={(e) => setTrabajador(e.target.value)}
                    />
                </div>
                <div className='col-5'>
                    <input
                        className="form-control mb-4"
                        type="text"
                        placeholder="Buscar por Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
            </div>

            <div>
                {items.length > 0 ? (
                    <div>
                        <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ESTADO</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.CODIGO_PATRIMONIAL}</td>
                                        <td>{item.TRABAJADOR}</td>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.DEPENDENCIA}</td>
                                        <td>
                                            {item.ESTADO === 0 ? (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Registrado</span>
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Registrado</span>
                                            )}
                                        </td>
                                        <td>
                                            {item.DISPOSICION === 0 ? (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No</span>
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Si</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    items && <p className="text-center text-danger ">No se encontraron items con los datos del trabajador.</p>
                )}
            </div>
        </div>
    );
};

export default DoubleSearchComp;
