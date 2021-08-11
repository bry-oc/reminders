function Signup() {
    return (
        <div className="wrapper">
            <form>
                <label>Email:<br />
                    <input type="text" placeholder="Enter your email" required>
                    </input>
                </label><br />
                <label>Username:<br />
                    <input type="text" placeholder="Enter your username" required>
                    </input>
                </label><br />
                <label>Password:<br />
                    <input type="text" placeholder="Enter your password" required>
                    </input>
                </label><br />
                <button id="submit" type="submit">Create Account</button>
            </form>
        </div>
    )
}

export default Signup;