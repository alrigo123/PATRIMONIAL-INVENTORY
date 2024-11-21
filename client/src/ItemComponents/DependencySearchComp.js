import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DependencySearchComp = () => {
    const [searchTerm1, setSearchTerm1] = useState(''); // Valor del primer buscador
    const [searchTerm2, setSearchTerm2] = useState(''); // Valor del segundo buscador
    const [results1, setResults1] = useState([]); // Resultados de la primera búsqueda
    const [results2, setResults2] = useState([]); // Resultados de la segunda búsqueda

    // Maneja el cambio en el primer input
    const handleInputChange1 = (e) => {
        setSearchTerm1(e.target.value);
    };

    // Maneja el cambio en el segundo input
    const handleInputChange2 = (e) => {
        setSearchTerm2(e.target.value);
    };

    // useEffect para la primera búsqueda
    useEffect(() => {
        const fetchItems1 = async () => {
            if (searchTerm1 !== '') {
                try {
                    const response = await axios.get(`http://localhost:3030/items/dependency?q=${searchTerm1}`);
                    setResults1(response.data);
                } catch (error) {
                    console.log('Error al obtener los items:', error);
                    setResults1([]);
                }
            } else {
                setResults1([]);
            }
        };
        fetchItems1();
    }, [searchTerm1]);

    // useEffect para la segunda búsqueda
    useEffect(() => {
        const fetchItems2 = async () => {
            if (searchTerm2 !== '') {
                try {
                    const response = await axios.get(`http://localhost:3030/items/dependency/qty?q=${searchTerm2}`);
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

    // Función para alternar el estado del item
    const toggleEstado = async (itemId, currentEstado) => {
        try {
            // Cambia el estado en el backend
            await axios.put(`http://localhost:3030/items/${itemId}`, {
                DISPOSICION: currentEstado === 1 ? 0 : 1,
            });

            // Actualiza el estado local sin hacer una nueva búsqueda
            setResults1((prevResults) =>
                prevResults.map((item) =>
                    item.CODIGO_PATRIMONIAL === itemId
                        ? { ...item, DISPOSICION: currentEstado === 1 ? 0 : 1 }
                        : item
                )
            );
        } catch (error) {
            console.error('Error al cambiar el estado:', error);
        }
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Buscar por dependencia</h2>

            {/* Primer buscador */}
            <p className='text-lg-start fw-bold'>ITEMS CON CODIGO PATRIMONIAL DE LA DEPENDENCIA</p>
            <input
                type="text"
                placeholder="Ingrese dependencia"
                value={searchTerm1}
                onChange={handleInputChange1}
                className="form-control mb-4"
            />
            {results1.length > 0 ? (
                <div>
                    <h3 className='fw-semibold'>ITEMS EN DEPENDENCIA <strong>{searchTerm1}</strong> </h3>
                    <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>

                            </tr>
                        </thead>
                        <tbody>
                            {results1.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>
                                        {item.ESTADO === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Registrado</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Registrado</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.DISPOSICION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>No</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Si</span>
                                        )}
                                    </td>
                                    <td>
                                        <button itemId
                                            onClick={() => toggleEstado(item.CODIGO_PATRIMONIAL, item.DISPOSICION)}
                                            className="btn btn-primary"
                                        >
                                            Cambiar Disposición
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                searchTerm1 && <p className="text-center text-danger ">No se encontraron items con los datos de la dependencia.</p>
            )}

            <p className='text-lg-start fw-bold'>CANTIDAD ITEMS DE LA DEPENDENCIA</p>
            {/* Segundo buscador */}
            <input
                type="text"
                placeholder="Ingrese dependencia"
                value={searchTerm2}
                onChange={handleInputChange2}
                className="form-control mb-4"
            />
            {results2.length > 0 ? (
                <div>
                    <h3 className='fw-semibold'>CANTIDAD DE ITEMS EN DEPENDENCIA <strong>{searchTerm2}</strong> </h3>
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
                                    {/* <td>
                                        {item.ESTADO === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Registrado</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Registrado</span>
                                        )}
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                searchTerm2 && <p className="text-center text-danger ">No se encontraron items con los datos de la dependencia.</p>
            )}
        </div>
    );
};

export default DependencySearchComp;
