function UpdateEmail() {
    let updateEmail = (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        const formData = new FormData();
        formData.append('email', email);

        const url = '/api/user/email/update'
        fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then((res)=>res.json())
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
            <form onSubmit={updateEmail}>
                <label for="email">New Email:<br />
                    <input type="text" placeholder="Enter your email" required>
                    </input>
                </label><br />
                <button type="submit">Change Email</button>
            </form>
        </div>
    )    
}

export default UpdateEmail;