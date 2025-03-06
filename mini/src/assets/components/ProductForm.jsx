import { useRef, useState } from 'react';
import axios from 'axios';
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
        <form onSubmit={handleSubmit}>
            <h3>Add/Edit Product</h3>
            {isLoading && <div>Loading...</div>}
            <label>
                Name:
                <input type="text" ref={nameRef} />
                {errors.name && <div style={{color: 'red' }}>{errors.name}</div>}
            </label>
            <br />
            <label>
                Price:
                <input type="number" ref={priceRef} />
                {errors.price && <div style={{color: 'red' }}>{errors.price}</div>}
            </label>
            <br />
            <button type="submit" disabled={isLoading}>Submit</button>
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </form>
    );
};

export default ProductForm;
