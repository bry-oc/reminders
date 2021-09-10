import React, { useEffect, useState, useContext } from "react";
import UpdateReminder from "./UpdateReminder";
import DeleteReminder from "./DeleteReminder";
import ViewReminder from "./ViewReminder";
import authContext from './AuthContext';

function ListReminders() {
    const [reminders, setReminders] = useState([]);
    const [currentID, setCurrentID] = useState();
    const { auth, setAuth } = useContext(authContext);

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
        modalView.style.display = "block";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);
    }

    let openEdit = (e) => {
        let modalEdit = document.getElementById("modal-update");
        modalEdit.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);
    }    

    let openDelete = (e) => {
        let modalDelete = document.getElementById("modal-delete");
        modalDelete.style.display = "block";
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
                <ViewReminder reminderid={currentID} />
            </div>
            <div className="modal-wrapper" id="modal-update">
                <UpdateReminder reminderid={currentID} />
            </div>
            <div className="modal-wrapper" id="modal-delete">
                <DeleteReminder reminderid={currentID} />
            </div>
        </div>
        
    )



}

export default ListReminders;