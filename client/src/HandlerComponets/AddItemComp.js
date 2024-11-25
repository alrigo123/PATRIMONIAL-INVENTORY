import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const AddItemComp = () => {
    return (

        <div className="card-header bg-primary text-white text-center">
            <h3 className="mb-0">Editar Información de <strong>"a"</strong></h3>

            <form method="Post">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Código Patrimonial</label>
                    <input
                        type="text"
                        className="form-control"
                        value="aaaa"
                        readOnly
                        disabled
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        name="DESCRIPCION"
                        value="sadsadas"
                    />
                </div>
            </form>
        </div >
    );
};

export default AddItemComp;
