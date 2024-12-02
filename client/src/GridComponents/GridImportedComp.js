import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Spreadsheet from 'react-spreadsheet';
import axios from 'axios';
import Swal from "sweetalert2"; // Importa SweetAlert2

// Import components
import ModalComp from './ModalComp';
import ErrorModalComp from './ErrorModalComp';
import TemplateExcelComp from './TemplateExcelComp';

import {
  validateDateColumns, validateEmptyCells,
  validateHeaderColumns, validatePatrimonialCodes
} from '../utils/excelFileValidations.js'

const URI_ITEMS = process.env.REACT_APP_API_URL_ITEMS

const GridImportedComp = () => {
  const [sheetsData, setSheetsData] = useState({});
  const [currentSheet, setCurrentSheet] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModalButton, setShowModalButton] = useState(false);
  const [progress, setProgress] = useState(0); // Nueva barra de progreso
  const [fileLoaded, setFileLoaded] = useState(false); // Estado para controlar el mensaje
  const [loading, setLoading] = useState(false); // Estado para controlar la visibilidad de la barra y mensaje

  const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'TRABAJADOR', 'DEPENDENCIA', 'UBICACION', 'FECHA_COMPRA', 'FECHA_ALTA'];

  const handleFileUpload = (e) => {
    setProgress(10); // Progreso inicial
    setLoading(true); // Inicia la carga (barra y mensaje visibles)
    const file = e.target.files[0];

    if (!file) {
      alert('Por favor seleccionar un archivo.');
      document.querySelector('input[type="file"]').value = '';
      setProgress(0); // Restablecer progreso si hay error
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Por favor, carga un archivo de formato Excel.');
      document.querySelector('input[type="file"]').value = '';
      setProgress(0); // Restablecer progreso si hay error
      return;
    }

    setProgress(30); // Progreso después de validar el archivo

    const reader = new FileReader();
    reader.onload = (event) => {
      setProgress(50); // Progreso mientras se procesa el archivo
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheets = {};

      let isValid = true; // Flag para validar todas las hojas

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Validar columnas y códigos patrimoniales
        if (
          !validateHeaderColumns(sheetData, expectedColumns, setErrorMessage, setShowModalButton) ||
          !validatePatrimonialCodes(sheetData, setErrorMessage, setShowModalButton) ||
          !validateDateColumns(sheetData, setErrorMessage, setShowModalButton)

        ) {
          isValid = false;
          return;
        }

        sheets[sheetName] = sheetData;
      });

      if (!isValid) {
        document.querySelector('input[type="file"]').value = ''; // Limpiar archivo cargado
        setProgress(0); // Restablecer progreso si la validación falla
        setLoading(false); // Detener la carga si hay error
        return; // No actualizar estado si hay errores
      }
      setSheetsData(sheets);
      setCurrentSheet(workbook.SheetNames[0]); // Default to the first sheet
      setProgress(100); // Completar progreso

      // Mostrar mensaje de archivo cargado y luego ocultarlo
      setFileLoaded(true);
      setTimeout(() => {
        setFileLoaded(false);
        setLoading(false); // Ocultar la barra y el mensaje después de 3 segundos
      }, 2000); // El mensaje desaparece después de 3 segundos
    };

    reader.readAsArrayBuffer(file);
  };

  // Validar durante edición directa en la grilla
  const updateCellValue = (sheetName, rowIndex, colIndex, newValue) => {
    setSheetsData((prevData) => {
      const updatedData = { ...prevData }; // Crear una copia del estado actual
      const sheet = updatedData[sheetName].map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((cell, cIndex) => {
            const columnName = updatedData[sheetName][0][cIndex]; // Nombre de la columna

            // Validar CODIGO_PATRIMONIAL
            if (columnName === 'CODIGO_PATRIMONIAL' && !/^\d{1,12}$/.test(newValue)) {
              Swal.fire({
                title: 'Código inválido',
                text: 'El código debe contener solo números y tener máximo 12 dígitos.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
              });
              return cell; // No actualizar si es inválido
            }

            // Validar FECHA_COMPRA y FECHA_ALTA con formato más estricto
            if (
              (columnName === 'FECHA_COMPRA' || columnName === 'FECHA_ALTA') &&
              !/^(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})$/.test(newValue) // Formatos permitidos: YYYY-MM-DD o DD/MM/YYYY
            ) {
              Swal.fire({
                title: 'Fecha inválida',
                text: 'La fecha debe tener un formato similar a YYYY-MM-DD o DD/MM/YYYY.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
              });
              return cell; // No actualizar si es inválido
            }

            return cIndex === colIndex ? newValue : cell; // Actualizar solo la celda específica
          });
        }
        return row; // Devolver la fila intacta si no coincide
      });
      updatedData[sheetName] = sheet; // Actualizar la hoja específica
      return updatedData; // Devolver los datos actualizados
    });
  };

  const sendDataToDatabase = async () => {
    const allData = Object.values(sheetsData).flatMap((sheetData) => {
      const headers = sheetData[0]; // First row as headers
      if (!headers) return []; // Skip if no headers
      return sheetData
        .slice(1) // Skip the header row
        .filter((row) => row.some((cell) => cell && cell.toString().trim() !== '')) // Exclude empty rows
        .map((row) =>
          row.reduce((acc, cell, index) => {
            acc[headers[index]] = cell || ''; // Map headers to cell values
            return acc;
          }, {})
        );
    });

    // Validar celdas vacías
    if (!validateEmptyCells(allData, expectedColumns, setErrorMessage, setShowModalButton)) {
      return; // No proceder si hay celdas vacías
    }

    try {
      // console.log("DATA RESPONSE:", allData)
      // throw Error
      
      // Enviando los datos al backend via Axios
      const response = await axios.post(`${URI_ITEMS}/imported`, { data: allData });


      // Handling response from the backend
      if (response.status === 200) {
        alert('Datos enviados correctamente');
      } else {
        alert('Error: ' + response.data.message);
      }

      console.log('Datos enviados:', JSON.stringify(allData));
      setSheetsData({}); // Reset data after sending
      document.querySelector('input[type="file"]').value = ''; // Clear the file input

    } catch (error) {
      Swal.fire({
        title: 'Error al enviar los datos.',
        text: 'Uno o más CODIGOS_PATRIMONIALES YA EXISTE en la base de datos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      // alert(`Hubo un problema al . \nUno o más CODIGOS_PATRIMONIALES ya existen registrados en la base de datos.`);
      // console.error("DATASHEET ERROR:", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <ModalComp />
      <div className="mb-4">
        <h3 className="text-primary fw-bold">Cargar Archivo Excel</h3>
        <div className="text-secondary fw-bold">
          Asegúrese de que el archivo coincida con el formato requerido.
          <TemplateExcelComp />
        </div>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <input
          type="file"
          onChange={handleFileUpload}
          className="form-control"
          style={{ maxWidth: '300px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
        />
      </div>

      {/* Barra de Progreso */}
      {loading && progress > 0 && (
        <div className="progress mb-3" style={{ height: '20px' }}>
          <div
            className="progress-bar progress-bar-striped bg-success"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Mensaje de archivo cargado */}
      {fileLoaded && (
        <div className="alert alert-success text-center" role="alert">
          <strong>Archivo cargado con éxito!</strong>
        </div>
      )}


      {errorMessage && (
        <div
          className="alert alert-danger text-center"
          dangerouslySetInnerHTML={{ __html: errorMessage }}
        ></div>
      )}

      {showModalButton && (
        <div className="text-center mt-2">
          <ErrorModalComp />
        </div>
      )}

      {Object.keys(sheetsData).length > 0 && (
        <div>
          <ul className="nav nav-tabs">
            {Object.keys(sheetsData).map((sheetName) => (
              <li key={sheetName} className="nav-item">
                <button
                  className={`nav-link ${currentSheet === sheetName ? 'active' : ''}`}
                  onClick={() => setCurrentSheet(sheetName)}
                >
                  {sheetName}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Spreadsheet
              data={sheetsData[currentSheet]?.map((row, rowIndex) =>
                row.map((cell, colIndex) => ({
                  value: cell || '',
                  onChange: (e) => updateCellValue(currentSheet, rowIndex, colIndex, e.target.value),
                }))
              ) || []}
            />
          </div>

          <div className="text-center mt-1 mb-3">
            <button
              onClick={sendDataToDatabase}
              className="btn btn-primary fw-bold"
              style={{ maxWidth: '200px' }}
            >
              Guardar Datos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridImportedComp;
