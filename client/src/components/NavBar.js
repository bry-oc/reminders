import React, { useContext } from "react";
import { Link } from "react-router-dom";
import authContext from './AuthContext';

function NavBar() {
    const { auth } = useContext(authContext);
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
                    <li>
                        <Link className="navlink" to="/reminder/list">Reminders</Link>
                    </li>
                    <li>
                        <Link className="navlink" to="/reminder/create">Create</Link>
                    </li>
                    <li>
                        <Link className="navlink" to="/reminder/update">Update</Link>
                    </li>
                    <li>
                        <Link className="navlink" to="/reminder/delete">Delete</Link>
                    </li>
                    <li>
                        <Link className="navlink" to="/logout">Logout</Link>
                    </li>
                </ul>

            </nav>
        </div>
    )
}

export default NavBar;