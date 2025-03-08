import { useRef, useState } from "react";
import axios from 'axios';
import { Form, Button, Alert,Container } from 'react-bootstrap';
import API_BASE_URL from '../../config';

const CustomerForm = () => {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const errors = {};
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        if (!name) errors.name = 'Enter your name please';
        if (!email) errors.email = 'Enter your email please';
        if (!phone) errors.phone = 'Enter your phone please';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const name = nameRef.current.value;
            const email = emailRef.current.value;
            const phone = phoneRef.current.value;

            try {
                await axios.post(`${API_BASE_URL}/customer`, { name, email, phone });
                setSuccessMessage('Customer added/edited successfully!');
                setErrors({});
                // Reset form fields
                nameRef.current.value = '';
                emailRef.current.value = '';
                phoneRef.current.value = '';
            } catch (error) {
                console.error('Error submitting customer: ', error);
                setErrors({ submit: 'Error submitting customer. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <h3>Add/Edit Customer</h3>
                {isLoading && <div>Loading...</div>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
                <Form.Group>
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" ref={nameRef} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" ref={emailRef} />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone:</Form.Label>
                    <Form.Control type="text" ref={phoneRef} />
                    {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                </Form.Group>
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
}

export default CustomerForm;
