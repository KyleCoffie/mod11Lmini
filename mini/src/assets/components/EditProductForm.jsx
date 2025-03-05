import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductForm = () => {
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { product_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:5000/product/${product_id}`);
                nameRef.current.value = response.data.name;
                priceRef.current.value = response.data.price;
                setErrors({});
            } catch (error) {
                console.error('Error fetching product: ', error);
                setErrors({ submit: 'Error fetching product. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [product_id]);

    const validateForm = () => {
        const errors = {};
        const name = nameRef.current.value;
        const price = priceRef.current.value;
        if (!name) errors.name = 'Enter your name please';
        if (!price) errors.price = 'Enter a price please';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const name = nameRef.current.value;
            const price = priceRef.current.value;

            try {
                await axios.put(`http://127.0.0.1:5000/product/${product_id}`, { name, price });
                setSuccessMessage('Product updated successfully!');
                setErrors({});
                navigate('/products');
            } catch (error) {
                console.error('Error submitting Product: ', error);
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
            <h3>Edit Product</h3>
            {isLoading && <div>Loading...</div>}
            <label>
                Name:
                <input type="text" ref={nameRef} />
                {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </label>
            <br />
            <label>
                Price:
                <input type="number" ref={priceRef} />
                {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
            </label>
            
            <button type="submit" disabled={isLoading}>Update</button>
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </form>
    );
}

export default EditProductForm;
