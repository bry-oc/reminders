import { useEffect, useState } from "react";
import $ from "jquery";

function Signup() {
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            $(document).on("click", function (e) {
                var container = $(".modal");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    closeSignup();
                    setModalVisible(false);
                    $(document).off("click");
                }
            });
        }
    }, [modalVisible])

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
        setModalVisible(true);
        let modalSignup = document.getElementById("modal-signup");
        modalSignup.style.display = "flex";
    }

    let closeSignup = (e) => {
        setModalVisible(false);
        let modalSignupClose = document.getElementById("modal-signup");
        modalSignupClose.style.display = "none";
        $(document).off("click");
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
                    <i className="fa fa-times-circle fa-2x" onClick={closeSignup}></i><br />
                    <h2>Signup</h2>
                    <p>{message}</p>
                </div>
            </div>
        </div>
        
    )
}

export default Signup;