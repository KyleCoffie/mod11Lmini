import { number, func } from 'prop-types';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API_BASE_URL from '../../config';

const OrderList = ({ customerId, onOrderSelect, onEditOrder, onOrderDeleted }) => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const deleteOrder = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/order/${id}`);
            console.log('Delete response:', response);
            onOrderDeleted();
        } catch (error) {
            console.error('Error deleting order:', error.response ? error.response.data : error.message);
            setError('Error deleting order. Please try again.');
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (customerId) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`${API_BASE_URL}/order?customerId=${customerId}`);
                    setOrders(response.data);
                    setError('');
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    setError('Error fetching order data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchOrders();
    }, [customerId]);

    return (
        <div className='order-list'>
            <h3>Orders</h3>
            {isLoading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {orders.map(order => (
                    <li key={order.id} onClick={() => onOrderSelect(order.id)}>
                        Order Id: {order.id}, Date: {order.date}
                        <button onClick={() => onEditOrder(order)}>Edit</button>
                        <button onClick={() => deleteOrder(order.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

OrderList.propTypes = {
    customerId: number,
    onOrderSelect: PropTypes.func.isRequired,
    onEditOrder: func.isRequired,
    onOrderDeleted: PropTypes.func.isRequired,
};

export default OrderList;
