import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, signOut } from "firebase/auth";

function Navbar({onLogoutSuccess}) {
  const navigate = useNavigate()
  const auth = getAuth();

  const handleLogout = async () => {
    signOut(auth).then(async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/logout');
        if(response.data)
          localStorage.removeItem('user_id');
        // Sign-out successful.
        console.log('User logged out!');
        onLogoutSuccess();
        navigate('/login');
      } catch (error) {
        // Handle any errors that occur during the logout process
        console.error('Logout failed:', error);
      }
    }).catch((error) => {
      // An error happened.
      console.error('Logout error:', error);
    });
  };
    return (
        <nav className="bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <span className="text-white font-semibold text-lg">Yemek Asistanım</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Recipe</Link>
                  <Link to="Allergies" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Allergies</Link>
                  <Link to="Diets" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Diets</Link>
                  <Link to="Profile" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={{backgroundColor:"rgb(20, 26, 36)"}}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
}

export default Navbar