import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <nav className='clearfix'>
            <Link to='/add-customer' > Add/Edit Customer</Link>
            <Link to='/add-product' > Add/Edit Product</Link>
            <Link to='customers' > All Customers</Link>
            <Link to='products' > All Products</Link>
            <Link to='orders' > All Orders</Link>
        </nav>
    )
}

export default NavigationBar