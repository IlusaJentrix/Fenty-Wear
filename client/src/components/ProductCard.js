import React, {useContext} from 'react';
import { useProducts } from '../context/ProductsContext';
import { UserContext } from '../context/UserContext';

function ProductCard() {
  const { products, loading, addToCart } = useProducts();
  const { currentUser } = useContext(UserContext);

  const handleAddToCart = (product) => {
    if (currentUser) {
      addToCart(product);
    } else {
      // Display an error message or redirect to the login page
      alert('Please log in to add items to your cart.');
      // You may replace alert with your preferred method to display an error message.
    }
  };
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='container row '>
          {products && products.map((product) => (
            <div key={product.id} className="card col-4 m-1" style={{width: "18rem"}}>
            <img src={product.image_url} className="card-img-top img-fluid" alt="..."/>
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}.</p>
              <div className='row'>
              <button className="btn btn-primary col " onClick={()=> {handleAddToCart(product)}}>Add to Cart</button>
              <span className='col align-self-center text-danger fw-bold fst-italic text-end'>{product.price}</span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ProductCard;
