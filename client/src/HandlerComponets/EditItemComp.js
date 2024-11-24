import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'; // Importa SweetAlert2
import axios from 'axios';
import { APIgetItemById } from "../services/item.service";
import { formatToDateInput, formatToDatabase, parseDate } from "../utils/datesUtils";
const API_URL = 'http://localhost:3030/items';

const EditItemComp = () => {
    // Estados para los inputs editables
    const [formData, setFormData] = useState({
        CODIGO_PATRIMONIAL: '',
        TRABAJADOR: '',
        DEPENDENCIA: '',
        UBICACION: '',
        FECHA_REGISTRO: '',
        FECHA_ALTA: '',
        FECHA_COMPRA: '',
        ESTADO: '',
        DISPOSICION: '',
        SITUACION: ''
    });

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Para navegar a otra página después del submit
    const navigate = useNavigate();


    // Cargar datos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await APIgetItemById(id);
                setFormData({
                    CODIGO_PATRIMONIAL: data.CODIGO_PATRIMONIAL,
                    DESCRIPCION: data.DESCRIPCION || '',
                    TRABAJADOR: data.TRABAJADOR || '',
                    DEPENDENCIA: data.DEPENDENCIA || '',
                    UBICACION: data.UBICACION || '',
                    FECHA_REGISTRO: data.FECHA_REGISTRO,
                    FECHA_ALTA: data.FECHA_ALTA || '',
                    FECHA_COMPRA: data.FECHA_COMPRA || '',
                    ESTADO: data.ESTADO,
                    DISPOSICION: data.DISPOSICION,
                    SITUACION: data.SITUACION
                });
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'FECHA_COMPRA' || name === 'FECHA_ALTA') {
            // Convertir el valor a formato de base de datos antes de guardar
            const formattedValue = formatToDatabase(value);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue -- Prevenir el comportamiento por defecto del formulario

        try {
            // Convertir fechas al formato STRING antes de enviar (simulación de envío)
            const payload = {
                ...formData,
                FECHA_COMPRA: formData.FECHA_COMPRA ? formData.FECHA_COMPRA.toString() : 'Sin Registro',
                FECHA_ALTA: formData.FECHA_ALTA ? formData.FECHA_ALTA.toString() : 'Sin Registro',
            };
            console.log("Datos enviados a la base de datos:", payload);

            const response = await axios.put(`${API_URL}/edit/${payload.CODIGO_PATRIMONIAL}`, payload);

            if (response.status === 200) {
                // alert(response.data.message || 'Actualización exitosa');
                // // Redirigir a otra página después de éxito
                // navigate('/codigo-patrimonial'); 

                Swal.fire({
                    title: '¡Datos Actualizados!',
                    text: 'Los datos se han actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Después de que el usuario haga clic en "Aceptar", redirigir a otra página
                    navigate('/codigo-patrimonial'); // Cambia '/success-page' a la página a la que quieras redirigir
                });

            } else {
                // alert('Error de API');
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al actualizar los datos.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al intentar actualizar los datos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            if (err.response) {
                // El servidor respondió con un código de error
                alert(err.response.data.message || 'Error al actualizar el item');
            } else if (err.request) {
                // No hubo respuesta del servidor
                alert('No se recibió respuesta del servidor');
            } else {
                // Error al configurar la solicitud
                alert('Error al enviar la solicitud');
            }
            console.error('Error:', err);
            alert('Error:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;




    return (
        <div className="container mt-4">
            <h3 className="mb-4">EDITAR BIEN <strong>"{formData.DESCRIPCION}"</strong></h3>
            <form onSubmit={handleSubmit} className="p-3">
                <div className="mb-3">
                    <label className="form-label">Código Patrimonial</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.CODIGO_PATRIMONIAL} // Valor fijo solo para mostrar
                        readOnly
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        name="DESCRIPCION"
                        value={formData.DESCRIPCION}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Trabajador</label>
                    <input
                        type="text"
                        className="form-control"
                        name="TRABAJADOR"
                        value={formData.TRABAJADOR}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Dependencia</label>
                    <input
                        type="text"
                        className="form-control"
                        name="DEPENDENCIA"
                        value={formData.DEPENDENCIA}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input
                        type="text"
                        className="form-control"
                        name="UBICACION"
                        value={formData.UBICACION}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha de Registro (Escaneo codigo de barras)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="FECHA_REGISTRO"
                        value={formData.FECHA_REGISTRO ? parseDate(formData.FECHA_REGISTRO) : 'NO REGISTRADO'}
                        readOnly
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha Alta</label>
                    <input
                        type="date"
                        className="form-control"
                        name="FECHA_ALTA"
                        value={formatToDateInput(formData.FECHA_ALTA) || ''}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha Compra</label>
                    <input
                        type="date"
                        className="form-control"
                        name="FECHA_COMPRA"
                        value={formatToDateInput(formData.FECHA_COMPRA) || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <div className="form-check form-switch">
                        <input
                            className={`form-check-input ${formData.ESTADO === 1 ? 'bg-success' : 'bg-light'
                                }`}
                            type="checkbox"
                            id="estadoSwitch"
                            name="ESTADO"
                            checked={formData.ESTADO === 1}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    ESTADO: e.target.checked ? 1 : 0,
                                })
                            }
                            disabled
                        />
                        <label className="form-check-label fw-bolder" htmlFor="estadoSwitch">
                            {formData.ESTADO === 1 ? 'Patrimonizado' : 'No Patrimonizado'}
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Disposición</label>
                    <div className="form-check form-switch">
                        <input
                            className={`form-check-input ${formData.DISPOSICION === 1 ? 'bg-success' : 'bg-light'
                                }`}
                            type="checkbox"
                            id="disposicionSwitch"
                            name="DISPOSICION"
                            checked={formData.DISPOSICION === 1}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    DISPOSICION: e.target.checked ? 1 : 0,
                                })
                            }
                        />
                        <label className="form-check-label fw-bolder" htmlFor="disposicionSwitch">
                            {formData.DISPOSICION === 1 ? 'Funcional' : 'No Funcional'}
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Situación</label>
                    <div className="form-check form-switch">
                        <input
                            className={`form-check-input ${formData.SITUACION === 1 ? 'bg-success' : 'bg-light'
                                }`}
                            type="checkbox"
                            id="situacionSwitch"
                            name="SITUACION"
                            checked={formData.SITUACION === 1}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    SITUACION: e.target.checked ? 1 : 0,
                                })
                            }
                        />
                        <label className="form-check-label fw-bolder" htmlFor="situacionSwitch">
                            {formData.SITUACION === 1 ? 'Verificado' : 'Faltante'}
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado de Conservación</label>
                    {/* <select
                        className="form-select"
                        name="ESTADO_CONSERVACION"
                        value={formData.ESTADO_CONSERVACION}
                        onChange={handleInputChange}
                    >
                        <option value="1">Bueno</option>
                        <option value="2">Malo</option>
                        <option value="3">Regular</option>
                    </select> */}
                </div>

                <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                </button>

                <Link to="/codigo-patrimonial" className="btn btn-primary bt-sm d-flex align-items-center gap-2" >
                    Regresar
                </Link>
            </form>
        </div>
    );
};

export default EditItemComp;
