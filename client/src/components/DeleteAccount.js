import React, { useEffect, useState} from "react";
import $ from "jquery";

function DeleteAccount() {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            $(document).on("click", function (e) {
                var container = $(".modal");

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    closeDelete();
                    setModalVisible(false);
                    $(document).off("click");
                }
            });
        }
    },[modalVisible])

    function openDelete() {
        setModalVisible(true);
        let modalDelete = document.getElementById("modal-delete");
        modalDelete.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeDelete() {
        setModalVisible(false);
        let modalDeleteClose = document.getElementById("modal-delete");
        modalDeleteClose.style.display = "none";
        document.body.style.overflow = "auto";
    }

    
    
    

    return (
        <div>
            <div className="wrapper">
                <h1>Account Deletion</h1>
                <h2>Are you sure you want to delete your account? This decision is permanent.</h2>
                <button type="submit" onClick={openDelete}>Delete Account</button>
            </div>
            <div className="modal-wrapper" id="modal-delete">
                <div className="wrapper modal" id="delete">
                    <h2>Permanently delete your account?</h2>
                    <button type="submit">Yes</button><br />
                    <button type="submit" onClick={closeDelete}>No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAccount;