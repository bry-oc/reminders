import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import $ from "jquery";

function ResetPassword() {
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [success, setSuccess] = useState(false);
    const { userid, token } = useParams();

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
        const userID = userid;
        e.preventDefault();
        const url = '/api/password/recovery/' + userID + '/' + token;

        const password = e.target.password.value;

        const formData = new FormData();
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
            <div className="wrapper" id="resetpassword">
                <h1>Reset Password</h1>
                <form onSubmit={resetPassword}>
                    <label>Enter new password:<br />
                        <div> <p className="rules">May contain only alphanumeric and special characters.</p>
                            <p className="rules">Must contain atleast:</p>
                            <ul>
                                <li><p className="rules">One lowercase</p></li>
                                <li><p className="rules">One uppercase</p></li>
                                <li><p className="rules">One special character</p></li>
                                <li><p className="rules">One number</p></li>
                            </ul> </div>
                        <input name="password" type="password" placeholder="Enter your password" required>
                        </input>
                    </label><br /><br />
                    <label>Confirm password:<br />
                        <input name="passwordCofirm" type="password" placeholder="Enter your password" required>
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

export default ResetPassword;