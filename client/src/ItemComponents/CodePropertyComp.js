import React, { useState, useRef } from 'react';
import axios from 'axios';

const CodePropertyComp = () => {
    const [barcode, setBarcode] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [itemData, setItemData] = useState(null);
    const [stateData, setStateData] = useState([]);
    const inputRef = useRef(null);
    const stateInputRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setBarcode(value);

            if (value.length === 12) {
                fetchItem(value);
            }
        }
    };

    const handleStateInputChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setStateCode(value);

            if (value.length === 12) {
                fetchState(value);
            }
        }
    };

    const fetchItem = async (code) => {
        try {
            const response = await axios.get(`http://localhost:3030/items/${code}`);
            setItemData(response.data || null);
        } catch (error) {
            console.log('Error al obtener el item:', error);
            setItemData(null);
        }
    };

    const fetchState = async (code) => {
        try {
            const response = await axios.get(`http://localhost:3030/items/status/${code}`);
            setStateData([response.data] || []);
        } catch (error) {
            console.log('Error al obtener el estado:', error);
            setStateData([]);
        }
    };

    const clearInput = () => {
        setBarcode('');
        setItemData(null);
        inputRef.current.focus();
    };

    const clearStateInput = () => {
        setStateCode('');
        setStateData([]);
        stateInputRef.current.focus();
    };

    const handleEdit = (item) => {
        console.log('Editando item:', item);
        // Aquí puedes implementar la lógica de edición, como abrir un modal con el formulario de edición
        alert(`Editar item con código ${item.CODIGO_PATRIMONIAL}`);
    };

    const toggleEstado = async (itemId, currentEstado) => {
        try {
            // Cambia el estado en el backend
            await axios.put(`http://localhost:3030/items/${itemId}`, {
                DISPOSICION: currentEstado === 1 ? 0 : 1,
            });

            // Actualiza el estado local sin hacer una nueva búsqueda
            setStateData((prevResults) =>
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
            <h2 className="text-center mb-4">Buscar bien por código patrimonial</h2>

            {/* Sección de búsqueda para items */}
            <p className="text-lg-start fw-bold">REGISTRAR BIEN PATRIMONIAL</p>
            <div className="row g-3">
                <div className="col-10">
                    <input
                        type="text"
                        placeholder="Escanear código (barras) patrimonial"
                        value={barcode}
                        onChange={handleInputChange}
                        ref={inputRef}
                        className="form-control mb-3"
                        style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
                    />
                </div>
                <div className="col-2">
                    <button
                        onClick={clearInput}
                        className="btn btn-dark mb-3 fw-bold"
                        style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
                    >
                        🧹 Limpiar
                    </button>
                </div>
            </div>

            {itemData ? (
                <div className="d-flex justify-content-center mt-3">
                    <div className="row g-5 align-items-center">
                        <div className="col-auto text-start">
                            <h2 className="text-uppercase fw-medium mb-3">Información del Item</h2>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Código Patrimonial: <strong>{itemData.CODIGO_PATRIMONIAL}</strong></h4>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Descripción: <strong>{itemData.DESCRIPCION}</strong></h4>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Dependencia: <strong>{itemData.DEPENDENCIA}</strong></h4>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Ubicación: <strong>{itemData.UBICACION}</strong></h4>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Trabajador: <strong>{itemData.TRABAJADOR}</strong></h4>
                            {/* <p><strong>Estado :</strong> {itemData.ESTADO}</p> */}
                            <p>
                                {itemData.ESTADO === 0 ? (
                                    <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No Registrado</span></h4>
                                ) : (
                                    <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Registrado</span></h4>
                                )}
                            </p>
                            {/* <p><strong>Ultima Fecha de Registro:</strong> {itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString() : 'No Registrado'}</p> */}
                            <p>
                                {itemData.DISPOSICION === 0 ? (
                                    <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No </span></h4>
                                ) : (
                                    <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Si</span></h4>
                                )}
                            </p>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Alta: <strong>{itemData.FECHA_ALTA ? itemData.FECHA_ALTA : 'No Registrado'}</strong></h4>
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Ultima Fecha de Registro: <strong>{itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'No Registrado'}</strong></h4>
                        </div>
                    </div>
                </div>
            ) : (
                barcode && <p>No se encontró ningún bien con el CODIGO PATRIMONIAL ingresado.</p>
            )}

            <hr />

            {/* Sección de búsqueda para estados */}
            <p className="text-lg-start fw-bold">CONSULTAR ESTADO DEL BIEN PATRIMONIAL</p>
            <div className="row g-3">
                <div className="col-10">
                    <input
                        type="text"
                        placeholder="Escanear código (barras) patrimonial"
                        value={stateCode}
                        onChange={handleStateInputChange}
                        ref={stateInputRef}
                        className="form-control mb-3"
                        style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
                    />
                </div>
                <div className="col-2">
                    <button
                        onClick={clearStateInput}
                        className="btn btn-dark mb-3 fw-bold"
                        style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
                    >
                        🧹 Limpiar
                    </button>
                </div>
            </div>

            {stateData.length > 0 ? (
                <div className="mt-3">
                    <table className="w-auto table table-striped table-bordered align-middle mb-5" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Ultima Fecha de Registro</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ESTADO</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stateData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.FECHA_REGISTRO ? new Date(item.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</td>
                                    <td>{item.FECHA_ALTA}</td>
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
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            ✏️ Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                stateCode && <p>No se encontró información para el estado del código ingresado.</p>
            )}
        </div>
    );
};

export default CodePropertyComp;
