function Login(){

    let login = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const url = "/api/login";

        fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                console.log(data.error)
            } else {
                console.log(data)
            }
        })
    }
    return (
        <div className="wrapper">
            <form onSubmit={login}>
                <label htmlFor="username">Username:<br/>
                    <input type="text" placeholder="Enter your username" id="username" name="username" required>
                    </input>
                </label><br />
                <label htmlFor="password">Password:<br />
                    <input type="password" placeholder="Enter your password" id="password" name="password" required>
                    </input>
                </label><br />
                <a href={'/password/reset'}>Forgot password?</a><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )    
}

export default Login;