import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCustomerForm = () => {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { customer_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomer = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:5000/customer/${customer_id}`);
                nameRef.current.value = response.data.name;
                emailRef.current.value = response.data.email;
                phoneRef.current.value = response.data.phone;
                setErrors({});
            } catch (error) {
                console.error('Error fetching customer: ', error);
                setErrors({ submit: 'Error fetching customer. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomer();
    }, [customer_id]);

    const validateForm = () => {
        const errors = {};
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        if (!name) errors.name = 'Enter your name please';
        if (!email) errors.email = 'Enter your email please';
        if (!phone) errors.phone = 'Enter your phone please';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const name = nameRef.current.value;
            const email = emailRef.current.value;
            const phone = phoneRef.current.value;

            try {
                await axios.put(`http://127.0.0.1:5000/customer/${customer_id}`, { name, email, phone });
                setSuccessMessage('Customer updated successfully!');
                setErrors({});
                navigate('/customers');
            } catch (error) {
                console.error('Error submitting customer: ', error);
                setErrors({ submit: 'Error submitting customer. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit Customer</h3>
            {isLoading && <div>Loading...</div>}
            <label>
                Name:
                <input type="text" ref={nameRef} />
                {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </label>
            <br />
            <label>
                Email:
                <input type="email" ref={emailRef} />
                {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </label>
            <br />
            <label>
                Phone:
                <input type="tel" ref={phoneRef} />
                {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
            </label>
            <br />
            <button type="submit" disabled={isLoading}>Update</button>
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </form>
    );
}

export default EditCustomerForm;
