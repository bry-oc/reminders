import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import CreateReminder from './CreateReminder';
import UpdateReminder from './UpdateReminder';
import DeleteReminder from './DeleteReminder';
import ForgotPassword  from './ForgotPassword';
import Account from './Account';
import UpdateUsername from './UpdateUsername';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';


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
                <Route path="/account/delete">
                    <DeleteAccount />
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
                    <DeleteReminder/>
                </Route>
                <Route path="/password/reset">
                    <ForgotPassword />
                </Route>
                <Route path="/username/edit">
                    <UpdateUsername />
                </Route>
                <Route path="/email/edit">
                    <UpdateEmail />
                </Route>
                <Route path="/password/edit">
                    <UpdatePassword />
                </Route>                
            </Switch>
        </div>
    )
}

export default Views;