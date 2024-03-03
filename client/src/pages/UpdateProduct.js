import React, { useState, useEffect, useContext } from "react";
import { useProducts } from "../context/ProductsContext";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2"; // Assuming you have SweetAlert2 for notifications
import { useNavigate } from "react-router-dom";

export default function UpdateProducts(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image_url, setImage_url] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const { currentUser, authToken } = useContext(UserContext);
  const { setProducts, products } = useProducts();

  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, []);

  const url = "http://localhost:5000";

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

//   function addProduct(productData) {
//     const url = "http://localhost:5000";

//     fetch(`${url}/products/add`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: JSON.stringify(productData),
//     })
//       .then((res) => res.json())
//       .then((response) => {
//         if (response.success) {
//             setProducts([...products, productData]);
//           // Handle success, e.g., navigate to another page
//           navigate("/manage-products");
//           Swal.fire({
//             position: "center",
//             icon: "success",
//             title: response.success,
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         } else {
//           // Handle error, e.g., show an error alert
//           Swal.fire({
//             position: "center",
//             icon: "error",
//             title: response.error,
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error adding product:", error);
//       });
//   }
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentUser.role === "Admin") {
      // Call the addProduct function with the product data
      addProduct({
        name,
        description,
        image_url,
        price,
        quantity,
        category_id: selectedCategory,
      });
    } else {
      alert("Only Admins can add products");
    }
  };

  return (
    <div className="py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card row mt-5 p-4">
            <div className="card-body p-4">
              <h2>Add Product</h2>
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
                <button type="submit" className="btn btn-success w-100">
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

