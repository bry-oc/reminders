import React, { useContext, useState } from "react";
import authContext from './AuthContext';

function UpdateUsername(){
    const { auth, setAuth } = useContext(authContext);
    const [warning, setWarning] = useState('');

    let updateUsername = (e) => {
        e.preventDefault();
        const username = e.target.username.value;

        const formData = new FormData();
        formData.append('username', username);

        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/user/username/update';
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
                                url = '/api/user/username/update';

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
        <div className="wrapper" id="username">
            <h1>Change Username</h1>
            <form onSubmit={updateUsername}>
                <label htmlFor="username">New Username:<br />
                    <input type="text" name="username" placeholder="Enter your username" required>
                    </input>
                </label><br />
                <p>{warning}</p><br />
                <button type="submit">Change Username</button>
            </form>
        </div>
    )    
}

export default UpdateUsername;