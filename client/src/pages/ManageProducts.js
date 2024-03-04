import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext"; // Update the path
import { useProducts } from "../context/ProductsContext";
import { useNavigate } from "react-router-dom";

const ManageProductsPage = () => {
  const { products, loading, DeleteProducts, updateProduct } = useProducts();
  const { currentUser } = useContext(UserContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ensure useEffect runs when currentUser changes

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    openModal();
  };

  const handleDelete = (product) => {
    DeleteProducts(product);
  };

  const handleModalSubmit = (updatedProduct) => {
    // Call your updateProduct function here with updatedProduct
    // You may also close the modal and handle success/error messages
    console.log(updatedProduct);
    updateProduct(updatedProduct);
    closeAndResetModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeAndResetModal = () => {
    setSelectedProduct(null);
    closeModal();
  };

  const navigate = useNavigate();

  const isAdmin = currentUser && currentUser.role === "Admin";

  return (
    <div className="container">
      {isAdmin ? (
        <>
          <h1 className="text-center">Manage Products</h1>
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/add-products")}
          >
            Add Product
          </button>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button
                          className="btn btn-info"
                          onClick={() => handleUpdate(product)}
                        >
                          Update
                        </button>{" "}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {isModalOpen && selectedProduct && (
            <ProductUpdateModal
              product={selectedProduct}
              onSubmit={handleModalSubmit}
              onClose={closeModal}
            />
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="alert alert-danger mt-4" role="alert">
            You are not authorized to view this page.
          </div>
        </div>
      )}
    </div>
  );
};

// Separate modal component for updating product
const ProductUpdateModal = ({ product, onSubmit, onClose }) => {
  // Add necessary state and form logic for updating product details
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [image_url, setImage_url] = useState(product.image_url);
  const [quantity, setQuantity] = useState(product.quantity);
  const [selectedCategory, setSelectedCategory] = useState(product.category_id);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, []);

  const url = "https://fenty-wear-ya5g.onrender.com";

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        console.error(
          `Failed to fetch categories: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      id: product.id,
      name,
      description,
      price,
      image_url,
      quantity,
      category_id: selectedCategory,
    };

    // Call the onSubmit function with the updated product
    onSubmit(updatedProduct);

    // Close the modal
    onClose();
  };
  return (
    <div className="card-body p-4">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group row my-4">
          <label className="form-label col-sm-2">Name</label>
          <div className="col-sm-10">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label className="form-label col-sm-2">Description</label>
          <div className="col-sm-10">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label className="form-label col-sm-2">Price</label>
          <div className="col-sm-10">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label className="form-label col-sm-2">Image URL</label>
          <div className="col-sm-10">
            <input
              type="text"
              value={image_url}
              onChange={(e) => setImage_url(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label className="form-label col-sm-2">Quantity</label>
          <div className="col-sm-10">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label className="form-label col-sm-2">Category</label>
          <div className="col-sm-10">
            <select
              id="categorySelect"
              className="form-select"
              aria-label="Select a category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-success w-100 mb-5">
          Update Product
        </button>
      </form>
      <div className="mb-5 px-5"></div>
    </div>
  );
};

export default ManageProductsPage;
