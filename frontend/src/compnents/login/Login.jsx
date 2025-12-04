import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });

      console.log(response.data);

      localStorage.setItem('tokenUser', response.data.user.username);
      navigate(`/`);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const closeModal = () => {
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-zinc-50 to-red-100">
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform sm:max-w-lg sm:w-full">
            <div className="bg-red-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V7a1 1 0 112 0v3a1 1 0 01-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd"/></svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">Error</h3>
                  <p className="mt-2 text-sm text-gray-600">{error}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button onClick={closeModal} type="button" className="rounded-md bg-red-600 px-4 py-2 text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">Sign in to your account</h2>
        <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
          
          <input type="text" placeholder="Username" className="border p-2 rounded w-full"
            value={username} onChange={(e) => setUsername(e.target.value)} required />

          <input type="password" placeholder="Password" className="border p-2 rounded w-full"
            value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="bg-indigo-600 text-white p-2 rounded w-full">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
