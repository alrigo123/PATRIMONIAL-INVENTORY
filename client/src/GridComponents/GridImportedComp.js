import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Spreadsheet from 'react-spreadsheet';
import axios from 'axios';

// Import components
import ModalComp from './ModalComp';
import ErrorModalComp from './ErrorModalComp';
import TemplateExcelComp from './TemplateExcelComp';

const GridImportedComp = () => {
  const [sheetsData, setSheetsData] = useState({});
  const [currentSheet, setCurrentSheet] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModalButton, setShowModalButton] = useState(false);

  const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION',
    'TRABAJADOR', 'DEPENDENCIA', 'UBICACION',
    'FECHA_COMPRA', 'FECHA_ALTA'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert('Por favor seleccionar un archivo.');
      document.querySelector('input[type="file"]').value = '';
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Por favor, carga un archivo de formato Excel.');
      document.querySelector('input[type="file"]').value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheets = {};

      let isValid = true; // Flag para validar todas las hojas

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Validar columnas de la hoja
        if (!validateColumns(sheetData)) {
          isValid = false;
          return; // Detener procesamiento de esta hoja
        }

        sheets[sheetName] = sheetData;
      });

      if (!isValid) {
        document.querySelector('input[type="file"]').value = ''; // Limpiar archivo cargado
        return; // No actualizar estado si hay errores
      }

      setSheetsData(sheets);
      setCurrentSheet(workbook.SheetNames[0]); // Default to the first sheet
    };

    reader.readAsArrayBuffer(file);
  };

  const validateColumns = (sheetData) => {
    const uploadedColumns = sheetData[0]; // Headers
    const missingColumns = expectedColumns.filter((col) => !uploadedColumns.includes(col));
    const extraColumns = uploadedColumns.filter((col) => !expectedColumns.includes(col));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
      let error = 'El archivo no sigue el formato de campos requerido.<br>';
      if (missingColumns.length > 0) {
        error += `En su archivo faltan las columnas: <b>${missingColumns.join(', ')}</b>.<br>`;
      }
      if (extraColumns.length > 0) {
        error += `Su archivo contiene las columnas: <b>${extraColumns.join(', ')}</b>.`;
      }
      setErrorMessage(error);
      setShowModalButton(true);
      return false;
    }

    setErrorMessage('');
    setShowModalButton(false);
    return true;
  };

  const updateCellValue = (sheetName, rowIndex, colIndex, newValue) => {
    setSheetsData((prevData) => {
      const updatedData = { ...prevData };
      const sheet = updatedData[sheetName].map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) => (cIndex === colIndex ? newValue : cell))
          : row
      );
      updatedData[sheetName] = sheet;
      return updatedData;
    });
  };

  const sendDataToDatabase = async () => {
    try {
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

      // Sending the data to the backend via Axios
      const response = await axios.post('http://localhost:3030/items/imported', { data: allData });

      // Handling response from the backend
      if (response.status === 200) {
        alert('Datos enviados correctamente');
      } else {
        alert('Error: ' + response.data.message);
      }

      console.log('Datos enviados:', JSON.stringify(allData));
      setSheetsData([]);
      document.querySelector('input[type="file"]').value = ''; // Clear the file input

    } catch (error) {
      alert('Hubo un problema al enviar los datos a la Base de Datos. \nExisten valores vacios en el archivo.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      {/* CALL COMPONENT TO INIT WHEN PAGE IS LOADING */}
      <ModalComp />
      <div className="mb-4">
        <h3 className="text-primary fw-bold">Cargar Archivo Excel</h3>
        <div className="text-secondary fw-bold">
          Asegúrese de que el archivo coincida con el formato requerido.
          {/* EXCEL TEMPLATE */}
          <TemplateExcelComp />
        </div>
      </div>
      {/* INPUT FILE */}
      <div className="d-flex justify-content-center mb-3">
        <input
          type="file"
          onChange={handleFileUpload}
          className="form-control"
          style={{ maxWidth: '300px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
        />
      </div>
      {/* ERROR MESSAGE IF DATA IS NOT CORRECT */}
      {errorMessage && (
        <div
          className="alert alert-danger text-center"
          dangerouslySetInnerHTML={{ __html: errorMessage }}
        ></div>
      )}
      {/* SHOW BUTTON OF MODAL */}
      {showModalButton && (
        <div className="text-center mt-2">
          <ErrorModalComp />
        </div>
      )}
      {/* PRINT EXCEL FILE */}
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
              data={sheetsData[currentSheet]?.map((row, rowIndex) => // Aquí se agrega rowIndex
                row.map((cell, colIndex) => ({
                  value: cell || '',
                  onChange: (e) =>
                    updateCellValue(currentSheet, rowIndex, colIndex, e.target.value), // Ahora rowIndex está definido
                }))
              ) || []}
              onChange={(data) => {
                console.log('Datos actualizados:', data);
              }}
            />
          </div>
          {/* BUTTON TO SEND TO DATABASE */}
          <div className="text-center mt-1 mb-3">
            <button
              onClick={sendDataToDatabase}
              className="btn btn-primary fw-bold"
              style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '5px' }}
            >
              Enviar archivo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridImportedComp;

