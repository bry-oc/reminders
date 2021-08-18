import authContext from './AuthContext';
import React, { useContext } from "react";

function Logout(){
    const { auth, setAuth } = useContext(authContext);

    let logout = () => {
        const url = "/api/logout";
        
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setAuth(false);
                    console.log(auth);
                    console.log(data);
                    window.location.href = "/";
                }
            })
    }
    return (
        <div className="wrapper">
            <button onClick={logout} type="submit">Log Out</button>
        </div>
    )
}

export default Logout;