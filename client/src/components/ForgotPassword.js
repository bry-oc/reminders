function ForgotPassword() {
    let forgotPassword = (e) => {
        const url = '/api/user/password/reset';

        const email = e.target.email.value;

        const formData = new FormData();
        formData.append('email', email);

        fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data.message);
                }
            })
    }
    return (
        <div className="wrapper">
            <form onSubmit={forgotPassword}>
                <label>Email:<br />
                    <input type="text" placeholder="Enter your email" required>
                    </input>
                </label><br />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ForgotPassword;