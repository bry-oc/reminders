import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import authContext from './AuthContext';
import $ from "jquery";
import DataTable from 'datatables.net';
import moment from 'moment';

function ListReminders() {
    const [reminders, setReminders] = useState([]);
    const [currentID, setCurrentID] = useState();
    const { auth, setAuth } = useContext(authContext);
    const [reminderID, setReminderID] = useState(0);
    const [reminderName, setReminderName] = useState('');
    const [reminderDescription, setReminderDescription] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderDisplayTime, setReminderDisplayTime] = useState('');
    const [reminderDisplayDate, setReminderDisplayDate] = useState('');
    const [reminderRepeat, setReminderRepeat] = useState('');
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [fetchSuccess, setFetchSuccess] = useState(true);
    const [warning, setWarning] = useState('');
    const { url_id } = useParams();

    useEffect(() => {
        let url = '/api/user/authentication';
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/reminder/list';

                    fetch(url, {
                        method: 'GET',
                        credentials: 'include'
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data);
                            if (data.error) {
                                console.log(data.error);
                            } else {
                                console.log(data.reminders);
                                setReminders(data.reminders);
                                if (url_id) {
                                    openView();
                                }
                                $(function () {
                                    $('#reminder-table').DataTable({    
                                        "lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, "All"]],
                                        "order": [[1, 'asc'], [2, 'asc']],
                                        aoColumns: [
                                            null,
                                            null,
                                            { "type": "dom-date" },
                                            null,
                                            { "bSortable": false },
                                            { "bSortable": false },
                                            { "bSortable": false }
                                        ]
                                    });
                                });
                                $.extend($.fn.dataTableExt.oSort, {
                                    "dom-date-pre": function (a) {
                                        return moment(a, "hh:mm A")
                                    },
                                    "dom-date-asc": function (a, b) {
                                        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                                    },
                                    "dom-date-desc": function (a, b) {
                                        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
                                    }
                                });
                            }
                        })
                    setTableLoading(false);
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
                                url = '/api/reminder/list';

                                fetch(url, {
                                    method: 'GET',
                                    credentials: 'include'
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if (data.error) {
                                            console.log(data.error);
                                        } else {
                                            console.log(data.reminders);
                                            setReminders(data.reminders);
                                            if (url_id) {
                                                openView();
                                            }
                                            $(function () {    
                                                $('#reminder-table').DataTable({
                                                    "order": [[1, 'asc'], [2, 'asc']],
                                                    aoColumns: [
                                                        null,
                                                        null,
                                                        { "type": "dom-date"},
                                                        null,
                                                        { "bSortable": false },
                                                        { "bSortable": false },
                                                        { "bSortable": false }
                                                    ]
                                                });
                                            });
                                            $.extend($.fn.dataTableExt.oSort, {
                                                "dom-date-pre": function (a) {
                                                    return moment(a, "hh:mm A")
                                                },
                                                "dom-date-asc": function (a, b) {
                                                    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                                                },
                                                "dom-date-desc": function (a, b) {
                                                    return ((a < b) ? 1 : ((a > b) ? -1 : 0));
                                                }
                                            });
                                        }
                                    })
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                            setTableLoading(false);
                        })
                }
            })
    }, []);

    useEffect(() => {
        if (modalVisible) {
            $(document).on("click", function (e) {
                var container = $(".modal");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    closeDelete();
                    closeEdit();
                    closeView();
                    setModalVisible(false);
                    $(document).off("click");
                }
            });
        }
    }, [modalVisible])

    let openView = (e) => {
        setModalVisible(true);
        let modalView = document.getElementById("modal-view");
        modalView.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e !== undefined ? e.target.name : url_id);

        setLoading(true);
        setReminderID(currentID);
        let fetchID = e !== undefined ? e.target.name : url_id;
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetReminder(fetchID);
                    console.log(fetchID);
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
                                fetchGetReminder(fetchID);
                                console.log(fetchID);
                            } else {
                                console.log(res.status);
                                setAuth(false);
                                setLoading(false);
                            }
                        })
                }
            })
    }

    function fetchGetReminder(reminderid) {
        const updateReminderURL = '/api/reminder/view/' + reminderid;
        fetch(updateReminderURL, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setFetchSuccess(false);
                } else {
                    console.log(data.reminder);
                    setFetchSuccess(true);
                    setReminderID(data.reminderid);
                    setReminderName(data.reminderName);
                    setReminderDescription(data.reminderDescription);
                    setReminderRepeat(data.reminderRepeat);
                    const date = new Date(parseInt(data.reminderTimestamp));
                    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
                    const year = date.getFullYear();
                    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    const reminderDate = year + '-' + month + '-' + day;                    
                    const reminderTime = hour + ':' + minutes;                    
                    setReminderDate(reminderDate);
                    setReminderTime(reminderTime);
                    let noonTime;

                    if (date.getHours() == 0) {
                        hour = 12;
                        noonTime = "AM";
                    } else if (date.getHours() >= 12) {
                        if (reminderDate.getHours() > 12) {
                            if (hour - 12 < 10 || hour - 12 === 0) {
                                hour = "0" + (hour - 12);
                            } else {
                                hour = hour - 12;
                            }
                        }
                        noonTime = "PM";
                    } else {
                        noonTime = "AM";
                    }
                    setReminderDisplayTime(hour + ":" + minutes + " " + noonTime);
                    setReminderDisplayDate(month + "/" + day + "/" + year);
                }
                setLoading(false);
                setModalVisible(true);
            })
    }

    function sortByDate(a, b) {
        return new Date(parseInt(b.date)) > new Date(parseInt(a.date)) ? -1 : 1;
    }

    let closeView = (e) => {
        setReminderDescription('');
        setReminderName('');
        setReminderDate('');
        setReminderTime('');
        setReminderRepeat('');
        setLoading(true);
        let modalViewClose = document.getElementById("modal-view");
        modalViewClose.style.display = "none";
        document.body.style.overflow = "auto";
        setModalVisible(false);
        $(document).off("click");
    }

    let openEdit = (e) => {
        let modalEdit = document.getElementById("modal-update");
        modalEdit.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);

        setReminderID(e.target.name);
        let fetchID = e.target.name;
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetReminder(fetchID);
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
                                fetchGetReminder(fetchID);
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
    }

    let fetchUpdateReminder = (e) => {
        e.preventDefault();

        const reminderHours = reminderTime.split(':')[0];
        const reminderMinutes = reminderTime.split(':')[1];
        let reminderTimestamp = new Date(reminderDate.replace('-', '/'));
        console.log(reminderTimestamp);
        reminderTimestamp.setHours(reminderHours);
        reminderTimestamp.setMinutes(reminderMinutes);
        reminderTimestamp = reminderTimestamp.getTime();
        console.log(reminderTimestamp);

        const formData = new FormData();

        formData.append('reminderid', reminderID);
        formData.append('reminderName', reminderName);
        formData.append('reminderTimestamp', reminderTimestamp);
        formData.append('reminderRepeat', reminderRepeat);
        formData.append('reminderDescription', reminderDescription);

        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/reminder/update';
                    fetch(url, {
                        method: 'POST',
                        body: formData,
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
                                window.location.href = "/reminder/list";
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
                                url = '/api/reminder/update';

                                fetch(url, {
                                    method: 'POST',
                                    body: formData,
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
                                            window.location.href = "/reminder/list";
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

    let closeEdit = (e) => {
        let modalEditClose = document.getElementById("modal-update");
        modalEditClose.style.display = "none";
        document.body.style.overflow = "auto";
        setReminderDescription('');
        setReminderName('');
        setReminderDate('');
        setReminderTime('');
        setReminderRepeat('');
        setLoading(true);
        setModalVisible(false);
        $(document).off("click");
    }

    let openDelete = (e) => {
        let modalDelete = document.getElementById("modal-delete");
        modalDelete.style.display = "flex";
        document.body.style.overflow = "hidden";
        setCurrentID(e.target.name);

        let fetchID = e.target.name;
        setReminderID(e.target.name);
        const url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    fetchGetReminder(fetchID);
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
                                fetchGetReminder(fetchID);
                            } else {
                                console.log(res.status);
                                setAuth(false);
                            }
                        })
                }
            })
        setModalVisible(true);
    }

    let fetchDeleteReminder = (e) => {
        e.preventDefault();
        let url = '/api/user/authentication';

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuth(true);
                    console.log(auth);
                    url = '/api/reminder/delete/' + reminderID;
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
                                window.location.href = "/reminder/list";
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
                                url = '/api/reminder/delete/' + reminderID;

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
                                            window.location.href = "/reminder/list";
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

    let closeDelete = (e) => {
        let modalDeleteClose = document.getElementById("modal-delete");
        modalDeleteClose.style.display = "none";
        document.body.style.overflow = "auto";
        setReminderDescription('');
        setReminderName('');
        setReminderDate('');
        setReminderTime('');
        setReminderRepeat('');
        setLoading(true);
        setModalVisible(false);
        $(document).off("click");
    }

    //sort by date/time
    function TableData() {
        return reminders.map((reminder) => {
            const { reminderid, name, date, repeat } = reminder;
            let reminderDate = new Date(parseInt(date));
            const day = reminderDate.getDate() < 10 ? "0" + reminderDate.getDate() : reminderDate.getDate();
            const month = (reminderDate.getMonth() + 1) < 10 ? "0" + (reminderDate.getMonth() + 1) : (reminderDate.getMonth() + 1);
            const year = reminderDate.getFullYear();
            let hour = reminderDate.getHours() < 10 ? "0" + reminderDate.getHours() : reminderDate.getHours();
            const minutes = reminderDate.getMinutes() < 10 ? "0" + reminderDate.getMinutes() : reminderDate.getMinutes();            
            let noonTime;
            if (reminderDate.getHours() == 0) {
                hour = 12;
                noonTime = "AM";
            } else if (reminderDate.getHours() >= 12) {
                if (reminderDate.getHours() > 12) {
                    if (hour - 12 < 10 || hour - 12 === 0) {
                        hour = "0" + (hour - 12);
                    } else {
                        hour = hour - 12;
                    }                    
                }
                noonTime = "PM";
            } else {
                noonTime = "AM";
            }
            const reminderTime = hour + ':' + minutes;
            reminderDate = month + "/" + day + "/" + year;
           
            return (
                
                    <tr key={reminderid}>
                        <td>{name}</td>
                        <td>{reminderDate}</td>
                        <td>{reminderTime + " " + noonTime}</td>
                        <td>{repeat.charAt(0).toUpperCase() + repeat.slice(1)}</td>
                        <td><button onClick={openView} name={reminderid}><i className="fa fa-ellipsis-h fa-2x"></i></button></td>
                        <td><button onClick={openEdit} name={reminderid}><i className="fa fa-edit fa-2x"></i></button></td>
                        <td><button onClick={openDelete} name={reminderid}><i className="fa fa-trash fa-2x"></i></button></td>
                    </tr>
                
            )
        })
    }

    const currentDate = new Date();
    const day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
    const month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();
    const today = year + '-' + month + '-' + day;

    return (
        <div className="list-wrapper">         
            <div className="table-wrapper">     
                <h1>Reminders</h1>
                {tableLoading ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) :
                    (
                        
                    <table className="table" id="reminder-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Repeat</th>
                                <th>View</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>     
                        <tbody>                     
                            {TableData()}
                        </tbody>
                    </table> )}
            </div>
            <div className="modal-wrapper" id="modal-view">
                {loading ? (
                    <div className="wrapper modal reminder">
                        <i className="fa fa-times-circle fa-2x" onClick={closeView}></i><br />
                        <h2>View Reminder</h2>
                        <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                    </div>
                    ) 
                    :
                    (   
                        <div>
                        {fetchSuccess ? (
                            <div className="wrapper modal reminder">
                                <i className="fa fa-times-circle fa-2x" onClick={closeView}></i><br />
                                <h2>View Reminder</h2>
                                <h3>Name: </h3>
                                <p>{reminderName}</p>
                                <h3>Date: </h3>
                                <p>{reminderDisplayDate}</p>
                                <h3>Time: </h3>
                                <p>{reminderDisplayTime}</p>
                                <h3>Repeat: </h3>
                                <p>{reminderRepeat}</p>
                                <h3>Description: </h3>
                                <p>{reminderDescription}</p>
                            </div>
                        ) : (
                            <div className = "wrapper modal reminder">
                                <i className = "fa fa-times-circle fa-2x" onClick = { closeView }></i><br />
                                <h2>View Reminder</h2>
                                <p className= "warning">Reminder Does Not Exists.</p>
                            </div>
                        )}
                        </div>
                    )}
            </div>
            <div className="modal-wrapper" id="modal-update">
                {loading ? (
                    <div className="wrapper modal reminder">
                        <i className="fa fa-times-circle fa-2x" onClick={closeEdit}></i><br />
                        <h2>Edit Reminder</h2>
                        <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                    </div>
                )
                :
                (
                    <div className="wrapper modal reminder">
                        <i className="fa fa-times-circle fa-2x" onClick={closeEdit}></i><br />
                        <h2>Edit Reminder</h2>
                        <form onSubmit={fetchUpdateReminder}>
                                <label htmlFor="reminderName" id="name">Name:<br />
                                    <input type="text" value={reminderName} name="reminderName" onChange={(e => setReminderName(e.target.value))} required>
                                </input>
                            </label><br /><br />
                            <label htmlFor="date">Date:<br />
                                    <input type="date" value={reminderDate} min={today} name="reminderDate" onChange={(e => setReminderDate(e.target.value))}>
                                </input>
                            </label><br /><br />
                            <label htmlFor="time">Time:<br />
                                    <input type="time" value={reminderTime} name="reminderTime" onChange={(e => setReminderTime(e.target.value))}>
                                </input>
                            </label><br /><br />
                            <label htmlFor="repeat">Repeat:<br />
                                    <select value={reminderRepeat} name="reminderRepeat" onChange={(e => setReminderRepeat(e.target.value))}>
                                    <option defaultValue="none" id="none">None</option>
                                    <option value="daily" id="daily">Daily</option>
                                    <option value="weekly" id="weekly">Weekly</option>
                                    <option value="biweekly" id="biweekly">Biweekly</option>
                                    <option value="monthly" id="monthly">Monthly</option>
                                </select>
                            </label><br /><br />
                            <label htmlFor="description">Description (Optional):<br />
                                    <textarea value={reminderDescription} name="reminderDescription" onChange={(e => setReminderDescription(e.target.value))}>
                                </textarea>
                            </label><br /><br />
                            <button type="submit" >Update Reminder</button>
                        </form>
                    </div>
                )}
            </div >
            <div className="modal-wrapper" id="modal-delete">
                {loading ? (
                    <div className="wrapper modal reminder">
                        <i className="fa fa-times-circle fa-2x" onClick={closeDelete}></i><br />
                        <h2>Delete Reminder</h2>
                        <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                    </div>
                )
                    :
                (
                    <div className="wrapper modal reminder">
                        <i className="fa fa-times-circle fa-2x" onClick={closeDelete}></i><br />
                        <h2>Delete Reminder</h2>
                        <h3>Reminder Name: </h3>
                        <p>{reminderName}</p>
                        <h3>Reminder Date: </h3>
                        <p>{reminderDisplayDate}</p>
                        <h3>Reminder Time: </h3>
                        <p>{reminderDisplayTime}</p>
                        <h3>Reminder Repeat: </h3>
                        <p>{reminderRepeat}</p>
                        <h3>Reminder Description: </h3>
                        <p>{reminderDescription}</p>
                        <button type="submit" onClick={fetchDeleteReminder}>Delete Reminder</button>
                    </div>
                )}
            </div>
        </div >

    )



}

export default ListReminders;