import { useState } from "react";

function Signup() {
    const [message, setMessage] = useState('');

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
                    setMessage(data.error);
                    openSignupModal();
                } else {
                    console.log(data.message);
                    setMessage(data.message);
                    openSignupModal();
                }
            })
    }

    function openSignupModal() {
        let modalSignup = document.getElementById("modal-signup");
        modalSignup.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    return (
        <div>
            <div className="wrapper">
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
            <div className="modal-wrapper" id="modal-signup">
                <div className="wrapper modal" id="signup">
                    <h2>Signup</h2>
                    <p>{message}</p>
                </div>
            </div>
        </div>
        
    )
}

export default Signup;