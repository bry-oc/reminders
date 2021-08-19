import React, { useEffect, useState } from "react";

function ListReminders() {
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const url = '/api/reminder/list';

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
    }, []);
    
    return(
        <div className="wrapper">

        </div>
    )
}

export default ListReminders;