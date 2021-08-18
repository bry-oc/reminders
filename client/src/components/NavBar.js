import React, { useContext } from "react";
import { Link } from "react-router-dom";
import authContext from './AuthContext';

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

    return (
        <div>
            <nav className="navbar">
                <ul>
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