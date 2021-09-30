import React, { useContext, useEffect, useState } from "react";
import authContext from './AuthContext';

function Account(){
    const { auth, setAuth } = useContext(authContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                }
            })
        
    }

    return(
        <div className="wrapper" id="account">   
            {loading ? (
                <div>
                    <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                </div>
            )
            : 
            (
                <div>
                    <p><b>Email:</b></p >
                    <p>{email}</p>
                    <p><b>Username:</b></p>
                    <p>{username}</p><br />
                    <button onClick={() => window.location.href="/username/edit"}>Change Username</button><br/>
                    <button onClick={() => window.location.href = "/email/edit"}>Change Email</button><br />
                    <button onClick={() => window.location.href = "/password/edit"}>Change Password</button><br />
                    <button onClick={() => window.location.href = "/user/delete"}>Delete Account</button>                    
                </div>
            )}
        </div>
    )
}


export default Account;