import React, { useContext, useEffect, useState } from "react";
import authContext from './AuthContext';

function Account(){
    const { auth, setAuth } = useContext(authContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetUser();
                    console.log(auth);
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
                                fetchGetUser();
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
    });

    function fetchGetUser(){
        const userURL = '/api/user/account'
        fetch( userURL, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data.username);
                    setUsername(data.username);
                    setEmail(data.email);
                }
            })
    }

    return(
        <div className="wrapper" id="account">            
            <p>Email:</p><br />
            <p>{email}</p>
            <p>Username:</p><br />
            <p>{username}</p><br />
            <form action="/username/edit">
                <input type="submit" value="Change Username" />
            </form><br/>
            <form action="/email/edit">
                <input type="submit" value="Change Email" />
            </form><br />
            <form action="/password/edit">
                <input type="submit" value="Change Password" />
            </form><br />
            <form action="/account/delete">
                <input type="submit" value="Delete Account" />
            </form>
        </div>
    )
}

export default Account;