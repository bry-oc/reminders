import React, {useEffect, useState, useContext} from "react";
import authContext from './AuthContext';

function UpdateReminder(props) {
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
    
    function fetchUpdateReminder(){
        const updateReminderURL = '/api/reminder/update';
        fetch(updateReminderURL, {
            method: 'POST',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
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
                    const reminderDate = year  + '-' + month + '-' + day;
                    const reminderTime = hour + ':' + minutes;
                    setReminderDate(reminderDate);
                    setReminderTime(reminderTime);
                }
            })
    }

    return (
        <div className="wrapper modal">
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
    )
}

export default UpdateReminder;