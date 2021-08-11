function Login(){
    return (
        <div className="wrapper">
            <form>
                <label>Username:<br/>
                    <input type="text" placeholder="Enter your username" required>
                    </input>
                </label><br />
                <label>Password:<br />
                    <input type="text" placeholder="Enter your password" required>
                    </input>
                </label><br />
                <a>Forgot password?</a><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )    
}

export default Login;