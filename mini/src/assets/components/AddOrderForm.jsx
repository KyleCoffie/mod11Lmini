import { useRef, useState } from "react";
import axios from 'axios';  
import API_BASE_URL from '../../config';
import PropTypes from 'prop-types';

const AddOrderForm = ({ onOrderAdded }) => {
    const customerIdRef = useRef(null);
    const orderDateRef = useRef(null);
    const productIdRef = useRef(null);
    const quantityRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const errors = {};
        const customerId = customerIdRef.current.value;
        const orderDate = orderDateRef.current.value;
        const productId = productIdRef.current.value;
        const quantity = quantityRef.current.value;

        if (!customerId) errors.customerId = 'Customer ID is required';
        if (!productId) errors.productId = 'Product ID is required';
        if (!quantity || quantity <= 0) errors.quantity = 'Quantity must be a positive number';
        if (!orderDate) errors.orderDate = 'Order date is required';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const customerId = customerIdRef.current.value;
            const orderDate = orderDateRef.current.value;
            const productId = productIdRef.current.value;
            const quantity = quantityRef.current.value;

            try {
                await axios.post(`${API_BASE_URL}/orders`, { customerId,orderDate,productId, quantity,  });
                setSuccessMessage('Order added successfully!');
                setErrors({});
                onOrderAdded();
                // Reset form fields
                customerIdRef.current.value = '';
                orderDateRef.current.value = '';
                productIdRef.current.value = '';
                quantityRef.current.value = '';
            } catch (error) {
                console.error('Error submitting order:', error);
                setErrors({ submit: 'Error submitting order. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add New Order</h3>
            {isLoading && <div>Loading...</div>}
            <label>
                Customer ID:
                <input type="number" ref={customerIdRef} />
                {errors.customerId && <div style={{color: 'red' }}>{errors.customerId}</div>}
            </label>
            <br />
            <label>
                Product ID:
                <input type="number" ref={productIdRef} />
                {errors.productId && <div style={{color: 'red' }}>{errors.productId}</div>}
            </label>
            <br />
            <label>
                Quantity:
                <input type="number" ref={quantityRef} />
                {errors.quantity && <div style={{color: 'red' }}>{errors.quantity}</div>}
            </label>
            <br />
            <label>
                Order Date:
                <input type="date" ref={orderDateRef} />
                {errors.orderDate && <div style={{color: 'red' }}>{errors.orderDate}</div>}
            </label>
            <br />
            <button type="submit" disabled={isLoading}>Submit</button>
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </form>
    );
};

AddOrderForm.propTypes = {
    onOrderAdded: PropTypes.func.isRequired,
};

export default AddOrderForm;
