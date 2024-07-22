import React, { useContext, useState } from 'react'
import './navbar.css'
import logo from '../Assets/logo.png'
import cart from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {

  const [menu, setMenu] = useState("Shop")
  const {getTotalCartItem} = useContext(ShopContext);

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="logo" />
            <p>Shopify</p>
        </div>
        <ul className="nav-menu">
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none', color: 'inherit'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("men")}}><Link style={{textDecoration: 'none', color: 'inherit'}} to='/men'>Men</Link> {menu==="men"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration: 'none', color: 'inherit'}} to='/women'>Women</Link> {menu==="women"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none', color: 'inherit'}} to='/kids'>Kids</Link> {menu==="kids"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
            {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>:<Link style={{textDecoration: 'none', color: 'inherit'}} to='/login'><button>Login</button></Link>}
            <Link style={{textDecoration: 'none', color: 'inherit'}} to='/cart'><img src={cart} alt="cart-icon" /></Link>
            <div className="nav-cart-count">{getTotalCartItem()}</div>
        </div>
    </div>
  )
}

export default Navbar