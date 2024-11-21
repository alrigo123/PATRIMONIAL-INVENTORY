import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost:3030/items'

const WorkerSearchMod2 = () => {
    const [searchTerm2, setSearchTerm2] = useState(''); // Valor del segundo buscador
    const [results2, setResults2] = useState([]); // Resultados de la segunda búsqueda

    // Maneja el cambio en el segundo input
    const handleInputChange2 = (e) => {
        setSearchTerm2(e.target.value);
    };

    // useEffect para la segunda búsqueda
    useEffect(() => {
        const fetchItems2 = async () => {
            if (searchTerm2 !== '') {
                try {
                    const response = await axios.get(`${URL}/worker/qty?q=${searchTerm2}`);
                    setResults2(response.data);
                } catch (error) {
                    console.log('Error al obtener los items:', error);
                    setResults2([]);
                }
            } else {
                setResults2([]);
            }
        };
        fetchItems2();
    }, [searchTerm2]);

    return (
        <div>
            {/* Segundo buscador */}
            <p className='text-lg-start fw-bold'>CANTIDAD DE BIENES DEL TRABAJADOR</p>
            <input
                type="text"
                placeholder="Ingrese datos de trabajador (Apellidos y/o Nombres)"
                value={searchTerm2}
                onChange={handleInputChange2}
                className="form-control mb-4"
            />
            {results2.length > 0 ? (
                <div>
                    <h3 className='fw-semibold'>CANTIDAD DE BIENES EN PODER DE <strong>{searchTerm2}</strong> </h3>
                    <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CANTIDAD ITEMS</th>
                                {/* <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {results2.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.CANTIDAD_ITEMS}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                searchTerm2 && <p className="text-center text-danger ">No se encontraron items con los datos del trabajador.</p>
            )}
        </div>
    )
}

export default WorkerSearchMod2
