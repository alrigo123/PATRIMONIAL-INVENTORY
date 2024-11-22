import React, { useState, useRef } from 'react';
import axios from 'axios';

const URL = 'http://localhost:3030/items'

const CodeSearchMod1 = () => {
  const [barcode, setBarcode] = useState('');
  const [itemData, setItemData] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setBarcode(value);

      if (value.length === 12) {
        fetchItem(value);
      }
    }
  };

  const fetchItem = async (code) => {
    try {
      const response = await axios.get(`${URL}/${code}`);
      setItemData(response.data || null);
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
    <div>
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
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No Patrimonizado</span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Patrimonizado</span></h4>
                )}
              </p>
              {/* <p><strong>Ultima Fecha de Registro:</strong> {itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString() : 'No Registrado'}</p> */}
              <p>
                {itemData.DISPOSICION === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ No Funcional </span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Funcional</span></h4>
                )}
              </p>
              <p>
                {itemData.SITUACION === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Situación: <span style={{ color: 'red', fontWeight: 'semibold' }}>❌ Faltante </span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Situación: <span style={{ color: 'green', fontWeight: 'semibold' }}>✅ Verificado</span></h4>
                )}
              </p>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Alta: <strong>{itemData.FECHA_ALTA ? itemData.FECHA_ALTA : 'No Registrado'}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Ultima Fecha de Registro: <strong>{itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'No Registrado'}</strong></h4>
            </div>
          </div>
        </div>
      ) : (
        barcode &&  <p className="text-center text-danger">No se encontró ningún bien con el CODIGO PATRIMONIAL ingresado.</p>
      )}

    </div>
  )
}

export default CodeSearchMod1
