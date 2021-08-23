function UpdateUsername(){
    let updateUsername = (e) => {
        e.preventDefault();
        const username = e.target.username.value;

        const formData = new FormData();
        formData.append('username', username);

        const url = '/api/user/username/update'
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
            <form onSubmit={updateUsername}>
                <label for="username">New Username:<br />
                    <input type="text" placeholder="Enter your username" required>
                    </input>
                </label><br />
                <button type="submit">Change Username</button>
            </form>
        </div>
    )    
}

export default UpdateUsername;