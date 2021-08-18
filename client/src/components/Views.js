import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import CreateReminder from './CreateReminder';
import UpdateReminder from './UpdateReminder';
import DeleteReminder from './DeleteReminder';
import ListReminders from './ListReminders';
import ForgotPassword  from './ForgotPassword';
import Account from './Account';
import UpdateUsername from './UpdateUsername';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';
import authContext from './AuthContext';
import React, { useContext } from 'react';


const PrivateRoute = ({ component, ...options }) => {
    const { auth } = useContext(authContext);
    const finalComponent = auth ? component : Login;

    return <Route {...options} component={finalComponent} />;
};

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
                <PrivateRoute path="/account" component={Account}/>
                <PrivateRoute path="/logout" component={Logout} />
                <PrivateRoute path="/reminder/list" component={ListReminders}/>
                <PrivateRoute path="/reminder/create" component={CreateReminder}/>
                <PrivateRoute path="/reminder/update" component={UpdateReminder}/>
                <PrivateRoute path="/reminder/delete" component={DeleteReminder}/>
                <PrivateRoute path="/password/reset" component={ForgotPassword}/>
                <PrivateRoute path="/username/edit" component={UpdateUsername}/>
                <PrivateRoute path="/email/edit" component={UpdateEmail}/>
                <PrivateRoute path="/password/edit" component={UpdatePassword}/>           
            </Switch>
        </div>
    )
}

export default Views;