import React from 'react';
import { Link } from 'react-router-dom';

import CodeSearchMod1 from '../Modules/CodeProperty/CodeSearchMod1';
import CodeSearchMod2 from '../Modules/CodeProperty/CodeSearchMod2';

const CodePropertyComp = () => {


    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 fw-bold">BUSCAR BIEN POR CÓDIGO PATRIMONIAL</h2>

            <Link to="/create" className="btn btn-primary mt-2 mb-2 fw-bolder">📦 AGREGAR NUEVO BIEN</Link>

            <CodeSearchMod1 />
            <hr />
            <CodeSearchMod2 />


        </div>
    );
};

export default CodePropertyComp;
