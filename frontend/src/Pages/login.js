import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD1dsZ590gGskokLvT40AlvpBfClaEAECk",
    authDomain: "yemek-asistani.firebaseapp.com",
    databaseURL: "https://yemek-asistani-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yemek-asistani",
    storageBucket: "yemek-asistani.appspot.com",
    messagingSenderId: "335909231649",
    appId: "1:335909231649:web:2da483d625eed3339bd760",
    measurementId: "G-T86BVWV371"
};

const my_firebase = initializeApp(firebaseConfig);

const Login = () => {
  const navigate = useNavigate()
  const auth = getAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      //const response = await axios.post('http://127.0.0.1:5000/login', formData);
      //console.log(response.data);
      //if (response.data.success) {
        signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then(async (userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const uid = user.uid;
          auth.currentUser.getIdToken(true).then(function(idToken) {
            formData['idToken'] = idToken
          }).catch(function(error) {
            console.error('Login failed:', error);
          });;
          try {
            formData['uid'] = uid
            const response = await axios.post('http://127.0.0.1:5000/login', formData);
            if(response.data){
              navigate('/');
            }
          } catch (error) {
            console.error('Login failed:', error);
          }
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
        
      //}
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/Signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Have you registered yet?
              </Link>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login