import React, { useEffect, useState, useContext } from "react";
import authContext from './AuthContext';
function DeleteReminder(props){
    const { auth, setAuth } = useContext(authContext);
    const [reminderID, setReminderID] = useState(0);
    const [reminderName, setReminderName] = useState('');
    const [reminderDescription, setReminderDescription] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderRepeat, setReminderRepeat] = useState('');

    useEffect(() => {
        setReminderID(props.reminderid);
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetReminder();
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
                                fetchGetReminder();
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
    }, [props.reminderid]);

    function fetchDeleteReminder() {
        const deleteReminderURL = '/api/reminder/delete' + props.reminderid;
        fetch(deleteReminderURL, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                console.log(data.error)
            } else {
                window.location.href = "/reminder/list";
            }
        })
    }

    function fetchGetReminder() {
        const updateReminderURL = '/api/reminder/view/' + props.reminderid;
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
            })
    }

    let closeDelete = (e) => {
        let modalDeleteClose = document.getElementById("modal-delete");
        modalDeleteClose.style.display = "none";
        document.body.style.overflow = "auto";
    }

    return (
        <div className="wrapper modal">            
            <i className="fa fa-times-circle fa-2x" onClick={closeDelete}></i><br />
            <h2>Delete Reminder</h2>
            <h3>Reminder Name: </h3>
            <p>{reminderName}</p>
            <h3>Reminder Date: </h3>
            <p>{reminderDate}</p>
            <h3>Reminder Time: </h3>
            <p>{reminderTime}</p>
            <h3>Reminder Repeat: </h3>
            <p>{reminderRepeat}</p>
            <h3>Reminder Description: </h3>
            <p>{reminderDescription}</p>
            <button type="submit" onClick={fetchDeleteReminder}>Delete Reminder</button>
        </div>
    )
}

export default DeleteReminder;