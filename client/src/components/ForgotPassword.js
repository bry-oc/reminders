function ForgotPassword() {
    return (
        <div className="wrapper">
            <form>
                <label>Email:<br />
                    <input type="text" placeholder="Enter your email" required>
                    </input>
                </label><br />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ForgotPassword;