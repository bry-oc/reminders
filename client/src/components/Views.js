import { Route, Switch } from 'react-router-dom';

function Views(){
    return (
        <div>
            <Switch>
                <Route exact path="/">

                </Route>
                <Route path="/signup">

                </Route>
                <Route path="/login">

                </Route>
                <Route path="/account">

                </Route>
                <Route path="/reminder/list">

                </Route>
                <Route path="/reminder/create">

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