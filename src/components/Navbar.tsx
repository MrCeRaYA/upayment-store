import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="my-4 flex justify-between">
      <Link to="/">
        <h4 className="text-2xl font-bold">UPayment Store</h4>
      </Link>
      <Link
        className="text-2xl bg-black text-white py-2 px-4 rounded"
        to="/createProduct"
      >
        Register Item
      </Link>
    </nav>
  );
}

export default Navbar;
