import React, {useEffect, useState, useContext} from "react";
import authContext from './AuthContext';

function UpdateReminder(props) {
    const { auth, setAuth } = useContext(authContext);
    const [reminderID, setReminderID] = useState();
    const [reminderName, setReminderName] = useState();
    const [reminderDescription, setReminderDescription] = useState();
    const [reminderDate, setReminderDate] = useState();
    const [reminderTime, setReminderTime] = useState();
    const [reminderRepeat, setReminderRepeat] = useState();


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
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
    }, [props.reminderid]);
    
    function fetchUpdateReminders(){
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
        const updateReminderURL = '/api/reminder/view/' + reminderID;
        fetch(updateReminderURL, {
            method: 'GET',
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

    return (
        <div className="wrapper">
            <p>{props.reminderid}</p>
            <form>
                <label htmlFor="name">Name:<br />
                    <input type="text" value={reminderName} required>
                    </input>
                </label><br />
                <label htmlFor="description">Description (Optional):<br />
                    <textarea name="description" value={reminderDescription}>
                    </textarea>
                </label><br />
                <label htmlFor="date">Date:<br />
                    <input type="date" value={reminderDate}>
                    </input>
                </label><br />
                <label htmlFor="time">Time:<br />
                    <input type="time" value={reminderTime}>
                    </input>
                </label><br />
                <label htmlFor="repeat">Repeat:<br />
                    <select form="repeat" value={reminderRepeat}>
                        <option defaultValue="none" id="none">None</option>
                        <option value="daily" id="daily">Daily</option>
                        <option value="weekly" id="weekly">Weekly</option>
                        <option value="biweekly" id="biweekly">Biweekly</option>
                        <option value="monthly" id="monthly">Monthly</option>
                    </select>
                </label><br />
                <button type="submit">Update Reminder</button>
            </form>
        </div>
    )
}

export default UpdateReminder;