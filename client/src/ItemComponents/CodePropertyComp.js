// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const CodePropertyComp = () => {
//     // Primer buscador
//     const [barcode, setBarcode] = useState('');
//     const [itemData, setItemData] = useState(null);
//     const inputRef = useRef(null);

//     // Segundo buscador
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);

//     // Manejadores para el primer buscador
//     const handleInputChange = (e) => setBarcode(e.target.value);
//     const clearInput = () => {
//         setBarcode('');
//         setItemData(null);
//         inputRef.current.focus();
//     };

//     // Manejadores para el segundo buscador
//     const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);
//     const clearSearch = () => {
//         setSearchQuery('');
//         setSearchResults([]);
//     };

//     // Buscar datos del primer buscador
//     useEffect(() => {
//         const fetchItem = async () => {
//             if (barcode !== '') {
//                 try {
//                     const response = await axios.get(`http://localhost:3030/items/${barcode}`);
//                     const item = response.data;

//                     if (item) {
//                         setItemData(item);
//                     }
//                 } catch (error) {
//                     console.log('Error al obtener el item:', error);
//                     setItemData(null);
//                 }
//             } else {
//                 setItemData(null);
//             }
//         };

//         fetchItem();
//     }, [barcode]);

//     useEffect(() => {
//         const fetchSearchResults = async () => {
//             if (searchQuery !== '') {
//                 try {
//                     const response = await axios.get(`http://localhost:3030/items/status/${searchQuery}`);
//                     const data = response.data;

//                     console.log('Response data de segunda búsqueda:', data);

//                     // Si el dato no es un array, conviértelo en uno
//                     if (data && !Array.isArray(data)) {
//                         setSearchResults([data]); // Convierte a un array con un único elemento
//                     } else {
//                         setSearchResults(data || []); // En caso sea un array o esté vacío
//                     }
//                 } catch (error) {
//                     console.log('Error al obtener los resultados de búsqueda:', error);
//                     setSearchResults([]);
//                 }
//             } else {
//                 setSearchResults([]);
//             }
//         };

//         fetchSearchResults();
//     }, [searchQuery]);

//     //     Explicación del Problema
//     // La API devuelve un objeto cuando encuentra un único resultado:

//     // javascript
//     // Copy code
//     // { N: 1, CODIGO_PATRIMONIAL: '042204310006', ... }
//     // El componente espera un array para usar .map() en el renderizado. Si no es un array, map() no funciona, dejando la tabla vacía.

//     // Al transformar el objeto en un array ([response.data]), la lógica del renderizado sigue siendo válida.

//     // Función para alternar el estado del item
//     const toggleEstado = async (itemId, currentEstado) => {
//         try {
//             // Cambia el estado en el backend
//             await axios.put(`http://localhost:3030/items/${itemId}`, {
//                 DISPOSICION: currentEstado === 1 ? 0 : 1,
//             });

//             // Actualiza el estado local sin hacer una nueva búsqueda
//             setSearchResults((prevResults) =>
//                 prevResults.map((item) =>
//                     item.CODIGO_PATRIMONIAL === itemId
//                         ? { ...item, DISPOSICION: currentEstado === 1 ? 0 : 1 }
//                         : item
//                 )
//             );
//         } catch (error) {
//             console.error('Error al cambiar el estado:', error);
//         }
//     };


//     return (
//         <div className="container my-4">
//             <h2 className="text-center mb-4">Buscar por código patrimonial</h2>

//             {/* Primer buscador */}
//             <div className='row g-3'>
//                     <p className='text-lg-start fw-bold'>REGISTRAR ITEM</p>
//                 <div className='col-10'>
//                     <input
//                         type="text"
//                         placeholder="Escanear código (barras) patrimonial"
//                         value={barcode}
//                         onChange={handleInputChange}
//                         ref={inputRef}
//                         className="form-control mb-3"
//                         style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
//                     />
//                 </div>
//                 <div className='col-2'>
//                     <button
//                         onClick={clearInput}
//                         className="btn btn-dark mb-3 fw-bold"
//                         style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
//                     >
//                         🧹 Limpiar
//                     </button>
//                 </div>
//             </div>

//             {itemData ? (
//                 <div className="d-flex justify-content-center mt-3">
//                     <div className="row g-5 align-items-center">
//                         <div className="col-auto text-start">
//                             <h2 className="text-uppercase fw-medium mb-3">Información del Item</h2>
//                             <h4 style={{ color: 'black', marginBottom: '10px' }}>Código Patrimonial: <strong>{itemData.CODIGO_PATRIMONIAL}</strong></h4>
//                             <h4 style={{ color: 'black', marginBottom: '10px' }}>Descripción: <strong>{itemData.DESCRIPCION}</strong></h4>
//                             <h4 style={{ color: 'black', marginBottom: '10px' }}>Dependencia: <strong>{itemData.DEPENDENCIA}</strong></h4>
//                             <h4 style={{ color: 'black', marginBottom: '10px' }}>Trabajador: <strong>{itemData.TRABAJADOR}</strong></h4>
//                             {/* <p><strong>Estado :</strong> {itemData.ESTADO}</p> */}
//                             <p>
//                                 {itemData.ESTADO === 0 ? (
//                                     <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No Registrado</span></h4>
//                                 ) : (
//                                     <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Registrado</span></h4>
//                                 )}
//                             </p>
//                             {/* <p><strong>Ultima Fecha de Registro:</strong> {itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString() : 'No Registrado'}</p> */}
//                             <p>
//                                 {itemData.DISPOSICION === 0 ? (
//                                     <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No </span></h4>
//                                 ) : (
//                                     <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Si</span></h4>
//                                 )}
//                             </p>
//                             <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Alta: <strong>{itemData.FECHA_ALTA ? itemData.FECHA_ALTA : 'No Registrado'}</strong></h4>
//                             <h4 style={{ color: 'black', marginBottom: '10px' }}>Ultima Fecha de Registro: <strong>{itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'No Registrado'}</strong></h4>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 barcode && <p>No se encontró ningún item con el ID ingresado.</p>
//             )}

//             <span style={{
//                 display: 'inline-block',
//                 width: '100%',
//                 height: '2px',
//                 backgroundColor: 'gray',
//                 margin: '20px 0'
//             }}></span>

//             {/* Segundo buscador */}
//             <div className='row g-3'>
//                     <p className='text-lg-start fw-bold'>VER ESTADOS DE ITEM</p>
//                 <div className='col-10'>
//                     <input
//                         type="text"
//                         placeholder="Escanear código (barras) patrimonial"
//                         value={searchQuery}
//                         onChange={handleSearchQueryChange}
//                         className="form-control mb-3"
//                         style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
//                     />
//                 </div>
//                 <div className='col-2'>
//                     <button
//                         onClick={clearSearch}
//                         className="btn btn-dark mb-3 fw-bold"
//                         style={{ marginBottom: '20px', fontSize: '1rem', padding: '10px' }}
//                     >
//                         🧹 Limpiar
//                     </button>
//                 </div>
//             </div>

//             {searchResults.length > 0 ? (
//                 <div className="mt-3">
//                     <table className="w-auto table table-striped table-bordered align-middle mb-5" style={{ width: '100%', tableLayout: 'fixed' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Ultima Fecha de Registro</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ESTADO</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {searchResults.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.CODIGO_PATRIMONIAL}</td>
//                                     <td>{item.DESCRIPCION}</td>
//                                     <td>{item.DEPENDENCIA}</td>
//                                     <td>{item.TRABAJADOR}</td>
//                                     <td>{item.FECHA_REGISTRO ? new Date(item.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</td>
//                                     <td>{item.FECHA_ALTA}</td>
//                                     <td>
//                                         {item.ESTADO === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Registrado</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Registrado</span>
//                                         )}
//                                     </td>
//                                     <td>
//                                         {item.DISPOSICION === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}>No</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>Si</span>
//                                         )}
//                                     </td>
//                                     <td>
//                                         <button itemId
//                                             onClick={() => toggleEstado(item.CODIGO_PATRIMONIAL, item.DISPOSICION)}
//                                             className="btn btn-primary"
//                                         >
//                                             Cambiar Disposición
//                                         </button>
//                                         <button>
//                                             EDITAR
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 searchQuery && <p>No se encontraron resultados para el código ingresado.</p>
//             )}
//         </div>
//     );
// };

// export default CodePropertyComp;


import React, { useState, useRef } from 'react';
import axios from 'axios';

const CodePropertyComp = () => {
    const [barcode, setBarcode] = useState('');
    const [itemData, setItemData] = useState(null);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;

        // Solo permite números y actualiza el estado
        if (/^\d*$/.test(value)) {
            setBarcode(value);

            // Dispara la solicitud si tiene exactamente 12 caracteres
            if (value.length === 12) {
                fetchItem(value);
            }
        }
    };

    const fetchItem = async (code) => {
        try {
            const response = await axios.get(`http://localhost:3030/items/${code}`);
            const item = response.data;

            if (item) {
                setItemData(item);
            } else {
                setItemData(null);
            }
        } catch (error) {
            console.log('Error al obtener el item:', error);
            setItemData(null);
        }
    };

    const clearInput = () => {
        setBarcode('');
        setItemData(null);
        inputRef.current.focus();
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Buscar por código patrimonial</h2>

            <div className='row g-3'>
                <p className='text-lg-start fw-bold'>REGISTRAR ITEM</p>
                <div className='col-10'>
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
                <div className='col-2'>
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
                            <h4 style={{ color: 'black', marginBottom: '10px' }}>Trabajador: <strong>{itemData.TRABAJADOR}</strong></h4>
                            <p>
                                {itemData.ESTADO === 0 ? (
                                    <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No Registrado</span></h4>
                                ) : (
                                    <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Registrado</span></h4>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                barcode && barcode.length === 12 && <p>No se encontró ningún item con el ID ingresado.</p>
            )}
        </div>
    );
};

export default CodePropertyComp;
