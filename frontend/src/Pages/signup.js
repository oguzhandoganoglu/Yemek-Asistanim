import React, { useState } from 'react'
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    allergies: {
      moluscs: false,
      egg: false,
      fish: false,
      lupin: false,
      soya: false,
      milk: false,
      peanuts: false,
      gluten: false,
      crustaceans: false,
      mustard: false,
      nuts: false,
      sesame: false,
      celery: false,
      sulphites: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        allergies: {
          ...prevState.allergies,
          [name]: checked
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, allergies } = formData;
    try{
      const response = await axios.post('http://127.0.0.1:5000/signup', {
        username,
        email,
        password,
        allergies
      });
      console.log('Registration successful:', response.data);
    }
    catch (error){
      console.log('Registration failed: ', error);
    }
    
    // Formu sıfırla
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      allergies: {
        moluscs: false,
        egg: false,
        fish: false,
        lupin: false,
        soya: false,
        milk: false,
        peanuts: false,
        gluten: false,
        crustaceans: false,
        mustard: false,
        nuts: false,
        sesame: false,
        celery: false,
        sulphites: false
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
            <h2 className="mt-6 text-center text-xl font-bold text-gray-900">Allergies</h2>
            <div className="grid grid-cols-3 gap-4">
              <div> 
                <input
                  type="checkbox"
                  id="moluscs"
                  name="moluscs"
                  checked={formData.allergies.moluscs}
                  onChange={handleChange}
                />
                <label htmlFor="moluscs" className="ml-2">Moluscs</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="egg"
                  name="egg"
                  checked={formData.allergies.egg}
                  onChange={handleChange}
                />
                <label htmlFor="egg" className="ml-2">Egg</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="fish"
                  name="fish"
                  checked={formData.allergies.fish}
                  onChange={handleChange}
                />
                <label htmlFor="fish" className="ml-2">Fish</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="lupin"
                  name="lupin"
                  checked={formData.allergies.lupin}
                  onChange={handleChange}
                />
                <label htmlFor="lupin" className="ml-2">Lupin</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="soya"
                  name="soya"
                  checked={formData.allergies.soya}
                  onChange={handleChange}
                />
                <label htmlFor="soya" className="ml-2">Soya</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="milk"
                  name="milk"
                  checked={formData.allergies.milk}
                  onChange={handleChange}
                />
                <label htmlFor="milk" className="ml-2">Milk</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="peanuts"
                  name="peanuts"
                  checked={formData.allergies.peanuts}
                  onChange={handleChange}
                />
                <label htmlFor="peanuts" className="ml-2">Peanuts</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="gluten"
                  name="gluten"
                  checked={formData.allergies.gluten}
                  onChange={handleChange}
                />
                <label htmlFor="gluten" className="ml-2">Gluten</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="crustaceans"
                  name="crustaceans"
                  checked={formData.allergies.crustaceans}
                  onChange={handleChange}
                />
                <label htmlFor="crustaceans" className="ml-2">Crustaceans</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="mustard"
                  name="mustard"
                  checked={formData.allergies.mustard}
                  onChange={handleChange}
                />
                <label htmlFor="mustard" className="ml-2">Mustard</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="nuts"
                  name="nuts"
                  checked={formData.allergies.nuts}
                  onChange={handleChange}
                />
                <label htmlFor="nuts" className="ml-2">Nuts</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="sesame"
                  name="sesame"
                  checked={formData.allergies.sesame}
                  onChange={handleChange}
                />
                <label htmlFor="sesame" className="ml-2">Sesame</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="celery"
                  name="celery"
                  checked={formData.allergies.celery}
                  onChange={handleChange}
                />
                <label htmlFor="celery" className="ml-2">Celery</label>    
              </div>
              <div>
                <input
                  type="checkbox"
                  id="sulphites"
                  name="sulphites"
                  checked={formData.allergies.sulphites}
                  onChange={handleChange}
                />
                <label htmlFor="sulphites" className="ml-2">Sulphites</label>    
              </div>  
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup