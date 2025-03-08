import { useRef, useState } from 'react';
import axios from 'axios';
import { Form, Alert,Button, Container } from 'react-bootstrap';
import API_BASE_URL from '../../config';

const ProductForm = () => {
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const errors = {};
        const name = nameRef.current.value;
        const price= priceRef.current.value;
        if (!name) errors.name ='Product name is required';
        if (!price || price <= 0) errors.price = 'Price must be a positive number';
        return errors; 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length ==0) {
            setIsLoading(true);
            const name = nameRef.current.value;
            const price = priceRef.current.value;
            console.log('Submitted product: ', { name, price });
            
            try {
                await axios.post(`${API_BASE_URL}/product`, { name, price });
                setSuccessMessage('Product added/edited successfully!');
                setErrors({});
                // Reset form fields
                nameRef.current.value = '';
                priceRef.current.value = '';
            } catch (error) {
                console.error('Error submitting product: ', error);
                setErrors({ submit: 'Error submitting product. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <Container>
            <h3>Add/Edit Product</h3>
            {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter product name" ref={nameRef} />
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" placeholder="Enter product price" ref={priceRef} />
                    {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Submit'}
                </Button>
            </Form>
        </Container>
    );
};

export default ProductForm;
