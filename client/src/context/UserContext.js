import React, { createContext, useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [onchange, setOnchange] = useState(false);
  const [authToken, setAuthToken] = useState(
    () => sessionStorage.getItem("authToken") || null
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const url = "http://localhost:5000";
  const navigate = useNavigate();

  // add user
  function addUser(username, email, phone, password, role) {
    fetch(`${url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, phone, password, role }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          navigate("/login");

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
            title: response.error,
            showConfirmButton: false,
            timer: 1500,
          });
          setOnchange(!onchange);
        }
      });
  }

  // Update user
  function updateUser(username, email, phone) {
    fetch(`${url}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ username, email, phone }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          navigate("/login");
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.message,
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

  // login user
  function login(username, password) {
    fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.access_token) {
          sessionStorage.setItem("authToken", response.access_token);
          setAuthToken(response.access_token);

          if (currentUser && currentUser.role === "Admin") {
              navigate("/users");
          } else {
              navigate("/products");
          }
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login success",
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
        }
      });
  }

  // DELETE  user account
  function delete_your_account() {
    fetch(`${url}/user/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken && authToken}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.message) {
          navigate("/");

          Swal.fire({
            position: "center",
            icon: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 1500,
          });

          setOnchange(!onchange);
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: response.error,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  // function to delete an account
  function deleteAccount(id) {
    fetch(`${url}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken && authToken}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
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
        }
      });
  }

  // Logout user
  function logout() {
    sessionStorage.removeItem("authToken");
    setCurrentUser(null);
    navigate("/");

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Logout success",
      showConfirmButton: false,
      timer: 1000,
    });
  }

  // Get Authenticated user
  useEffect(() => {
    if (authToken) {
      fetch(`${url}/authenticated_user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.email || response.username) {
            setCurrentUser(response);
          } else {
            setCurrentUser(null);
          }
        });
    }
  }, [authToken, onchange]);

  // Fetch all users
  const getAllUsers = useCallback(() => {
    if (currentUser && currentUser.role === "Admin") {
        fetch(`${url}/admin/users`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.users) {
                    // Update the state with the fetched users
                    setAllUsers(response.users);
                } else {
                    console.error("Failed to fetch users:", response.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }
}, [authToken, currentUser]);


  useEffect(() => {
    if (authToken) {
      getAllUsers();
    }
  }, [authToken, getAllUsers]);

  // context data
  const contextData = {
    addUser,
    login,
    updateUser,
    logout,
    currentUser,
    delete_your_account,
    authToken,
    getAllUsers,
    allUsers,
    deleteAccount,
    // pass all your variables and functions
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
}
