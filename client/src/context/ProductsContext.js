import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onchange, setOnchange] = useState(false);

  const { authToken } = useContext(UserContext);
  const url = "http://localhost:5000";

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/products`);
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error Fetching Products: ", error);
      }
    };
    getProducts();
  }, []);

  console.log("Products: ", products);


  // Add items to cart
  const addToCart = async (product) => {
    try {
      console.log("Adding to cart: ", product);
      const response = await fetch(`${url}/add_to_cart/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error Adding to Cart: ", data.message);
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        // Handle error state if needed
      } else {
        console.log("Product added to the cart successfully");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product added to the cart successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        // Add item to the cartProducts state
        setCartProducts([...cartProducts, product]);
        // You may want to update the cartProducts state here
      }
    } catch (error) {
      console.error("Error Adding to Cart: ", error);
      // Handle error state if needed
    }
  };

  // Fetch items from the cart
  useEffect(() => {
    const getCartProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/cart/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setCartProducts(data.cart_items);
        setLoading(false);
      } catch (error) {
        console.error("Error Fetching Products: ", error);
      }
    };
    getCartProducts();
  }, [authToken]);

  const removeFromCart = async (product) => {
    try {
      const response = await fetch(`${url}/remove_from_cart/${product.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error Removing from Cart: ", data.message);
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        // Handle error state if needed
      } else {
        console.log("Product removed from the cart successfully");
        // Remove item from the cartProducts state
        setCartProducts(cartProducts.filter((item) => item.id !== product.id));
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product removed from the cart successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        // You may want to update the cartProducts state here
      }
    } catch (error) {
      console.error("Error Removing from Cart: ", error);
      // Handle error state if needed
    }
  };

  console.log("Cart Products: ", cartProducts);

  const DeleteProducts = async (product) => {
    try {
      const response = await fetch(`${url}/products/delete/${product.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error Deleting Product: ", data.message);
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        // Handle error state if needed
      } else {
        console.log("Product remove successfully");
        // Remove item from the Products state
        setProducts(products.filter((item) => item.id !== product.id));
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product removed successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        // You may want to update the cartProducts state here
      }
    } catch (error) {
      console.error("Error Removing from Cart: ", error);
      // Handle error state if needed
    }
  };
  function updateProduct(product) {
    fetch(`${url}/products/update/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        quantity: product.quantity,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
        // Update the product in the Products state
          setProducts(products.map((p) => (p.id === product.id ? product : p)));
          navigate("/manage-products");
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.success,
            showConfirmButton: false,
            timer: 1500,
          });
          setOnchange(!onchange);
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setOnchange(!onchange);
        }
      });
  }
  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        cartProducts,
        addToCart,
        removeFromCart,
        DeleteProducts,
        updateProduct,
        setProducts
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export { ProductsProvider, useProducts };
