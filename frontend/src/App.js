import Navbar from "./navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./Pages/profile";
import Recipe from "./Pages/recipe"
import Allergies from "./Pages/allergies";
import Diets from "./Pages/diets";
import Signup from "./Pages/signup";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Recipe/>}/>
        <Route path="Allergies" element={<Allergies/>}/>
        <Route path="Diets" element={<Diets/>}/>
        <Route path="Profile" element={<Profile/>}/>
        <Route path="Signup" element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
