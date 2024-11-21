import React from "react";
import { slide as Menu } from "react-burger-menu";
import "../styles/Navbar.css";

const NavBarComp = () => {
    return (
        <Menu>
            <a className="menu-item" href="/">
                🏠 Home
            </a>
            <a className="menu-item" href="/items">
                📊 Ver Items
            </a>
            <a className="menu-item" href="/search">
                📂 Búsqueda General
            </a>
            <a className="menu-item" href="/codigo-patrimonial">
                🗃️ Búsqueda por Código Patrimonial
            </a>
            <a className="menu-item" href="/trabajador">
                👨‍🌾 Búsqueda por Trabajador
            </a>
            <a className="menu-item" href="/dependencia">
                🏢 Búsqueda por Dependencia
            </a>
            <a className="menu-item" href="/doble-busqueda">
                🔎 Doble Busqueda (Trabajador & Item)
            </a>
            <a className="menu-item" href="/import-excel">
                📚 Importar Datos
            </a>
        </Menu>
    )
}

export default NavBarComp
