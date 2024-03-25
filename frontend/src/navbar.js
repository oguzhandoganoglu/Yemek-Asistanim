import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
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
                  
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
}

export default Navbar