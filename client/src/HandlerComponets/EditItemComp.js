import React, { useState } from "react";
import DatePicker from "react-datepicker";

const EditItemComp = () => {
    // Estados para los inputs editables
    const [trabajador, setTrabajador] = useState("");
    const [dependencia, setDependencia] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [fechaAlta, setFechaAlta] = useState(null);
    const [fechaCompra, setFechaCompra] = useState(null);
    const [disposicion, setDisposicion] = useState(1); // 1 = Funcional, 0 = No funcional
    const [situacion, setSituacion] = useState(1); // 1 = Verificado, 0 = Faltante
    const [estadoConservacion, setEstadoConservacion] = useState("");

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Editar Item</h3>
            <form>
                <div className="mb-3">
                    <label className="form-label">Código Patrimonial</label>
                    <input
                        type="text"
                        className="form-control"
                        value="12345" // Valor fijo solo para mostrar
                        readOnly
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Trabajador</label>
                    <input
                        type="text"
                        className="form-control"
                        value={trabajador}
                        onChange={(e) => setTrabajador(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Dependencia</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dependencia}
                        onChange={(e) => setDependencia(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input
                        type="text"
                        className="form-control"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha de Registro</label>
                    <input
                        type="text"
                        className="form-control"
                        value="2024-11-22" // Valor fijo para ejemplo
                        readOnly
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha Alta</label>
                    <DatePicker
                        selected={fechaAlta}
                        onChange={(date) => setFechaAlta(date)}
                        className="form-control"
                        placeholderText="Seleccione una fecha"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha Compra</label>
                    <DatePicker
                        selected={fechaCompra}
                        onChange={(date) => setFechaCompra(date)}
                        className="form-control"
                        placeholderText="Seleccione una fecha"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <div>
                        <input type="radio" id="flexRadioDisabled" value="1" checked readOnly />{" "}
                        Patrimonizado
                        <input
                            type="radio"
                            for="flexRadioDisabled"
                            value="0"
                            className="ms-3"
                            readOnly
                            disabled
                        />{" "}
                        No Patrimonizado
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Disposición</label>
                    <div>
                        <input
                            type="radio"
                            value="1"
                            checked={disposicion === 1}
                            onChange={() => setDisposicion(1)}
                        />{" "}
                        Funcional
                        <input
                            type="radio"
                            value="0"
                            className="ms-3"
                            checked={disposicion === 0}
                            onChange={() => setDisposicion(0)}
                        />{" "}
                        No funcional
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Situación</label>
                    <div>
                        <input
                            type="radio"
                            value="1"
                            checked={situacion === 1}
                            onChange={() => setSituacion(1)}
                        />{" "}
                        Verificado
                        <input
                            type="radio"
                            value="0"
                            className="ms-3"
                            checked={situacion === 0}
                            onChange={() => setSituacion(0)}
                        />{" "}
                        Faltante
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado de Conservación</label>
                    <select
                        className="form-select"
                        value={estadoConservacion}
                        onChange={(e) => setEstadoConservacion(e.target.value)}
                    >
                        <option value="">Seleccione...</option>
                        <option value="1">Bueno</option>
                        <option value="2">Malo</option>
                        <option value="3">Regular</option>
                    </select>
                </div>

                <button type="button" className="btn btn-primary">
                    Actualizar
                </button>
            </form>
        </div>
    );
};

export default EditItemComp;
