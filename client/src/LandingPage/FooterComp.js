import React from 'react'
import '../styles/Footer.css'

const FooterComp = () => {
    return (
        <div>
            <footer className="footer">
                <p>Desarrollado por la Oficina de Informática</p>
                <p className='fw-bold'>&copy; {new Date().getFullYear()} GERAGRI CUSCO</p>
            </footer>
        </div>
    )
}

export default FooterComp
