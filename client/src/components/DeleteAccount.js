import React from "react";

function DeleteAccount() {
    return (
        <div>
            <div className="wrapper">
                <h1>Account Deletion
                </h1>
                <p>Are you sure you want to delete your account? This decision is permanent.</p>
                <button type="submit">Delete Account</button>
            </div>
            <div className="modal-wrapper" id="modal-logout">
                <div className="wrapper modal" id="logout">
                    <p>Logout?</p>
                    <button type="submit">Yes</button><br />
                    <button type="submit">No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAccount;