import React, { useContext } from "react";
import authContext from './AuthContext';

function DeleteAccount() {
    return (
        <div className="wrapper">
            <p>Are you sure you want to delete your account?</p>
            <button type="submit">Delete Account</button>
        </div>
    )
}

export default DeleteAccount;