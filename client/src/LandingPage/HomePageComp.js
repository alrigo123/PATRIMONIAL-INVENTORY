import React from 'react'
import '../styles/Home.css'

const HomePageComp = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="title fw-semibold">Control Patrimonial - Gerencia Regional de Agricultura de Cusco</h1>
                <p className="description text-light">
                    Bienvenido al sistema de control patrimonial de la Gerencia Regional de Agricultura.
                    Aquí podra visualizar los items registrados y gestionar el control de bienes y recursos de la institución.
                </p>
                <div className="cta-container">
                    <a className="btn btn-success" href="/search">Ver Items Registrados</a>
                    <a className="btn btn-success m-2" href="/codigo-patrimonial">Registrar Nuevo Item</a>
                </div>
            </header>
        </div>
    )
}

export default HomePageComp
