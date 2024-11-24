import axios from 'axios';
import { useState, useEffect } from 'react';

import ExportReportsDispoMod from '../Modules/Export/ExportReportsDispoMod';
import ExportReportsStateMod from '../Modules/Export/ExportReportsStateMod';

const URI = 'http://localhost:3030/items';

const ShowItemsComp = () => {
    // State para almacenar los items
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0); // Total de registros
    const [page, setPage] = useState(1); // Página actual
    const [limit, setLimit] = useState(50); // Límite de registros por página

    // States para los filtros
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterDisposicion, setFilterDisposicion] = useState('all');


    // Obtener todos los items de la API con paginación
    const getItems = async () => {
        try {
            const response = await axios.get(URI, {
                params: { page, limit },
            });
            setItems(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    // Filtrar items considerando ambos filtros
    const filteredItems = items.filter((item) => {
        const estadoFilter =
            filterEstado === 'all' ||
            (filterEstado === 'registered' && item.ESTADO === 1) ||
            (filterEstado === 'not_registered' && item.ESTADO === 0);
        const disposicionFilter =
            filterDisposicion === 'all' ||
            (filterDisposicion === 'available' && item.DISPOSICION === 1) ||
            (filterDisposicion === 'not_available' && item.DISPOSICION === 0);
        return estadoFilter && disposicionFilter;
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col mt-3">

                    {/* Controles para seleccionar los filtros */}
                    <div className="row mt-2">
                        <div className="mb-3 col-5 text-start">
                            <label htmlFor="filter1" className="form-label fw-semibold">
                                <h5>Filtrar Por Estado</h5>
                            </label>
                            <select
                                id="filter1"
                                className="form-select fw-bolder"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="registered">Registrado</option>
                                <option value="not_registered">No Registrado</option>
                            </select>
                        </div>
                        <div className="mb-3 col-5 text-start">
                            <label htmlFor="filter2" className="form-label fw-semibold">
                                <h5>Filtrar Por Disposición</h5>
                            </label>
                            <select
                                id="filter2"
                                className="form-select fw-bolder"
                                value={filterDisposicion}
                                onChange={(e) => setFilterDisposicion(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="available">Disponibles</option>
                                <option value="not_available">No Disponibles</option>
                            </select>
                        </div>
                    </div>

                    {/* Selector de límite */}
                    <div className="d-flex align-items-center mb-3 flex-wrap">
                        <label className="me-2 fw-bold">Mostrar:</label>
                        <select
                            className="form-select w-auto me-3"
                            value={limit}
                            onChange={(e) => {
                                setLimit(parseInt(e.target.value));
                                setPage(1); // Resetear a la página 1
                            }}
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="me-3">registros por página</span>
                    </div>

                    {/* Botones para exportar reportes */}
                    <ExportReportsStateMod />
                    <ExportReportsDispoMod />

                    {/* TABLA DE DATOS */}
                    <table className="w-auto table table-striped table-bordered align-middle mt-3">
                        <thead className="table-primary">
                            <tr>
                                <th>N</th>
                                <th>Codigo Patrimonial</th>
                                <th>Descripcion</th>
                                <th>Dependencia</th>
                                <th>Trabajador</th>
                                <th>Ultima Fecha Registro</th>
                                <th>Fecha de Alta</th>
                                <th>Estado</th>
                                <th>Disposición</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.N}</td>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.FECHA_REGISTRO}</td>
                                    <td>{item.FECHA_ALTA}</td>
                                    <td>{item.ESTADO === 1 ? 'Registrado' : 'No Registrado'}</td>
                                    <td>{item.DISPOSICION === 1 ? 'Si' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Controles de paginación */}
                    <div className="d-flex justify-content-center align-items-center my-3">
                        <button
                            className="btn btn-primary fw-bold me-2"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            <i className="fas fa-arrow-left"></i> Anterior
                        </button>
                        <span className="mx-3">
                            <strong>Página {page}</strong> de <strong>{totalPages}</strong>
                        </span>
                        <button
                            className="btn btn-primary fw-bold ms-2"
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Siguiente <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowItemsComp;

