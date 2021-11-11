import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authContext from './AuthContext';
import $ from "jquery";

function NavBar() {
    const { auth, setAuth } = useContext(authContext);
    const [reminderName, setReminderName] = useState('');
    const [reminderDescription, setReminderDescription] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderRepeat, setReminderRepeat] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        if (modalVisible) {
            $(document).on("click", function (e) {
                var container = $(".modal");

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    let modalLogoutClose = document.getElementById("modal-logout");
                    modalLogoutClose.style.display = "none";
                    let modalCreateClose = document.getElementById("modal-create");
                    modalCreateClose.style.display = "none";
                    document.body.style.overflow = "auto";
                    setModalVisible(false);
                    setReminderName("");
                    setReminderDate("");
                    setReminderTime("");
                    setReminderRepeat("none");
                    setReminderDescription("");
                    $(document).off("click");
                }
            });
        }
    }, [modalVisible])

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

    function openLogout() {
        setModalVisible(true);
        let modalLogout = document.getElementById("modal-logout");
        modalLogout.style.display="flex";
        document.body.style.overflow = "hidden";
    }

    function closeLogout() {
        setModalVisible(false);
        let modalLogoutClose = document.getElementById("modal-logout");
        modalLogoutClose.style.display = "none";
        document.body.style.overflow = "auto";
        $(document).off("click");
    }
    
    function openCreate() {
        setModalVisible(true);
        let modalCreate = document.getElementById("modal-create");
        modalCreate.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeCreate() {
        setModalVisible(false);
        let modalCreateClose = document.getElementById("modal-create");
        modalCreateClose.style.display = "none";
        document.body.style.overflow = "auto";
        $(document).off("click");
        setReminderName("");
        setReminderDate("");
        setReminderTime("");
        setReminderRepeat("none");
        setReminderDescription("");
    }

    let fetchCreateReminder = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('reminderName', reminderName);
        formData.append('reminderDate', reminderDate);
        formData.append('reminderTime', reminderTime);
        formData.append('reminderRepeat', reminderRepeat);
        formData.append('reminderDescription', reminderDescription);

        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/reminder/create';
                    fetch(url, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                setWarning(data.error);
                                console.log(data.error);
                            } else {
                                console.log(data.message);
                                setWarning('');
                                window.location.href = "/reminder/list";
                            }
                        })
                } else {
                    console.log('refresh!');
                    const refresh = '/api/token/refresh';
                    fetch(refresh, {
                        method: 'GET',
                        credentials: 'include'
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                setAuth(true);
                                url = '/api/reminder/create';

                                fetch(url, {
                                    method: 'POST',
                                    body: formData,
                                    credentials: 'include'
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if (data.error) {
                                            setWarning(data.error);
                                            console.log(data.error);
                                        } else {
                                            console.log(data.message);
                                            setWarning('');
                                            window.location.href = "/reminder/list";
                                        }
                                    })
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
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
                                    <Link className="navlink" to="#" onClick={openCreate}>Create</Link>
                            </li> : null
                    }
                    {
                        auth ?
                            <li>
                                <Link id="logout" className="navlink" to="#" onClick={openLogout}>Logout</Link>
                            </li> : null
                    }               
                </ul>
            </nav>
            </div>
            <div className="modal-wrapper" id="modal-create">
                <div className="wrapper modal">
                    <i className="fa fa-times-circle fa-2x" onClick={closeCreate}></i><br />
                    <h2>Create Reminder</h2>
                    <form onSubmit={fetchCreateReminder}>
                        <label htmlFor="reminderName" id="name">Name:<br />
                            <input type="text" value={reminderName} name="reminderName" onChange={(e =>setReminderName(e.target.value))} required>
                            </input>
                        </label><br /><br />
                        <label htmlFor="date">Date:<br />
                            <input type="date" value={reminderDate} min={today} name="reminderDate" onChange={(e => setReminderDate(e.target.value))}>
                            </input>
                        </label><br /><br />
                        <label htmlFor="time">Time:<br />
                            <input type="time" value={reminderTime} name="reminderTime" onChange={(e => setReminderTime(e.target.value))}>
                            </input>
                        </label><br /><br />
                        <label htmlFor="repeat">Repeat:<br />
                            <select name="reminderRepeat" value={reminderRepeat} onChange={(e => setReminderRepeat(e.target.value))}>
                                <option defaultValue="none" id="none">None</option>
                                <option value="daily" id="daily">Daily</option>
                                <option value="weekly" id="weekly">Weekly</option>
                                <option value="biweekly" id="biweekly">Biweekly</option>
                                <option value="monthly" id="monthly">Monthly</option>
                            </select>
                        </label><br /><br />
                        <label htmlFor="description">Description (Optional):<br />
                            <textarea name="reminderDescription" value={reminderDescription} onChange={(e => setReminderDescription(e.target.value))}>
                            </textarea>
                        </label><br /><br />
                        <button type="submit" >Create Reminder</button>
                    </form>
                    <p>{warning}</p>
                </div>
            </div>
            <div className="modal-wrapper" id="modal-logout">
                <div className="wrapper modal" id="logout">
                    <h2>Logout?</h2>
                    <button type="submit" onClick={logout}>Yes</button><br/>
                    <button type="submit" onClick={closeLogout}>No</button>
                </div>
            </div>
        </div>
    )
}

export default NavBar;