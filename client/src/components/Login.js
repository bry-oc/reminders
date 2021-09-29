import authContext from './AuthContext';
import React, { useContext } from "react";

function Login(){
    const [warning, setWarning] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);
    const { auth, setAuth } = useContext(authContext);

    let login = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const url = "/api/login";

        fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                setLoading(false);
                setWarning(data.error);
                console.log(data.error);
            } else {
                setAuth(true);
                setLoading(false);
                console.log(auth);
                console.log(data);
                window.location.href = "/account";
            }
        })
    }
    return (
        <div className="wrapper" id="login">
            {isLoading ? (
                <div>
                    <i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>
                </div>
            )
            :
            (
                <div>
                    <h1>Reminder App Login</h1>
                    <form onSubmit={login}>
                        <label htmlFor="username">Username:<br />
                            <input type="text" placeholder="Enter your username" id="username" name="username" required>
                            </input>
                        </label><br /><br />
                        <label htmlFor="password">Password:<br />
                            <input type="password" placeholder="Enter your password" id="password" name="password" required>
                            </input>
                        </label><br /><br />
                        <button type="submit">Login</button><br /><br />
                        <a href={'/password/reset'}>Forgot password?</a><br />
                    </form>
                    { warning !== "" ? <p className="warning">{warning}</p> : null }
                </div >
            )}
            
            
        </div>
    )    
}

export default Login;