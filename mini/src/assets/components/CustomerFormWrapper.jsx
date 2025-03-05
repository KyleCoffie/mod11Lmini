import { useParams } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import EditCustomerForm from './EditCustomerForm';

function CustomerFormWrapper() {
    let params = useParams();

    return params.customer_id ? <EditCustomerForm /> : <CustomerForm />;
}

export default CustomerFormWrapper;
