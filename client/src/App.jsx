import { Route, Routes } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Authentication from './pages/Authentication';

import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';

import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import GeneralContextProvider from './context/GeneralContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Products from './components/Products';
import CompleteOrder from './pages/customer/CompleteOrder';
import Footer from './components/Footer';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/cart/fetch-cart");
      setCartItems(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <GeneralContextProvider>
      <Navbar />
    <div className="App min-h-screen ">
      
      <Routes>
        <Route path='/auth' element={<Authentication />} />
        <Route exact path='' element={<Home />} />
        <Route path='/cart' element={<Cart cartItems={cartItems} setCartItems={setCartItems} fetchCart={fetchCart} />} />
        <Route path="/checkout" element={<CompleteOrder />} />
        <Route path='/product/:id' element={<IndividualProduct />} />
        <Route path='/product' element={<Products />} />
        <Route path='/category/:category' element={<CategoryProducts />} />
        <Route path='/profile' element={<Profile />} />
        
        <Route path='/admin' element={<Admin />} />
        <Route path='/all-products' element={<AllProducts />} />
        <Route path='/all-users' element={<AllUsers />} />
        <Route path='/all-orders' element={<AllOrders />} />
        <Route path='/new-product' element={<NewProduct />} />
        <Route path='/update-product/:id' element={<UpdateProduct />} />
      </Routes>
    <Footer/>
    </div>
  </GeneralContextProvider>
  );
}

export default App;
