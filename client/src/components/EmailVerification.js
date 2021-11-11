import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function EmailVerification(){
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState('');
    const { userid, token } = useParams();

    useEffect(() => {
        const url = "/api/emailconfirmation/" + userid + "/" + token;

        fetch(url, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setMessage(data.error);
                    setSuccess('error');
                } else {
                    console.log(data.message);
                    setMessage(data.message);
                    setSuccess('message');
                }
            })
    })
    
    return (
        <div className="wrapper" id="emailverification">
            <h1>Email Verification</h1>
            <p>{message}</p>
            { success === 'message'? (<Link to="/login"><button>Go to Login</button></Link>) : (null)}
            { success === 'error' ? (<Link to="/email/resend/verification"><button>Resend Email Verification</button></Link>) : (null)}
        </div>  
    )
}

export default EmailVerification;