import React, { useEffect, useState, useContext } from "react";
import authContext from './AuthContext';

function ViewReminder(props) {
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

    let closeView = (e) => {
        let modalViewClose = document.getElementById("modal-view");
        modalViewClose.style.display = "none";
        document.body.style.overflow = "auto";
    }

    return (
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
    )
}

export default ViewReminder;