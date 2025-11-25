import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('customer'); // default to customer

  const [productSearch, setProductSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Optional: set baseURL if your backend is on a consistent port
  // axios.defaults.baseURL = 'http://localhost:3000';

  // Put interceptor in useEffect so it is registered once and ejected on cleanup
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => Promise.reject(error));

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      // ensure correct backend route/port
      const response = await axios.get('http://localhost:3000/api/cart/fetch-cart');
      // if the backend returns array of items, filter by userId
      setCartCount(Array.isArray(response.data) ? response.data.filter(item => item.userId === userId).length : 0);
    } catch (err) {
      console.error("Cart fetch error:", err.response?.data || err.message);
    }
  }

  const handleSearch = () => {
    navigate('#products-body');
  }

  // 🟢 LOGIN
  const login = async () => {
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const loginInputs = {
        email: email.trim(),
        password
      };

      console.log("Login payload sent:", loginInputs);

      const res = await axios.post('http://localhost:3000/api/users/login', loginInputs);

      console.log("Login response:", res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userType', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.usertype === 'customer') {
        navigate('/');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!!");
    }
  };

  // 🟢 REGISTER
  const register = async () => {
    // build payload inside function to avoid stale values
    const inputs = {
      username: username.trim(),
      email: email.trim(),
      usertype: usertype || 'customer',
      password
    };

    // basic frontend validation
    if (!inputs.username || !inputs.email || !inputs.password) {
      alert("Please fill username, email and password.");
      return;
    }

    try {
      console.log("Register payload:", inputs);
      const res = await axios.post('http://localhost:3000/api/users/register', inputs);

      console.log("Register response:", res.data);

      // Save user data + token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userType', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.usertype === 'customer') {
        navigate('/');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      // show server-sent message if present
      alert(err.response?.data?.message || "Registration failed!!");
    }
  }

  // 🟢 LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <GeneralContext.Provider
      value={{
        login, register, logout,
        username, setUsername,
        email, setEmail,
        password, setPassword,
        usertype, setUsertype,
        productSearch, setProductSearch,
        handleSearch,
        cartCount,
        setCartCount,
        fetchCartCount
      }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider;
