import { Component } from "react";
import { Routes, Route } from "react-router-dom";
import CustomerList from "./assets/components/CustomerList";
import OrderList from './assets/components/OrderList';
import ProductList from './assets/components/ProductList';
import ProductDetails from './assets/components/ProductDetails'; // Import the new component
import CustomerFormWrapper from "./assets/components/CustomerFormWrapper";
import ProductFormWrapper from "./assets/components/ProductFormWrapper";
import NavigationBar from "./assets/components/NavigationBar";
import OrderFormWrapper from "./assets/components/OrderFormWrapper";
import './AppStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedCustomerId: null,
            selectedOrderId: null,
            selectedProductId: null
        };
    }

    handleCustomerSelect = (customerId) => {
        this.setState({ selectedCustomerId: customerId }); 
    }

    handleOrderSelect = (orderId) => {
        this.setState({ selectedOrderId: orderId });
    }

    handleOrderDeleted = () => {
        window.location.href = '/orders';
    }
    handleOrderAdded = () => {
        window.location.href = '/orders';
    }

    handleProductSelect = (productId) => {
        this.setState({ selectedProductId: productId });
    }

    handleEditProduct = (product) => {
        // Navigate to the edit product page
        window.location.href = `/edit-product/${product.product_id}`;
    }

    handleProductDeleted = () => {
        // Refresh the product list
        window.location.href = '/products';
    }

    render () {
        const { selectedCustomerId, selectedProductId } = this.state;

        return (
            <div className="app-container">
                <NavigationBar />
                <h1>E-Commerce API Mainframe</h1>
                <Routes>
                    <Route path="/add-customer" element={<CustomerFormWrapper />} />
                    <Route path="/edit-customer/:customer_id" element={<CustomerFormWrapper />} />
                    <Route path="/add-product" element={<ProductFormWrapper />} />
                    <Route path="/edit-product/:product_id" element={<ProductFormWrapper />} />
                    <Route path="/customers" element={<CustomerList onCustomerSelect={this.handleCustomerSelect} />} />
                    <Route path="/products" element={<ProductList 
                
                        onProductSelect={this.handleProductSelect}
                        onEditProduct={this.handleEditProduct}
                        onProductDeleted={this.handleProductDeleted}
                    />} />
                    <Route path="/product-details" element={<ProductDetails productId={selectedProductId} />} /> {/* New route */}
                    <Route path="/orders" element={<OrderList customerId={selectedCustomerId} onOrderSelect={this.handleOrderSelect} onOrderdeleted={this.handleOrderDeleted}/>} />
                    <Route path="/add-order" element={<OrderFormWrapper onOrderAdded={this.handleOrderAdded} />} /> {/* New route */}
                    <Route path="/edit-order" element={<OrderFormWrapper />} /> 
                </Routes>
            </div>
        );
    }
}

export default App;
