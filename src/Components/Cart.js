import React from 'react';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";




const Cart = ({ cart, setCart }) => {
  const deleteProductFromCart = async (productId) => {
    const token = window.localStorage.getItem('token');
    if (!token) return;
    const response = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    const updatedCart = await response.json();
    setCart(updatedCart);
    return updatedCart;
  };

  const purchaseCart = async () => {
    const token = window.localStorage.getItem('token');
    if (!token) return;
    const response = await fetch(`/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    const newCart = await response.json();
    setCart(newCart);
  };

  

  const thankYou = async() => {
    
   const message = confirm("Confirm Purchase?")

    if (message === true) {
      const newCart = await purchaseCart();
      alert("Thank you for your purchase!");  window.location.href = "#/";
     } else {
      return
      };
   

  }
 // console.log('Cart: ', cart);
  return (
    <div className="cart-page-container">
      <h2>My cart items</h2>
      <ul>
        {cart.products?.map((product) => {
          return (


            <li className="items-in-cart">
              {product.name}${product.price}({product.quantity})
              <img className="cart-img" src={product.image_url} />
              <button
                className="deleteBtn"

                onClick={async () => {
                  const updatedCart = await deleteProductFromCart(product.id);
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      <button className="cartBtn"

        onClick= { () => thankYou()}
      >
        PURCHASE CART
      </button>
    </div>
  );
};





 export default Cart
