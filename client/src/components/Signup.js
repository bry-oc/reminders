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
        <div className="wrapper">
            <form onSubmit={signup}>
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