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



    let updateID = (e) => {
        console.log(e.target.name);
        setCurrentID(e.target.name);
    }

    function TableData() {
        return reminders.map((reminder, index) => {
            const { reminderid, name, description, date, repeat } = reminder;
            return (
                <tr key={reminderid}>
                    <td>{name}</td>
                    <td>{date}</td>
                    <td><button onClick={updateID} name={reminderid}>view</button></td>
                    <td><button onClick={updateID} name={reminderid}>edit</button></td>
                    <td><button onClick={updateID} name={reminderid}>delete</button></td>
                </tr>
            )
        })
    }

    return (
        <div className="wrapper">
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
            <ViewReminder reminderid={currentID} />
            <UpdateReminder reminderid={currentID} />
            <DeleteReminder reminderid={currentID} />
        </div>
    )



}

export default ListReminders;