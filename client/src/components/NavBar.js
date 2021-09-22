import React, { useContext, useState } from "react";
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

    function toggleResponsiveNav() {
        let nav = document.getElementById("navbar");
        if (nav.className === "navbar") {
            nav.className += " responsive";
        } else {
            nav.className = "navbar";
        }
    }
    
    function openCreate() {
        let modalEdit = document.getElementById("modal-create");
        modalEdit.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeCreate() {
        modalEdit.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function fetchCreateReminder() {
        
    }

    const currentDate = new Date();
    const day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
    const month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();
    const today = year + '-' + month + '-' + day;

    return (
        <div>
            <div>
            <nav className="navbar" id="navbar">
                <ul>
                    <li>
                        <i className="fa fa-bars fa-2x" onClick={toggleResponsiveNav}></i>
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
                                <Link className="navlink" to="/reminder/list" onClick={openCreate}>Create</Link>
                            </li> : null
                    }
                    {
                        auth ? 
                            <li>
                                <Link id="logout" className="navlink" to="/" onClick={logout}>Logout</Link>
                            </li> : null
                    }               
                </ul>
            </nav>
            </div>
            <div className="modal-wrapper">
                <div className="wrapper modal modal-create">
                    <i className="fa fa-times-circle fa-2x" onClick={closeCreate}></i><br />
                    <h2>Edit Reminder</h2>
                    <form onSubmit={fetchCreateReminder}>
                        <label htmlFor="reminderName" id="name">Name:<br />
                            <input type="text" name="reminderName" onChange={(e =>e.target.value)} required>
                            </input>
                        </label><br /><br />
                        <label htmlFor="date">Date:<br />
                            <input type="date" min={today} name="reminderDate" onChange={(e => e.target.value)}>
                            </input>
                        </label><br /><br />
                        <label htmlFor="time">Time:<br />
                            <input type="time" name="reminderTime" onChange={(e => e.target.value)}>
                            </input>
                        </label><br /><br />
                        <label htmlFor="repeat">Repeat:<br />
                            <select name="reminderRepeat" onChange={(e => e.target.value)}>
                                <option defaultValue="none" id="none">None</option>
                                <option value="daily" id="daily">Daily</option>
                                <option value="weekly" id="weekly">Weekly</option>
                                <option value="biweekly" id="biweekly">Biweekly</option>
                                <option value="monthly" id="monthly">Monthly</option>
                            </select>
                        </label><br /><br />
                        <label htmlFor="description">Description (Optional):<br />
                            <textarea name="reminderDescription" onChange={(e => e.target.value)}>
                            </textarea>
                        </label><br /><br />
                        <button type="submit" >Update Reminder</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NavBar;