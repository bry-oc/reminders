import React, { useContext, useEffect, useState } from "react";
import authContext from './AuthContext';
import { Link  } from 'react-router-dom';

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
                    <h1>Account Management</h1>
                    <div className="userinfo">
                        <p><b>Username:</b> {username}</p>
                        <p><b>Email:</b> {email}</p >
                    </div> 
                    <br/>
                    <Link to="/username/edit"><button>Change Username</button></Link><br />
                    <Link to="/email/edit"><button>Change Email</button></Link><br />
                    <Link to="/password/edit"><button>Change Password</button></Link><br />
                    <Link to="/user/delete"><button>Delete Account</button></Link><br />
                </div>
            )}
        </div>
    )
}


export default Account;