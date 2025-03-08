import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import API_BASE_URL from '../../config';

const AddOrderForm = ({ onOrderAdded }) => {
    const customerIdRef = useRef(null);
    const productIdRef = useRef(null);
    const quantityRef = useRef(null);
    const orderDateRef = useRef(null);
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const calculateExpectedDeliveryDate = () => {
            if (orderDateRef.current && orderDateRef.current.value) {
                const orderDate = new Date(orderDateRef.current.value);
                const deliveryDate = new Date(orderDate);
                deliveryDate.setDate(deliveryDate.getDate() + 14); // Add 14 days for expected delivery
                setExpectedDeliveryDate(deliveryDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
            } else {
                setExpectedDeliveryDate(''); // Reset if order date is not set
            }
        };

        calculateExpectedDeliveryDate(); // Calculate on initial render

        // Add event listener to recalculate when order date changes
        const orderDateInput = orderDateRef.current;
        orderDateInput.addEventListener('change', calculateExpectedDeliveryDate);

        // Cleanup event listener on component unmount
        return () => {
            orderDateInput.removeEventListener('change', calculateExpectedDeliveryDate);
        };
    }, []);

    const validateForm = () => {
        const errors = {};
        const customerId = customerIdRef.current.value;
        const productId = productIdRef.current.value;
        const quantity = quantityRef.current.value;
        const orderDate = orderDateRef.current.value;

        if (!customerId) errors.customerId = 'Customer ID is required';
        if (!productId) errors.productId = 'Product ID is required';
        if (!quantity || quantity <= 0) errors.quantity = 'Quantity must be a positive number';
        if (!orderDate) errors.orderDate = 'Order date is required';
        if (!expectedDeliveryDate) errors.expectedDeliveryDate = 'Expected delivery date could not be calculated';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const customerId = customerIdRef.current.value;
            const productId = productIdRef.current.value;
            const quantity = quantityRef.current.value;
            const orderDate = orderDateRef.current.value;

             const orderData ={"customer_id": customerId,
                 "order_date":orderDate, 
                 "expected_delivery_date":expectedDeliveryDate, "product_id":productId, "quantity":quantity} 
            // const orderData = { customerId, orderDate, expectedDeliveryDate, productId, quantity  };
            console.log('Submitting order data:', orderData); // Add logging

            try {
                const response = await axios.post(`${API_BASE_URL}/order`, orderData);
                console.log('Order added successfully:', response.data);
                setSuccessMessage('Order added successfully!');
                setErrors({});
                onOrderAdded();
                // Reset form fields
                customerIdRef.current.value = '';
                productIdRef.current.value = '';
                quantityRef.current.value = '';
                orderDateRef.current.value = '';
                setExpectedDeliveryDate('');
            } catch (error) {
                console.error('Error submitting order:', error.response ? error.response.data : error.message);
                setErrors({ submit: 'Error submitting order. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <Container>
            <h3>Add/Edit Order</h3>
            {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter customer ID" ref={customerIdRef} />
                    {errors.customerId && <Form.Text className="text-danger">{errors.customerId}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Product ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter product ID" ref={productIdRef} />
                    {errors.productId && <Form.Text className="text-danger">{errors.productId}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" placeholder="Enter quantity" ref={quantityRef} />
                    {errors.quantity && <Form.Text className="text-danger">{errors.quantity}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter order date" ref={orderDateRef} />
                    {errors.orderDate && <Form.Text className="text-danger">{errors.orderDate}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Expected Delivery Date</Form.Label>
                    <Form.Control type="date" value={expectedDeliveryDate} readOnly />
                    {errors.expectedDeliveryDate && <Form.Text className="text-danger">{errors.expectedDeliveryDate}</Form.Text>}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Add Order'}
                </Button>
            </Form>
        </Container>
    );
};

AddOrderForm.propTypes = {
    onOrderAdded: PropTypes.func.isRequired,
};

export default AddOrderForm;