import { useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import EditProductForm from './EditProductForm';

function ProductFormWrapper() {
    let params = useParams();

    return params.product_id ? <EditProductForm /> : <ProductForm />;
}

export default ProductFormWrapper;
