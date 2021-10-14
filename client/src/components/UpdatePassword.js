import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import authContext from './AuthContext';
import $ from "jquery";

function UpdatePassword() {
    const { auth, setAuth } = useContext(authContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [warning, setWarning] = useState('');

    let updatePassword = (e) => {
        e.preventDefault();

        if (e.target.newpassword.value !== e.target.newpasswordconfirm.value) {
            setWarning('Password confirmation does not match.');
            return;
        }

        const currentPassword = e.target.currentpassword.value;
        const newPassword = e.target.newpassword.value;

        const formData = new FormData();
        formData.append('currentpassword', currentPassword);
        formData.append('newpassword', newPassword);
        

        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/user/password/update';
                    fetch(url, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                setWarning(data.error);
                                console.log(data.error);
                            } else {
                                console.log(data.message);
                                setWarning('');
                                window.location.href = "/account";
                            }
                        })
                } else {
                    console.log('refresh!');
                    const refresh = '/api/token/refresh';
                    fetch(refresh, {
                        method: 'GET',
                        credentials: 'include'
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                setAuth(true);
                                url = '/api/user/password/update';

                                fetch(url, {
                                    method: 'POST',
                                    body: formData,
                                    credentials: 'include'
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if (data.error) {
                                            setWarning(data.error);
                                            console.log(data.error);
                                        } else {
                                            console.log(data.message);
                                            setWarning('');
                                            openUpdatePassword();
                                        }
                                    })
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
    }

    function openUpdatePassword() {
        setModalVisible(true);
        let modalUpdatePassword = document.getElementById("modal-update-password");
        modalUpdatePassword.style.display = "flex";
    }

    let closeUpdatePassword = (e) => {
        setModalVisible(false);
        let modalUpdatePasswordClose = document.getElementById("modal-update-password");
        modalUpdatePasswordClose.style.display = "none";
        $(document).off("click");
    }

    return (
        <div>
            <div className="wrapper" id="updatepassword">
                <h1>Change Password</h1>
                <form onSubmit={updatePassword}>
                    <label htmlFor="password">Enter Current Password:<br />
                        <input type="password" name="currentpassword" placeholder="Enter your current password" required>
                        </input>
                    </label><br /><br />
                    <label htmlFor="password">New Password:<br />
                        <div> <p className="rules">May contain only alphanumeric and special characters.</p>
                            <p className="rules">Must contain atleast:</p>
                            <ul>
                                <li><p className="rules">One lowercase</p></li>
                                <li><p className="rules">One uppercase</p></li>
                                <li><p className="rules">One special character</p></li>
                                <li><p className="rules">One number</p></li>
                            </ul> </div>
                        <input type="password" name="newpassword" placeholder="Enter your new password" required>
                        </input>
                    </label><br /><br />
                    <label htmlFor="password">Confirm New Password:<br />
                        <input type="password" name="newpasswordconfirm" placeholder="Enter your new password" required>
                        </input>
                    </label><br />
                    <p>{warning}</p>
                    <button type="submit">Change Password</button>
                </form>
            </div>
            <div className="modal-wrapper" id="modal-update-password">
                <div className="wrapper modal">
                    <i className="fa fa-times-circle fa-2x" onClick={closeUpdatePassword}></i><br />
                    <h2>Password Successfully Changed</h2>
                    <Link to="/account" id="logout-link"><button onClick={closeUpdatePassword}>Go to Account</button></Link>
                </div>
            </div>
        </div>
        
    )
}

export default UpdatePassword;