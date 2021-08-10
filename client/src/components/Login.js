function Login(){
    return (
        <div className="wrapper">
            <form>
                <label>Username:
                    <input type="text" placeholder="Enter your username" required>
                    </input>
                </label>
                <label>Password:
                    <input type="text" placeholder="Enter your password" required>
                    </input>
                </label>
                <button id="submit" type="submit">Submit</button>
            </form>
        </div>
    )    
}

export default Login;