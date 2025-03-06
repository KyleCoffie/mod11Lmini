import { useEffect, useState } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import API_BASE_URL from '../../config';

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/product/${productId}`);
                setProduct(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching product details: ', error);
                setError('Error fetching product details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!product) {
        return <div>Select a product to see the details</div>;
    }

    return (
        <div className="product-details">
            <h3>Product Details</h3>
            <p>ID: {product.id}</p>
            <p>Name: {product.name}</p>
            <p>Price: ${product.price}</p>
        </div>
    );
};

ProductDetails.propTypes = {
    productId: PropTypes.number
};

export default ProductDetails;
