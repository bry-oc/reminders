function UpdateUsername(){
    return (
        <div className="wrapper">
            <form>
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