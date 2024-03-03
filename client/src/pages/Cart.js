import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext";

function Cart() {
  const { cartProducts, loading, removeFromCart } = useProducts();
  const [total, setTotal] = useState(0);
  const [cartQuantity, setCartQuantity] = useState({});

  useEffect(() => {
    // Calculate total and cart quantity whenever cartProducts change
    const newTotal = cartProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);

    const newCartQuantity = cartProducts.reduce((quantity, item) => {
      quantity[item.id] = item.quantity;
      return quantity;
    }, {});
    setCartQuantity(newCartQuantity);
  }, [cartProducts]);

  const handleIncreaseQuantity = (itemId) => {
    setTotal(total + cartProducts.find((item) => item.id === itemId).price);

    const newCartQuantity = {
      ...cartQuantity,
      [itemId]: cartQuantity[itemId] + 1,
    };
    setCartQuantity(newCartQuantity);
  };

  const handleDecreaseQuantity = (itemId) => {
    setTotal(total - cartProducts.find((item) => item.id === itemId).price);

    const newCartQuantity = {
      ...cartQuantity,
      [itemId]: cartQuantity[itemId] - 1,
    };
    setCartQuantity(newCartQuantity);
  };

  const handleDeleteItem = (item) => {
    removeFromCart(item);
  };

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cartProducts.length > 0 ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      -
                    </button>{" "}
                    {cartQuantity[item.id]}{" "}
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleDeleteItem(item);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <h4>
              {isNaN(total) ? window.location.reload() : `Total: $${total.toFixed(2)}`}
            </h4>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="display-1">Your cart is empty</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
