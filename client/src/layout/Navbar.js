import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function NavBar() {
  const { currentUser, logout } = useContext(UserContext);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Fenty Wear
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {currentUser && currentUser.username ? (
                <>
                  {currentUser.role === "Admin" ? (
                    <li className="nav-item">
                      <Link to="/users" className="nav-link">
                        Users
                      </Link>
                    </li>
                  ) : null}
                  {currentUser.role === "Admin" ? (
                    <li className="nav-item">
                      <Link to="/manage-products" className="nav-link">
                        Products
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link to="/products" className="nav-link">
                        Products
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link to="/cart" className="nav-link">
                      Cart
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/Profile" className="nav-link">
                      Profile
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
            {currentUser && currentUser.username && (
              <button
                className="btn btn-outline-warning"
                onClick={() => logout()}
              >
                Logout
              </button>
            )}
            {!currentUser && (
              <>
                <Link to="/login">
                  <button className="btn btn-outline-success nav-item">
                    Login
                  </button>
                </Link>
                <Link to="/Register">
                  <button className="btn btn-outline-primary nav-item mx-2">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
