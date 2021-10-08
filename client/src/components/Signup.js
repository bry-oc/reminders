import React, { useEffect, useState } from "react";
import $ from "jquery";

function Signup() {
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [passwordFocused, setPasswordFocused] = React.useState(false);
    const onPasswordFocus = () => setPasswordFocused(true);
    const onPasswordBlur = () => setPasswordFocused(false);
    const [usernameFocused, setUsernameFocused] = React.useState(false);
    const onUsernameFocus = () => setUsernameFocused(true);
    const onUsernameBlur = () => setUsernameFocused(false);
    const [emailFocused, setEmailFocused] = React.useState(false);
    const onEmailFocus = () => setEmailFocused(true);
    const onEmailBlur = () => setEmailFocused(false);

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
                        {!emailFocused ? (null) : (<div> <p className="rules">Please enter a valid email address.</p></div>)}
                        <input type="text" placeholder="Enter your email" id="email" name="email" onFocus={onEmailFocus} onBlur={onEmailBlur} required>
                        </input>
                    </label><br /><br />
                    <label htmlFor="username">Username:<br />
                        {!usernameFocused ? (null) : (<div>
                            <p className="rules">May contain only alphanumeric characters.</p>
                            <ul>
                                <li><p className="rules">Minimum length of six (6) characters</p></li>
                                <li><p className="rules">Maximum length of twenty (20) characters</p></li>
                            </ul> </div>)}
                        <input type="text" placeholder="Enter your username" id="username" name="username" onFocus={onUsernameFocus} onBlur={onUsernameBlur} required>
                        </input>
                    </label><br /><br />
                    <label htmlFor="password">Password:<br />
                        {!passwordFocused ? (null) : (<div> <p className="rules">May contain only alphanumeric and special characters.</p>
                        <p className="rules">Must contain atleast:</p>
                        <ul>
                            <li><p className="rules">One lowercase</p></li>
                            <li><p className="rules">One uppercase</p></li>
                            <li><p className="rules">One special character</p></li>
                            <li><p className="rules">One number</p></li>
                        </ul> </div>)} 
                        <input type="password" placeholder="Enter your password" id="password" name="password" onFocus={onPasswordFocus} onBlur={onPasswordBlur} required>
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