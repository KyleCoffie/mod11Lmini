import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import  API_BASE_URL  from '../../config';

const EditOrderForm = ({ orderId, onOrderUpdated }) => {
    const customerIdRef = useRef(null);
    const productIdRef = useRef(null);
    const quantityRef = useRef(null);
    const orderDateRef = useRef(null);
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
                const order = response.data;
                customerIdRef.current.value = order.customerId;
                productIdRef.current.value = order.productId;
                quantityRef.current.value = order.quantity;
                orderDateRef.current.value = order.orderDate;
                setExpectedDeliveryDate(order.expectedDeliveryDate);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setErrors({ fetch: 'Error fetching order details. Please try again.' });
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    useEffect(() => {
        if (orderDateRef.current && orderDateRef.current.value) {
            const orderDate = new Date(orderDateRef.current.value);
            const deliveryDate = new Date(orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + 14); // Add 14 days for expected delivery
            setExpectedDeliveryDate(deliveryDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }
    }, [orderDateRef.current ? orderDateRef.current.value : null]); 

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

            const orderData = { customerId, productId, quantity, orderDate, expectedDeliveryDate };
            console.log('Submitting order data:', orderData); // Add logging

            try {
                const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, orderData);
                console.log('Order updated successfully:', response.data);
                setSuccessMessage('Order updated successfully!');
                setErrors({});
                onOrderUpdated();
            } catch (error) {
                console.error('Error updating order:', error.response ? error.response.data : error.message);
                setErrors({ submit: 'Error updating order. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit Order</h3>
            {isLoading && <div>Loading...</div>}
            {errors.fetch && <div style={{ color: 'red' }}>{errors.fetch}</div>}
            <label>
                Customer ID:
                <input type="number" ref={customerIdRef} />
                {errors.customerId && <div style={{ color: 'red' }}>{errors.customerId}</div>}
            </label>
            <br />
            <label>
                Product ID:
                <input type="number" ref={productIdRef} />
                {errors.productId && <div style={{ color: 'red' }}>{errors.productId}</div>}
            </label>
            <br />
            <label>
                Quantity:
                <input type="number" ref={quantityRef} />
                {errors.quantity && <div style={{ color: 'red' }}>{errors.quantity}</div>}
            </label>
            <br />
            <label>
                Order Date:
                <input type="date" ref={orderDateRef} />
                {errors.orderDate && <div style={{ color: 'red' }}>{errors.orderDate}</div>}
            </label>
            <br />
            <label>
                Expected Delivery Date:
                <input type="date" value={expectedDeliveryDate} readOnly />
                {errors.expectedDeliveryDate && <div style={{ color:'red' }}>{errors.expectedDeliveryDate}</div>}
            </label>
            <br />
            <button type="submit" disabled={isLoading}>Submit</button>
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </form>
    );
};

export default EditOrderForm;