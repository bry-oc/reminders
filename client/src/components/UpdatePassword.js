function UpdatePassword() {
    let updatePassword = (e) => {
        e.preventDefault();
        const password = e.target.password.value;

        const formData = new FormData();
        formData.append('password', password);

        const url = '/api/user/password/update'
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
            <form onSubmit={updatePassword}>
                <label for="password">New Password:<br />
                    <input type="text" placeholder="Enter your password" required>
                    </input>
                </label><br />
                <button type="submit">Change Password</button>
            </form>
        </div>
    )    
}

export default UpdatePassword;