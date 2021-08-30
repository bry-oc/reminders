import React, { useContext } from "react";
import authContext from './AuthContext';

function UpdatePassword() {
    const { auth, setAuth } = useContext(authContext);

    let updatePassword = (e) => {
        e.preventDefault();
        const password = e.target.password.value;

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
                                console.log(data.error);
                            } else {
                                console.log(data.message);
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
                                            console.log(data.error);
                                        } else {
                                            console.log(data.message);
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
            <form onSubmit={updatePassword}>
                <label htmlFor="password">New Password:<br />
                    <input type="text" name="password" placeholder="Enter your password" required>
                    </input>
                </label><br />
                <button type="submit">Change Password</button>
            </form>
        </div>
    )
}

export default UpdatePassword;