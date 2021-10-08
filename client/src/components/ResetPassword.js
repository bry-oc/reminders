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

    let resetPassword = (e) => {
        const userID = req.params.userid;
        e.preventDefault();
        const url = '/api/user/password/reset/' + userID;

        const token = e.target.token.value;
        const password = e.target.password.value;

        const formData = new FormData();
        formData.append('token', token);
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
                <h1>Reset Password</h1>
                <form onSubmit={resetPassword}>
                    <label>Enter new password:<br />
                        <input name="password" type="text" placeholder="Enter your password" required>
                        </input>
                    </label><br /><br />
                    <label>Confirm password:<br />
                        <input name="passwordCofirm" type="text" placeholder="Enter your password" required>
                        </input>
                    </label><br /><br />
                    <label>Reset Token:<br />
                        <input name="token" type="text" placeholder="Enter your token" required>
                        </input>
                    </label><br /><br />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
            <div className="modal-wrapper" id="modal-forgotPassword">
                <div className="wrapper modal" id="forgotPassword">
                    <i className="fa fa-times-circle fa-2x" onClick={closeMessage}></i><br />
                    <h2>Password Reset</h2>
                    <p className="message">{message}</p>
                    {success ? (<Link to="/login"><button>Go to Login</button></Link>) : (null)}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;