import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";

function ForgotPassword() {
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (modalVisible && !success) {
            $(document).on("click", function (e) {
                var container = $(".modal");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    closeMessage();
                    setModalVisible(false);
                    $(document).off("click");
                }
            });
        }
    }, [modalVisible])

    let forgotPassword = (e) => {
        e.preventDefault();
        const url = '/api/user/password/reset';

        const email = e.target.email.value;

        const formData = new FormData();
        formData.append('email', email);

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
                    openMessage();
                } else {
                    console.log(data.message);
                    setMessage(data.message);
                    setSuccess(true);
                    openMessage();
                }
            })
    }

    function openMessage() {
        setModalVisible(true);
        let modalSignup = document.getElementById("modal-forgotPassword");
        modalSignup.style.display = "flex";
    }

    let closeMessage = (e) => {
        setModalVisible(false);
        let modalSignupClose = document.getElementById("modal-forgotPassword");
        modalSignupClose.style.display = "none";
        $(document).off("click");
    }

    return (
        <div>
            <div className="wrapper">
                <h1>Password Recovery</h1>
                <form onSubmit={forgotPassword}>
                    <label>Email:<br />
                        <input name="email" type="text" placeholder="Enter your email" required>
                        </input>
                    </label><br /><br />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
            <div className="modal-wrapper" id="modal-forgotPassword">
                <div className="wrapper modal" id="forgotPassword">
                    <i className="fa fa-times-circle fa-2x" onClick={closeMessage}></i><br />
                    <h2>Password Recovery</h2>
                    <p className="message">{message}</p>
                    {success ? (<Link to="/login"><button>Go to Login</button></Link>) : (null)}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;