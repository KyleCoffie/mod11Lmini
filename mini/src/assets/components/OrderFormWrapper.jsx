import { useParams } from 'react-router-dom';
import AddOrderForm from './OrderForm';
import EditOrderForm from './EditOrderForm';

function OrderFormWrapper() {
    let params = useParams();

    return params.customer_id ? <EditOrderForm /> : <AddOrderForm />;
}

export default OrderFormWrapper;
