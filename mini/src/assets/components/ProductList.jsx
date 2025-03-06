import { number, func } from 'prop-types';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import axios from 'axios';
import API_BASE_URL from '../../config';

const ProductList = ({ onProductSelect, onEditProduct, onProductDeleted}) => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
            console.log('Delete response:', response);
            onProductDeleted(); // Call the onProductDeleted prop after successful deletion
        } catch (error) {
            console.error('Error deleting product:', error.response ? error.response.data : error.message);
            setError('Error deleting product. Please try again.');
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                setProducts(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching product data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProductId !== null) {
            console.log(`New Product selected: ID ${selectedProductId}`);
            const selectedProduct = products.find(product => product.product_id === selectedProductId);
            setSelectedProductDetails(selectedProduct);
        }
    }, [selectedProductId, products]);

    const selectProduct = (product_id) => {
        setSelectedProductId(product_id);
        onProductSelect(product_id);
    };

    return (
        <div className='product-list'>
            <h3>Products</h3>
            {isLoading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {products.map(product => (
                    <li key={product.product_id} onClick={() => selectProduct(product.product_id)}>
                        <Link to={`/edit-product/${product.product_id}`}>{product.name}</Link>
                        {product.name} (ID: {product.product_id})
                        <button onClick={() => onEditProduct(product)}>Edit</button>
                        <button onClick={() => deleteProduct(product.product_id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {selectedProductDetails && (
                <div className="product-details">
                    <h4>Product Details</h4>
                    <p>ID: {selectedProductDetails.product_id}</p>
                    <p>Name: {selectedProductDetails.name}</p>
                    <p>Price: {selectedProductDetails.price}</p>
                </div>
            )}
        </div>
    );
};

ProductList.propTypes = {
    orderId: number,
    onEditProduct: func.isRequired,
    onProductDeleted: func.isRequired,
    onProductSelect: PropTypes.func.isRequired
};

export default ProductList;
