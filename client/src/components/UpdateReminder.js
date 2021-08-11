function UpdateReminder() {
    return (
        <div className="wrapper">
            <form>
                <label for="name">Name:<br />
                    <input type="text" placeholder="Enter reminder name" required>
                    </input>
                </label><br />
                <label for="description">Description (Optional):<br />
                    <textarea name="description" placeholder="Enter your description here...">
                    </textarea>
                </label><br />
                <label for="date">Date:<br />
                    <input type="date">
                    </input>
                </label><br />
                <label for="time">Time:<br />
                    <input type="time">
                    </input>
                </label><br />
                <label for="repeat">Repeat:<br />
                    <select form="repeat">
                        <option value="none" selected>None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </label><br />
                <button type="submit">Update Reminder</button>
            </form>
        </div>
    )
}

export default UpdateReminder;