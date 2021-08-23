import React, {useEffect, useState} from "react";
function UpdateReminder(props) {
    const [reminderID, setReminderID] = useState();
    useEffect(() => {
        setReminderID(props.reminderid);
    }, [props.reminderid]);    
    return (
        <div className="wrapper">
            <p>{props.reminderid}</p>
            <form>
                <label htmlFor="name">Name:<br />
                    <input type="text" placeholder="Enter reminder name" required>
                    </input>
                </label><br />
                <label htmlFor="description">Description (Optional):<br />
                    <textarea name="description" placeholder="Enter your description here...">
                    </textarea>
                </label><br />
                <label htmlFor="date">Date:<br />
                    <input type="date">
                    </input>
                </label><br />
                <label htmlFor="time">Time:<br />
                    <input type="time">
                    </input>
                </label><br />
                <label htmlFor="repeat">Repeat:<br />
                    <select form="repeat">
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