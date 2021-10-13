import React, { useContext, useState } from "react";
import authContext from './AuthContext';

function UpdatePassword() {
    const { auth, setAuth } = useContext(authContext);
    const [warning, setWarning] = useState('');

    let updatePassword = (e) => {
        e.preventDefault();

        if(e.target.newpassword !== e.target.newpasswordconfirm) {
            setWarning('Password confirmation does not match.');
            return;
        }

        const password = e.target.newpassword.value;

        const formData = new FormData();
        formData.append('password', password);

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
                                            window.location.href = "/account";
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

    return (
        <div className="wrapper">
            <h1>Change Password</h1>
            <form onSubmit={updatePassword}>
                <label htmlFor="password">Enter Current Password:<br />
                    <input type="password" name="currentpassword" placeholder="Enter your current password" required>
                    </input>
                </label><br /><br />
                <label htmlFor="password">New Password:<br />
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
    )
}

export default UpdatePassword;