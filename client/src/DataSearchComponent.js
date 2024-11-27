import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataSearchComponent = () => {
  const [data, setData] = useState([]); // Almacena los datos obtenidos de la API
  const [searchQuery, setSearchQuery] = useState(''); // Inicializado como un string vacío
  const [filteredResults, setFilteredResults] = useState([]); // Resultados filtrados para autocompletar
  const [showSuggestions, setShowSuggestions] = useState(false); // Controla la visibilidad del menú de sugerencias

  // Obtener datos de la API al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3030/export/general'); // Tu endpoint
        setData(response.data); // Suponiendo que los datos vienen en formato JSON
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filtrar resultados para autocompletar según la búsqueda
  useEffect(() => {
    const query = searchQuery || ''; // Asegurarse de que searchQuery sea un string
    if (query.trim() === '') {
      setFilteredResults([]);
      setShowSuggestions(false);
    } else {
      const results = data.filter((item) =>
        Object.values(item) // Convertir todos los valores del objeto a un array
          .join(' ') // Combinar los valores en un string
          .toLowerCase() // Convertir a minúsculas para coincidencias insensibles a mayúsculas
          .includes(query.toLowerCase())
      );
      setFilteredResults(results);
      setShowSuggestions(true);
    }
  }, [searchQuery, data]);

  // Manejar la selección de una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Cambiar el valor del input al seleccionado
    setShowSuggestions(false); // Ocultar las sugerencias
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Data Search with Autocomplete</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '5px',
          fontSize: '16px',
          position: 'relative',
        }}
      />
      {/* Menú desplegable de autocompletar */}
      {showSuggestions && (
        <ul
          style={{
            listStyle: 'none',
            padding: '10px',
            margin: 0,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            maxHeight: '150px',
            overflowY: 'auto',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
          }}
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#f2f2f2')
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
              >
                {item.name}
              </li>
            ))
          ) : (
            <li style={{ padding: '8px', color: '#888' }}>No results found</li>
          )}
        </ul>
      )}
      <h3>All Data</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map((item, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>
            <strong>{item.name}</strong> - {item.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataSearchComponent;
