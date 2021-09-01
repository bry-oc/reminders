import React, { useContext } from "react";
import { Link } from "react-router-dom";
import authContext from './AuthContext';
import 'font-awesome/css/font-awesome.min.css';

function NavBar() {
    const { auth, setAuth } = useContext(authContext);

    let logout = () => {
        const url = "/api/logout";

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setAuth(false);
                    console.log(auth);
                    console.log(data);
                    window.location.href = "/";
                }
            })
    }
    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
    function myFunction() {
        var x = document.getElementById("navbar");
        if (x.className === "navbar") {
            x.className += " responsive";
            console.log(x.className);
        } else {
            x.className = "navbar";
            console.log(x.className);
        }
    }

    return (
        <div>
            <nav className="navbar" id="navbar">
                <ul>
                    <li>
                        <i className="fa fa-bars fa-2x" onClick={myFunction}></i>
                    </li>                    
                    <li>
                        <Link className="navlink" to="/">Home</Link>
                    </li>
                    {
                        !auth ? <li>
                            <Link className="navlink" to="/signup">Signup</Link>
                        </li> : null
                    }
                    {
                        !auth ? <li>
                            <Link className="navlink" to="/login">Login</Link>
                        </li> : <li>
                            <Link className="navlink" to="/account">Account</Link>
                        </li>
                    }             
                    {
                        auth ?
                            <li>
                                <Link className="navlink" to="/reminder/list">Reminders</Link>
                            </li> : null
                    }
                    {
                        auth ?
                            <li>
                                <Link className="navlink" to="/reminder/create">Create</Link>
                            </li> : null
                    }
                    {
                        auth ?
                            <li>
                                <Link className="navlink" to="/reminder/update">Update</Link>
                            </li> : null
                    }
                    {
                        auth ?
                            <li>
                                <Link className="navlink" to="/reminder/delete">Delete</Link>
                            </li> : null
                    }                    
                    {
                        auth ? 
                            <li>
                                <Link className="navlink" to="/" onClick={logout}>Logout</Link>
                            </li> : null
                    }               
                </ul>

            </nav>
        </div>
    )
}

export default NavBar;