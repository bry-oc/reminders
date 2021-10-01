import React, { useContext, useEffect, useState} from "react";
import authContext from './AuthContext';
import $ from "jquery";

function DeleteAccount() {
    const { auth, setAuth } = useContext(authContext);
    const [modalVisible, setModalVisible] = useState(false);
    
    useEffect(() => {
        if (modalVisible) {
            $(document).on("click", function (e) {
                var container = $(".modal");

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    let modalDeleteClose = document.getElementById("modal-delete");
                    modalDeleteClose.style.display = "none";
                    $(document).off("click");
                }
            });
        }
    },[modalVisible])

    function fetchDelete() {
        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/user/account/delete';
                    fetch(url, {
                        method: 'DELETE',
                        credentials: 'include'
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                setWarning(data.error);
                                console.log(data.error);
                            } else {
                                console.log(data.message);
                                setWarning('');
                                window.location.href = "/";
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
                                url = '/api/user/account/delete';

                                fetch(url, {
                                    method: 'DELETE',
                                    credentials: 'include'
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if (data.error) {
                                            setWarning(data.error);
                                            console.log(data.error);
                                        } else {
                                            console.log(data.message);
                                            setWarning('');
                                            window.location.href = "/";
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

    function openDelete() {
        setModalVisible(true);
        let modalDelete = document.getElementById("modal-delete");
        modalDelete.style.display = "flex";
    }

    function closeDelete() {
        setModalVisible(false);
        let modalDeleteClose = document.getElementById("modal-delete");
        modalDeleteClose.style.display = "none";
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
                    <button type="submit" onClick={fetchDelete}>Yes</button><br />
                    <button type="submit" onClick={closeDelete}>No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAccount;