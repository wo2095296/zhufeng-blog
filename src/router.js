import React from 'react'
import {Link,Switch,Route,Router,Redirect,} from 'react-router-dom'
import createHistory from 'history/createHashHistory';
import Login from './pages/login'
import Home from './pages/home'
import Admin from './pages/admin'
let history=createHistory();
history.listen(function(location) {
    if (!sessionStorage.getItem('BLOG_TOKEN')) {
        window.location.hash='/';
        return false;
    }
})
export default class Routers extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route  path='/admin' component={Admin} />
                    <Redirect to='/' />
                </Switch>
            </Router>
        )
    }
}