import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ListReminders from './ListReminders';
import ForgotPassword  from './ForgotPassword';
import Account from './Account';
import UpdateUsername from './UpdateUsername';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';
import ResetPassword from './ResetPassword';
import ResendVerification from './ResendVerification';
import authContext from './AuthContext';
import React, { useContext } from 'react';

//todo: fix login showing briefly on refresh
const PrivateRoute = ({ component, ...options }) => {
    const { auth } = useContext(authContext);
    const finalComponent = auth ? component : Login;
    return <Route {...options} component={finalComponent} />;
};

function Views(){
    const { auth } = useContext(authContext);

    return (
        <div id="views">
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
                <Route path="/password/reset">
                    <ForgotPassword />
                </Route>
                <Route path="/password/recovery/:userid/:token">
                    <ResetPassword />
                </Route>
                <Route path="/email/resend/verfication">
                    <ResendVerification />
                </Route>
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/account" component={Account} />)}
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/reminder/list" component={ListReminders} />)}
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/password/reset" component={ForgotPassword} />)}
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/username/edit" component={UpdateUsername} />)}
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/email/edit" component={UpdateEmail} />)}
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/password/edit" component={UpdatePassword} />  )}
                {auth === null ? (<i className="fa fa-spinner fa-pulse fa-2x" id="spinner"></i>) : (<PrivateRoute path="/user/delete" component={DeleteAccount} />)}
            </Switch>
        </div>
    )
}

export default Views;