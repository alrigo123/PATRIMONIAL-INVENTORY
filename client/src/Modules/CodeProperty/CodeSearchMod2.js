import React, { useState, useRef } from 'react';
import axios from 'axios';


const CodeSearchMod2 = () => {
  const [stateCode, setStateCode] = useState('');
  const [stateData, setStateData] = useState([]);
  const stateInputRef = useRef(null);

  const handleStateInputChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setStateCode(value);

      if (value.length === 12) {
        fetchState(value);
      }
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
    <div>
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
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>SITUACION</th>
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
                      <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Patrimonizado</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Patrimonizado</span>
                    )}
                  </td>
                  <td>
                    {item.DISPOSICION === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>No Funcional</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Funcional</span>
                    )}
                  </td><td>
                    {item.SITUACION === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Faltante</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Verificado</span>
                    )}
                  </td>
                  <td>
                    <button itemId
                      onClick={() => toggleEstado(item.CODIGO_PATRIMONIAL, item.DISPOSICION)}
                      className="btn btn-primary"
                    >
                      Cambiar Disposición
                    </button>
                    <button itemId
                      onClick={() => toggleEstado(item.CODIGO_PATRIMONIAL, item.DISPOSICION)}
                      className="btn btn-primary"
                    >
                      Cambiar Situacion
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
        stateCode && <p className="text-center text-danger">No se encontró información de estado del bien con el CODIGO PATRIMONIAL ingresado.</p>
      )}
    </div>
  )
}

export default CodeSearchMod2
