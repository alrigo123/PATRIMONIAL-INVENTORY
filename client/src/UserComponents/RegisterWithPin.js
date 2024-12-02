import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, FormControl, Alert } from "react-bootstrap";

const RegisterWithPin = () => {
    const [pin, setPin] = useState(""); // Estado para el PIN
    const [pinAttempts, setPinAttempts] = useState(0); // Contador de intentos de PIN
    const [isPinValid, setIsPinValid] = useState(false); // Estado para controlar si el PIN es correcto
    const [isFormVisible, setIsFormVisible] = useState(false); // Estado para mostrar el formulario de registro

    const [formData, setFormData] = useState({
        user: '',
        name: '',
        last_name: '',
        email: '',
        password: '',
    });


    const [formErrors, setFormErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error general
    const navigate = useNavigate();

    // Función para manejar la validación del PIN
    const validatePin = () => {
        if (!pin.trim()) { // Verificar si el campo del PIN está vacío
            setErrorMessage("El PIN es obligatorio.");
            return;
        }
        if (pin === process.env.REACT_APP_SECURITY_PIN) {
            setIsPinValid(true);
            setIsFormVisible(true); // Mostrar el formulario de registro si el PIN es correcto
        } else {
            setPinAttempts(pinAttempts + 1);
            if (pinAttempts >= 2) {
                navigate("/"); // Si se fallaron 3 veces, redirigir al menú principal
            } else {
                setErrorMessage("PIN incorrecto. Intentos restantes: " + (3 - pinAttempts - 1));
                setPin('');
            }
        }
    };

    // Función para manejar el envío del formulario de validación del PIN
    const handlePinSubmit = (e) => {
        e.preventDefault(); // Prevenir la recarga de la página
        validatePin();
    };

    // Manejo del cambio de datos en los inputs
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validación del formulario
    const validateForm = () => {
        let errors = {};
        if (!formData.user) errors.user = 'El nombre de usuario es requerido';
        if (!formData.name) errors.name = 'El nombre es requerido';
        if (!formData.last_name) errors.last_name = 'El apellido es requerido';
        if (!formData.email) errors.email = 'El correo electrónico es requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'El correo no es válido';
        if (!formData.password) errors.password = 'La contraseña es requerida';
        return errors;
    };

    /// Manejo del envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            // Aquí puedes realizar la acción de registro, como enviar los datos a la base de datos
            alert('Usuario registrado correctamente');
        } else {
            setErrorMessage('Por favor, corrija los errores antes de enviar el formulario.');
        }
    };

    return (
        <>
            <Modal show={!isPinValid} onHide={() => navigate("/")}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Verificación de PIN</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePinSubmit}>
                        <Form.Group controlId="formPin">
                            <Form.Label>Ingresa el PIN de seguridad para registrar nuevo usuario</Form.Label>
                            <Form.Control
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="PIN de seguridad"
                                className="mb-2"
                                required
                            />
                        </Form.Group>

                        {errorMessage && <Alert className="fw-bold" variant="danger">{errorMessage}</Alert>}
                        <Button variant="primary" type="submit">
                            Validar PIN
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Si el PIN es válido, mostramos el formulario de registro */}
            {isFormVisible && (
                <Form onSubmit={handleSubmit}>
                    <h3>Registrar Nuevo Usuario</h3>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Nombre de Usuario</Form.Label>
                        <FormControl
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            isInvalid={!!formErrors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <FormControl
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            isInvalid={!!formErrors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <FormControl
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            isInvalid={!!formErrors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <FormControl
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleFormChange}
                            isInvalid={!!formErrors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="success" type="submit">
                        Registrar Usuario
                    </Button>
                </Form>
            )}
        </>
    );
};

export default RegisterWithPin;
