import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import CreateReminder from './CreateReminder'
function Views(){
    return (
        <div>
            <Switch>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route path="/signup">

                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/account">

                </Route>
                <Route path="/reminder/list">

                </Route>
                <Route path="/reminder/create">
                    <CreateReminder/>
                </Route>
                <Route path="/reminder/update">

                </Route>
                <Route path="/reminder/delete">

                </Route>
            </Switch>
        </div>
    )
}

export default Views;