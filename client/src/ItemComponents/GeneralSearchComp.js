
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const URI = 'http://localhost:3030/items';

const GeneralSearchComp = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Guarda el valor ingresado en el input
    const [results, setResults] = useState([]); // Guarda los datos de los items encontrados
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // Función que maneja el cambio en el input
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
    };

    // useEffect para hacer la búsqueda cuando cambia el valor del input
    useEffect(() => {
        // Cancelar la búsqueda anterior si el usuario sigue escribiendo
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Setear el debounce
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm !== '') {  // Si hay algún valor en el input
                const fetchItems = async () => {
                    setIsLoading(true); // Iniciar la carga
                    try {
                        const response = await axios.get(`${URI}/search?q=${searchTerm}`);
                        setResults(response.data); // Actualiza el estado con los datos de los items
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults([]); // Reinicia el estado si hay un error
                    } finally {
                        setIsLoading(false); // Termina la carga
                    }
                };

                fetchItems();
            } else {
                setResults([]); // Si el input está vacío, limpia la vista
            }
        }, 700); // El retraso de 500ms antes de hacer la búsqueda
        // Limpiar el timeout cuando el componente se desmonte
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchTerm]); // Solo se vuelve a ejecutar si el searchTerm cambia

    // Función para alternar el estado del item
    const toggleEstado = async (itemId, currentEstado) => {
        try {
            // Cambia el estado en el backend
            await axios.put(`${URI}/${itemId}`, {
                DISPOSICION: currentEstado === 1 ? 0 : 1,
            });

            // Actualiza el estado local sin hacer una nueva búsqueda
            setResults((prevResults) =>
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
            <h2 className="text-center mb-4">Búsqueda General</h2>
            <input
                type="text"
                placeholder="Ingrese término de búsqueda"
                value={searchTerm}
                onChange={handleInputChange}
                className="form-control mb-4"
            />

            {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
            {isLoading ? (
                <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Buscando...</span>
                </div>
            </div>
            ) : results.length > 0 ? (
                <div>
                    <h3 className="text-uppercase fw-bolder">Resultados</h3>
                    <table className="w-auto table table-striped table-bordered" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ESTADO</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => (
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
                                        <button
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
                searchTerm && <p className="text-center text-muted">No se encontraron items con el término ingresado.</p>
            )}
        </div>
    );
};

export default GeneralSearchComp;


///// -------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const URI = 'http://localhost:3030/items';

// const GeneralSearchComp = () => {
//     const [searchTerm, setSearchTerm] = useState(''); // Guarda el valor ingresado en el input
//     const [results, setResults] = useState([]); // Guarda los datos de los items encontrados
//     const [errorMessage, setErrorMessage] = useState(''); // Estado para mostrar mensaje de advertencia

//     // Función que maneja el cambio en el input
//     const handleInputChange = (e) => {
//         setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
//         setErrorMessage(''); // Limpia el mensaje de error al escribir
//     };

//     // useEffect para hacer la búsqueda cuando cambia el valor del input
//     useEffect(() => {
//         const fetchItems = async () => {
//             if (searchTerm.length >= 3) {  // Solo busca si el término tiene 3 o más caracteres
//                 try {
//                     const response = await axios.get(`${URI}/search?q=${searchTerm}`);
//                     setResults(response.data); // Actualiza el estado con los datos de los items
//                 } catch (error) {
//                     console.log('Error al obtener los items:', error);
//                     setResults([]); // Reinicia el estado si hay un error
//                 }
//             } else if (searchTerm.length > 0) {
//                 setErrorMessage('Por favor ingrese más de 3 caracteres para realizar la búsqueda.');
//                 setResults([]); // Limpiar resultados si el término es menor a 3 caracteres
//             } else {
//                 setResults([]); // Si el input está vacío, limpia los resultados
//                 setErrorMessage(''); // Limpia el mensaje de error cuando no hay texto
//             }
//         };

//         // Solo ejecuta la búsqueda si el término es mayor o igual a 3 caracteres
//         if (searchTerm.length >= 3 || searchTerm.length === 0) {
//             fetchItems();
//         }

//     }, [searchTerm]); // Se ejecuta cada vez que searchTerm cambia

//     // Función para alternar el estado del item
//     const toggleEstado = async (itemId, currentEstado) => {
//         try {
//             // Cambia el estado en el backend
//             await axios.put(`${URI}/${itemId}`, {
//                 DISPOSICION: currentEstado === 1 ? 0 : 1,
//             });

//             // Actualiza el estado local sin hacer una nueva búsqueda
//             setResults((prevResults) =>
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
//             <h2 className="text-center mb-4">Búsqueda General</h2>
//             <input
//                 type="text"
//                 placeholder="Ingrese término de búsqueda"
//                 value={searchTerm}
//                 onChange={handleInputChange}
//                 className="form-control mb-4"
//             />
            
//             {/* Mensaje de advertencia si el término es menor a 3 caracteres */}
//             {errorMessage && <p className="text-center text-danger">{errorMessage}</p>}

//             {results.length > 0 ? (
//                 <div>
//                     <h3 className="text-uppercase fw-bolder">Resultados</h3>
//                     <table className="w-auto table table-striped table-bordered" style={{ width: '100%', tableLayout: 'fixed' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ESTADO</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Acción</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {results.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.CODIGO_PATRIMONIAL}</td>
//                                     <td>{item.DESCRIPCION}</td>
//                                     <td>{item.DEPENDENCIA}</td>
//                                     <td>{item.TRABAJADOR}</td>
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
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 searchTerm && <p className="text-center text-muted">No se encontraron items con el término ingresado.</p>
//             )}
//         </div>
//     );
// };

// export default GeneralSearchComp;
