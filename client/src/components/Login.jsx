import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    await login();
  }

  return (
    <div className="min-h-screen flex  justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign In</h2>
          <div className="mt-2">
            <div className="w-16 h-1 bg-gray-300 mx-auto"></div>
          </div>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password Link */}
          {/* <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none"
            >
              Forgot your password?
            </button>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
          >
            Sign In
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Not registered?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
              >
                Register
              </button>
            </p>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mt-4">
            Secure login with encrypted credentials
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;