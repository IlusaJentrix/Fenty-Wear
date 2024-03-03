// Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const backgroundImageUrl =
    'url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")';

  const containerStyle = {
    backgroundImage: backgroundImageUrl,
  };

  const centerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: 'white', // Add text color to improve visibility
  };

  return (
    <div
      className="flex flex-col justify-center align-center bg-cover bg-position-center bg-no-repeat vh-100"
      style={containerStyle}
    >
      <div style={centerContainerStyle} id="main">
        <h1 className="display-1 fw-semibold">Fenty Wear</h1>
        <p className="lead fw-semibold fs-4">Your Fenty-Centric Wardrobe</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </div>
    </div>
  );
}

export default Home;
