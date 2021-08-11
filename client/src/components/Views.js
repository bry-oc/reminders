import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import CreateReminder from './CreateReminder';
import UpdateReminder from './UpdateReminder';
import Account from './Account';
function Views(){
    return (
        <div>
            <Switch>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route path="/signup">
                    <Signup/>
                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/account">
                    <Account/>
                </Route>
                <Route path="/reminder/list">

                </Route>
                <Route path="/reminder/create">
                    <CreateReminder/>
                </Route>
                <Route path="/reminder/update">
                    <UpdateReminder/>
                </Route>
                <Route path="/reminder/delete">

                </Route>
            </Switch>
        </div>
    )
}

export default Views;