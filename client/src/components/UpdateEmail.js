function UpdateEmail() {
    return (
        <div className="wrapper">
            <form>
                <label for="email">New Email:<br />
                    <input type="text" placeholder="Enter your email" required>
                    </input>
                </label><br />
                <button type="submit">Change Email</button>
            </form>
        </div>
    )    
}

export default UpdateEmail;