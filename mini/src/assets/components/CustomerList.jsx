import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from '../../config';

const CustomerList = ({ onCustomerSelect }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

const deleteCustomer = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/customer/${id}`);
            console.log('Delete response:', response);
        } catch (error) {
            console.error('Error deleting customer:', error.response ? error.response.data : error.message);
            setError('Error deleting customer. Please try again.');
        }
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/customer`);
                console.log(response)
                setCustomers(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching customer', error);
                setError('Error fetching customer data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (selectedCustomerId !== null) {
            console.log(`New customer selected: ID ${selectedCustomerId}`);
            const selectedCustomer = customers.find(customer => customer.customer_id === selectedCustomerId);
            setSelectedCustomerDetails(selectedCustomer);
        }
    }, [selectedCustomerId, customers]);

    const selectCustomer = (customer_id) => {
        setSelectedCustomerId(customer_id);
        onCustomerSelect(customer_id);
    };

    return (
        <div className="customer-list">
            <h3>Customers</h3>
            {isLoading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {customers.map(customer => (
                    <li key={customer.customer_id} onClick={() => selectCustomer(customer.customer_id)}>
                        <Link to={`/edit-customer/${customer.customer_id}`} >{customer.name}</Link>
                        {customer.name}
                        <button onClick={() => deleteCustomer(customer.customer_id)}>Delete</button>

                    </li>
                ))}
            </ul>
            {selectedCustomerDetails && (
                <div className="customer-details">
                    <h4>Customer Details</h4>
                    <p>ID: {selectedCustomerDetails.customer_id}</p>
                    <p>Name: {selectedCustomerDetails.name}</p>
                    <p>Email: {selectedCustomerDetails.email}</p>
                    <p>Phone: {selectedCustomerDetails.phone}</p>
                    <p>Orders: {selectedCustomerDetails.orders}</p>
                </div>
            )}
        </div>
    );
};

CustomerList.propTypes = {
    onCustomerSelect: PropTypes.func.isRequired,
};

export default CustomerList;
