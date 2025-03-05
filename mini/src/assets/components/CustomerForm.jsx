import { useRef, useState } from "react";
import axios from 'axios';

const CustomerForm = () => {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                await axios.post('http://127.0.0.1:5000/customer', { name, email, phone });
                setSuccessMessage('Customer added/edited successfully!');
                setErrors({});
                // Reset form fields
                nameRef.current.value = '';
                emailRef.current.value = '';
                phoneRef.current.value = '';
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
            <h3>Add/Edit Customer</h3>
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
            <button type="submit" disabled={isLoading}>Submit</button>
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </form>
    );
}

export default CustomerForm;
