function UpdatePassword() {
    return (
        <div className="wrapper">
            <form>
                <label for="password">New Password:<br />
                    <input type="text" placeholder="Enter your password" required>
                    </input>
                </label><br />
                <button type="submit">Change Password</button>
            </form>
        </div>
    )    
}

export default UpdatePassword;