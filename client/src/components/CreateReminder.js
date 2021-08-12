function CreateReminder(){
    let createReminder = (e) => {
        e.preventDefault();
        const reminderName = e.target.name.value;
        const reminderDate = e.target.date.value;
        const reminderTime = e.target.time.value;
        const reminderRepeat  = e.target.repeat.value;
        const reminderDescription = e.target.description.value;

        const formData = new FormData();
        formData.append('reminderName', reminderName);
        formData.append('reminderDate', reminderDate);
        formData.append('reminderTime', reminderTime);
        formData.append('reminderRepeat', reminderRepeat);
        formData.append('reminderDescription', reminderDescription);
        console.log(formData);

        const url = '/api/reminder/create'

        fetch(url, { 
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                    window.location.href = "/account";
                }
            })
        
    }
    return (
        <div className="wrapper">
            <form onSubmit={createReminder}>
                <label htmlFor="name">Name:<br />
                    <input type="text" placeholder="Enter reminder name" id="name" required>
                    </input>
                </label><br />                
                <label htmlFor="date">Date:<br />
                    <input type="date" id="date" required>
                    </input>
                </label><br />
                <label htmlFor="time">Time:<br />
                    <input type="time" id="time" required>
                    </input>
                </label><br />
                <label htmlFor="repeat">Repeat:<br />
                    <select id="repeat">
                        <option value="none" id="none" selected>None</option>
                        <option value="daily" id="daily">Daily</option>
                        <option value="weekly" id="weekly">Weekly</option>
                        <option value="biweekly" id="biweekly">Biweekly</option>
                        <option value="monthly" id="monthly">Monthly</option>
                    </select>
                </label><br />
                <label htmlFor="description">Description (Optional):<br />
                    <textarea name="description" placeholder="Enter your description here..." id="description">
                    </textarea>
                </label><br />                
                <button type="submit">Create Reminder</button>
            </form>
        </div>
    )
}

export default CreateReminder;