import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost:3030/items'

const WorkerSearchMod1 = () => {
    const [searchTerm1, setSearchTerm1] = useState(''); // Valor del primer buscador
    const [results1, setResults1] = useState([]); // Resultados de la primera búsqueda

    // Maneja el cambio en el primer input
    const handleInputChange1 = (e) => {
        setSearchTerm1(e.target.value);
    };

    // useEffect para la primera búsqueda
    useEffect(() => {
        const fetchItems1 = async () => {
            if (searchTerm1 !== '') {
                try {
                    const response = await axios.get(`${URL}/worker?q=${searchTerm1}`);
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

    // Función para alternar el estado del item
    const toggleEstado = async (itemId, currentEstado) => {
        try {
            // Cambia el estado en el backend
            await axios.put(`${URL}/${itemId}`, {
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
        <div>
            {/* Primer buscador */}
            <h2 className="text-center mb-4">Buscar por trabajador</h2>
            <p className='text-lg-start fw-bold'>BIENES CON CODIGO PATRIMONIAL DEL TRABAJADOR</p>
            <input
                type="text"
                placeholder="Ingrese datos de trabajador (Apellidos y/o Nombres)"
                value={searchTerm1}
                onChange={handleInputChange1}
                className="form-control mb-4"
            />
            {results1.length > 0 ? (
                <div>
                    <h3 className='fw-semibold'>BIENES EN PODER DE <strong>{searchTerm1}</strong> </h3>
                    <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Compra</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Situación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results1.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td >{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
                                    <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                                    <td>
                                        {item.ESTADO === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}> No Patrimonizado</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Patrimonizado</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.DISPOSICION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>No Funcional</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Funcional</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.SITUACION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>Faltante</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Verificado</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                searchTerm1 && <p className="text-center text-danger ">No se encontraron bienes con los datos del trabajador.</p>
            )}
        </div>
    )
}

export default WorkerSearchMod1
