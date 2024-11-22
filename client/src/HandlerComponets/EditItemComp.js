import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from 'axios';
import { APIgetItemById } from "../services/item.service";

const API_URL = 'http://localhost:3000/items';


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


    // Cargar datos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await APIgetItemById(id);
                setFormData({
                    CODIGO_PATRIMONIAL: data.CODIGO_PATRIMONIAL,
                    TRABAJADOR: data.TRABAJADOR || '',
                    DEPENDENCIA: data.DEPENDENCIA || '',
                    UBICACION: data.UBICACION || '',
                    FECHA_REGISTRO: data.FECHA_REGISTRO || '',
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
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        try {
            const response = await axios.put(`${API_URL}/edit/${formData.CODIGO_PATRIMONIAL}`, formData);

            if (response.status === 200) {
                alert(response.data.message || 'Actualización exitosa');
            }
        } catch (err) {
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
        }
    };

    const send = ()=>{
        
    }


    return (
        <div className="container mt-4">
            <h3 className="mb-4">Editar Item</h3>
            <form onSubmit={handleSubmit}>
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
                    <label className="form-label">Fecha de Registro</label>
                    <input
                        type="text"
                        className="form-control"
                        name="FECHA_REGISTRO"
                        value={formData.FECHA_REGISTRO}
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
                        value={formData.FECHA_ALTA}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha Compra</label>
                    <input
                        type="date"
                        className="form-control"
                        name="FECHA_COMPRA"
                        value={formData.FECHA_COMPRA}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="ESTADO"
                                value="1"
                                checked={formData.ESTADO === 1}
                                disabled // Solo lectura
                            />
                            <label className="form-check-label">Patrimonizado</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="ESTADO"
                                value="0"
                                checked={formData.ESTADO === 0}
                                disabled // Solo lectura
                            />
                            <label className="form-check-label">No Patrimonizado</label>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Disposición</label>
                    <div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="DISPOSICION"
                                value="1"
                                checked={formData.DISPOSICION === 1}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Funcional</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="DISPOSICION"
                                value="0"
                                checked={formData.DISPOSICION === 0}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">No Funcional</label>
                        </div>
                    </div>
                </div>


                <div className="mb-3">
                    <label className="form-label">Situación</label>
                    <div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="SITUACION"
                                value="1"
                                checked={formData.SITUACION === 1}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Verificado</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="SITUACION"
                                value="0"
                                checked={formData.SITUACION === 0}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Faltante</label>
                        </div>
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
                    Actualizar
                </button>
            </form>
        </div>
    );
};

export default EditItemComp;
