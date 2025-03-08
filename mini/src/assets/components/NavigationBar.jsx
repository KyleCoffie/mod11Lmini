import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

function NavigationBar() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">E-Commerce API Mainframe</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to='/add-customer' className='nav-link'> Add/Edit Customer</Link>
                    <Link to='/add-product' className='nav-link'> Add/Edit Product</Link>
                    <Link to='/add-order' className='nav-link'> Add Order</Link>
                    <Link to='/customers' className='nav-link'> All Customers</Link>
                    <Link to='/products' className='nav-link'> All Products</Link>
                    <Link to='/orders' className='nav-link'> All Orders</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>


        // <nav className='clearfix'>
        //     <Link to='/add-customer' > Add/Edit Customer</Link>
        //     <Link to='/add-product' > Add/Edit Product</Link>
        //     <Link to='/add-order' > Add Order</Link>
        //     <Link to='customers' > All Customers</Link>
        //     <Link to='products' > All Products</Link>
        //     <Link to='orders' > All Orders</Link>
        // </nav>
    )
}

export default NavigationBar