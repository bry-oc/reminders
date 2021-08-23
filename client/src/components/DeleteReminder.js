import React, { useEffect, useState } from "react";
function DeleteReminder(props){
    const [reminderID, setReminderID] = useState();
    useEffect(() => {
        setReminderID(props.reminderid);
    }, [props.reminderid]);
    return (
        <div className="wrapper">
            <p>{props.reminderid}</p>
            <p>Reminder Name:</p><br/>
            <p>Reminder Date:</p><br/>
            <p>Reminder Time:</p><br/>
            <p>Are you sure you want to delete?</p><br/>
            <button type="submit">Delete Reminder</button>
        </div>
    )
}

export default DeleteReminder;