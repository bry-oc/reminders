import React, { useContext } from "react";
import authContext from './AuthContext';

function UpdateEmail() {
    const { auth, setAuth } = useContext(authContext);
    
    let updateEmail = (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        const formData = new FormData();
        formData.append('email', email);

        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/user/email/update';
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
                                url = '/api/user/email/update';

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
            <form onSubmit={updateEmail}>
                <label htmlFor="email">New Email:<br />
                    <input type="text" name="email" placeholder="Enter your email" required>
                    </input>
                </label><br />
                <button type="submit">Change Email</button>
            </form>
        </div>
    )    
}

export default UpdateEmail;