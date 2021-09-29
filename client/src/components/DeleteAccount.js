import React from "react";

function DeleteAccount() {
    return (
        <div className="wrapper">
            <h1>Account Deletion
            </h1>
            <p>Are you sure you want to delete your account? This decision is permanent.</p>
            <button type="submit">Delete Account</button>
        </div>
    )
}

export default DeleteAccount;