import React, { useState, useEffect } from 'react';
import Navbar from "./navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./Pages/profile";
import Recipe from "./Pages/recipe"
import Allergies from "./Pages/allergies";
import Diets from "./Pages/diets";
import Signup from "./Pages/signup";
import Login from "./Pages/login";
import axios from 'axios';
import {Rings} from 'react-loader-spinner';
import { initializeApp } from 'firebase/app';

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


// Set withCredentials to true for all requests
axios.defaults.withCredentials = true;


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  // Function to check the session
  const checkSession = () => {
    axios.get('http://127.0.0.1:5000/check_session')
      .then(response => {
        setIsLoggedIn(response.data.logged_in);
      })
      .catch(error => {
        console.error('An error occurred while checking the session:', error);
      });
  };

  useEffect(() => {
    // Check session when the component mounts
    checkSession();
  }, []);

  // Call this function after the user logs in successfully
  const handleLoginSuccess = () => {
    checkSession();
    console.log("here comes the sonne");
  };

  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn === null ? (
            // Render some loading indicator while the session check is in progress
            <Rings
              visible={true}
              height="140"
              width="140"
              color="#1f2937"
              ariaLabel="rings-loading"
              wrapperStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f7f7f700",
              }}
              wrapperClass=""
            />
          ) : isLoggedIn && (
            // User is logged in
            <Navbar onLogoutSuccess={handleLoginSuccess} />
        )}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Recipe/> : <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path="Allergies" element={isLoggedIn ? <Allergies/> : <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path="Diets" element={isLoggedIn ? <Diets/> : <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path="Profile" element={isLoggedIn ? <Profile/> : <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path="Signup" element={<Signup/>}/>
          <Route path="login" element={<Login onLoginSuccess={handleLoginSuccess}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
