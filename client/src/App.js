import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Layout from './layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import UserProvider from "./context/UserContext";
import Cart from './pages/Cart';
import Users from './pages/Users';
import AddProducts from './pages/AddProducts';
import ManageProductsPage from './pages/ManageProducts';
import { ProductsProvider } from './context/ProductsContext';


function App() {
  return (
    <BrowserRouter>
    <UserProvider>
    <ProductsProvider>
    <Routes>
      <Route path='/' element={<Layout/>} >
      <Route index element={<Home/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={ <Products />}/>
      <Route path="/cart" element={<Cart />} />
      <Route path="/users" element={<Users />} />
      <Route path="/manage-products" element={<ManageProductsPage />} />
      <Route path="/add-products" element={<AddProducts />} />
      <Route path="*" element={<h1 className='text-center'>Ooops! Page does not exist! </h1>}/>
      </Route>
    </Routes>
    </ProductsProvider>
    </UserProvider>
    </BrowserRouter>
  );
}

export default App;
