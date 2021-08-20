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

    function TableData() {
        return reminders.map((reminder, index) => {
            const { reminderid, name, description, date, repeat } = reminder;
            return (
                <tr key={reminderid}>
                    <td>{name}</td>
                    <td>{date}</td>                    
                    <td>{repeat}</td>
                    <td>{description}</td>
                </tr>
            )
        })
    }

    return(
        <div className="wrapper">
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>                        
                        <th>Repeat</th>
                        <th>Description</th>
                    </tr>
                    {TableData()}
                </tbody>
            </table>
        </div>
    )
    
    
    
}

export default ListReminders;