import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import MyRecipe from './pages/MyRecipe';
import AddRecipe from './pages/AddRecipe';
import UpdateRecipe from './pages/UpdateRecipe';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen font-[Poppins]">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={
              <>
                <Navbar />
                <div className="pt-[80px]">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />
                    <Route path="/my-recipes" element={<MyRecipe />} />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/update-recipe/:id" element={<UpdateRecipe />} />
                  </Routes>
                </div>
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
