import React, { useContext } from "react";
import authContext from './AuthContext';

function Account(){
    const { auth } = useContext(authContext);
    console.log(auth);
    return(
        <div>
            <form action="/username/edit">
                <input type="submit" value="Change Username" />
            </form>
            <form action="/email/edit">
                <input type="submit" value="Change Email" />
            </form>
            <form action="/password/edit">
                <input type="submit" value="Change Password" />
            </form>
            <form action="/account/delete">
                <input type="submit" value="Delete Account" />
            </form>
        </div>
    )
}

export default Account;