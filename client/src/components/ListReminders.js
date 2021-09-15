import React, { useEffect, useState, useContext } from "react";
import UpdateReminder from "./UpdateReminder";
import DeleteReminder from "./DeleteReminder";
import ViewReminder from "./ViewReminder";
import authContext from './AuthContext';

function ListReminders() {
    const [reminders, setReminders] = useState([]);
    const [currentID, setCurrentID] = useState();
    const { auth, setAuth } = useContext(authContext);
    const [reminderID, setReminderID] = useState(0);
    const [reminderName, setReminderName] = useState('');
    const [reminderDescription, setReminderDescription] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderRepeat, setReminderRepeat] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let url = '/api/user/authentication';
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/reminder/list';

                    fetch(url, {
                        method: 'GET',
                        credentials: 'include'
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data);
                            if (data.error) {
                                console.log(data.error);
                            } else {
                                console.log(data.reminders);
                                setReminders(data.reminders);
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
                                url = '/api/reminder/list';

                                fetch(url, {
                                    method: 'GET',
                                    credentials: 'include'
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if (data.error) {
                                            console.log(data.error);
                                        } else {
                                            console.log(data.reminders);
                                            setReminders(data.reminders);
                                        }
                                    })
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })

    }, []);

    let openView = (e) => {
        let modalView = document.getElementById("modal-view");
        modalView.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);

        setLoading(true);
        setReminderID(currentID);
        let fetchID = e.target.name;
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetReminder(fetchID);
                    console.log(auth);
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
                                fetchGetReminder(fetchID);
                            } else {
                                console.log(res.status);
                                setAuth(false);
                                setLoading(false);
                            }
                        })
                }
            })
    }

    function fetchGetReminder(reminderid) {
        const updateReminderURL = '/api/reminder/view/' + reminderid;
        fetch(updateReminderURL, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data.reminder);
                    setReminderID(data.reminderid);
                    setReminderName(data.reminderName);
                    setReminderDescription(data.reminderDescription);
                    setReminderRepeat(data.reminderRepeat);
                    const date = new Date(parseInt(data.reminderTimestamp));
                    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
                    const year = date.getFullYear();
                    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    const reminderDate = year + '-' + month + '-' + day;
                    const reminderTime = hour + ':' + minutes;
                    setReminderDate(reminderDate);
                    setReminderTime(reminderTime);
                }
                setLoading(false);
            })
    }

    let closeView = (e) => {
        setReminderDescription('');
        setReminderName('');
        setReminderDate('');
        setReminderTime('');
        setReminderRepeat('');
        setLoading(true);
        let modalViewClose = document.getElementById("modal-view");
        modalViewClose.style.display = "none";
        document.body.style.overflow = "auto";
    }

    let openEdit = (e) => {
        let modalEdit = document.getElementById("modal-update");
        modalEdit.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);

        setReminderID(e.target.name);
        let fetchID = e.target.name;
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetReminder(fetchID);
                    console.log(auth);
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
                                fetchGetReminder(fetchID);
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
    }


    function fetchUpdateReminder() {
        const updateReminderURL = '/api/reminder/update';
        fetch(updateReminderURL, {
            method: 'POST',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setReminderID(data.reminderid);
                    setReminderName(data.reminderName);
                    setReminderDescription(data.reminderDescription);
                    setReminderDate(data.reminderDate);
                    setReminderTime(data.reminderTime);
                    setReminderRepeat(data.reminderRepeat);
                }
            })
    }

    let closeEdit = (e) => {
        let modalEditClose = document.getElementById("modal-update");
        modalEditClose.style.display = "none";
        document.body.style.overflow = "auto";
        setReminderDescription('');
        setReminderName('');
        setReminderDate('');
        setReminderTime('');
        setReminderRepeat('');
        setLoading(true);
    }

    let openDelete = (e) => {
        let modalDelete = document.getElementById("modal-delete");
        modalDelete.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);
    }

    function TableData() {
        return reminders.map((reminder, index) => {
            const { reminderid, name, repeat, description, date } = reminder;
            let reminderDate = new Date(parseInt(date));
            const day = reminderDate.getDate() < 10 ? "0" + reminderDate.getDate() : reminderDate.getDate();
            const month = (reminderDate.getMonth() + 1) < 10 ? "0" + (reminderDate.getMonth() + 1) : (reminderDate.getMonth() + 1);
            const year = reminderDate.getFullYear();
            const hour = reminderDate.getHours() < 10 ? "0" + reminderDate.getHours() : reminderDate.getHours();
            const minutes = reminderDate.getMinutes() < 10 ? "0" + reminderDate.getMinutes() : reminderDate.getMinutes();
            reminderDate = year + '-' + month + '-' + day;
            return (
                <tr key={reminderid}>
                    <td>{name}</td>
                    <td>{reminderDate}</td>
                    <td><button onClick={openView} name={reminderid}>view</button></td>
                    <td><button onClick={openEdit} name={reminderid}>edit</button></td>
                    <td><button onClick={openDelete} name={reminderid}>delete</button></td>
                </tr>
            )
        })
    }

    return (
        <div className="list-wrapper">
            <div className="table-wrapper">
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                        {TableData()}
                    </tbody>
                </table>
            </div>
            <div className="modal-wrapper" id="modal-view">
                {loading ? (
                    <div className="wrapper modal">
                        <i className="fa fa-times-circle fa-2x" onClick={closeView}></i><br />
                        <h2>View Reminder</h2>
                        <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                    </div>
                    ) 
                    :
                    (
                        <div className="wrapper modal">
                            <i className="fa fa-times-circle fa-2x" onClick={closeView}></i><br />
                            <h2>View Reminder</h2>
                            <h3>Name: </h3>
                            <p>{reminderName}</p>
                            <h3>Date: </h3>
                            <p>{reminderDate}</p>
                            <h3>Time: </h3>
                            <p>{reminderTime}</p>
                            <h3>Repeat: </h3>
                            <p>{reminderRepeat}</p>
                            <h3>Description: </h3>
                            <p>{reminderDescription}</p>
                        </div>
                    )}
            </div>
            <div className="modal-wrapper" id="modal-update">
                {loading ? (
                    <div className="wrapper modal">
                        <i className="fa fa-times-circle fa-2x" onClick={closeView}></i><br />
                        <h2>View Reminder</h2>
                        <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                    </div>
                )
                :
                (
                    <div className="wrapper modal">
                        <i className="fa fa-times-circle fa-2x" onClick={closeEdit}></i><br />
                        <h2>Edit Reminder</h2>
                        <form>
                            <label htmlFor="name" id="name">Name:<br />
                                <input type="text" value={reminderName} onChange={(e => setReminderName(e.target.value))} required>
                                </input>
                            </label><br /><br />
                            <label htmlFor="date">Date:<br />
                                <input type="date" value={reminderDate} onChange={(e => setReminderDate(e.target.value))}>
                                </input>
                            </label><br /><br />
                            <label htmlFor="time">Time:<br />
                                <input type="time" value={reminderTime} onChange={(e => setReminderTime(e.target.value))}>
                                </input>
                            </label><br /><br />
                            <label htmlFor="repeat">Repeat:<br />
                                <select form="repeat" value={reminderRepeat} onChange={(e => setReminderRepeat(e.target.value))}>
                                    <option defaultValue="none" id="none">None</option>
                                    <option value="daily" id="daily">Daily</option>
                                    <option value="weekly" id="weekly">Weekly</option>
                                    <option value="biweekly" id="biweekly">Biweekly</option>
                                    <option value="monthly" id="monthly">Monthly</option>
                                </select>
                            </label><br /><br />
                            <label htmlFor="description">Description (Optional):<br />
                                <textarea name="description" value={reminderDescription} onChange={(e => setReminderDescription(e.target.value))}>
                                </textarea>
                            </label><br /><br />
                            <button type="submit" onClick={fetchUpdateReminder}>Update Reminder</button>
                        </form>
                    </div>
                )}
            </div >
            <div className="modal-wrapper" id="modal-delete">
                <DeleteReminder reminderid={currentID} />
            </div>
        </div >

    )



}

export default ListReminders;