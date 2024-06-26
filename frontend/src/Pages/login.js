import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import backgroundImage from './login_background.png'

const Login = ({ onLoginSuccess }) => {
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
          
          auth.currentUser.getIdToken(true).then(async function(idToken) {
            setTimeout(async function() {
              formData['idToken'] = idToken
              try {
                formData['uid'] = uid
                const response = await axios.post('http://127.0.0.1:5000/login', formData);
                if(response.data){
                  localStorage.setItem('user_id', uid);
                  onLoginSuccess();
                  navigate('/');
                }
              } catch (error) {
                console.error('Login failed:', error);
              }
            }, 500);
          }).catch(function(error) {
            console.error('Login failed:', error);
          });;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{
      backgroundImage:`url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: '100vw',
    height: '100vh'
    }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{color:"#97978D"}}>Log in</h2>
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
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900" style={{color:"#fff"}}>
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
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" style={{backgroundColor:"#97978D", color:"#1f2937"}}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login