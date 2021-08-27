function Signup() {
    let signup = (e) => {
        e.preventDefault();
        const url = '/api/signup';

        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;

        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);

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
                    console.log(data.message);
                }
            })
    }
    return (
        <div className="wrapper" id="signup">
            <h1>Create Your Account</h1>
            <form onSubmit={signup}>
                <label htmlFor="email">Email:<br />
                    <input type="text" placeholder="Enter your email" id="email" name="email" required>
                    </input>
                </label><br /><br />
                <label htmlFor="username">Username:<br />
                    <input type="text" placeholder="Enter your username" id="username" name="username" required>
                    </input>
                </label><br /><br />
                <label htmlFor="password">Password:<br />
                    <input type="password" placeholder="Enter your password" id="password" name="password" required>
                    </input>
                </label><br /><br />
                <button id="submit" type="submit">Create Account</button>
            </form>
        </div>
    )
}

export default Signup;