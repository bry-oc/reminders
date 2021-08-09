import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div>
            <nav className="navbar">
                <ul>
                    <li>
                        <p>Reminders</p>
                    </li>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/account">Account</Link>
                    </li>
                    <li>
                        <Link to="/reminder/list">List</Link>
                    </li>
                    <li>
                        <Link to="/reminder/create">Create</Link>
                    </li>
                    <li>
                        <Link to="/reminder/update">Update</Link>
                    </li>
                    <li>
                        <Link to="/reminder/delete">Delete</Link>
                    </li>
                </ul>

            </nav>
        </div>
    )
}