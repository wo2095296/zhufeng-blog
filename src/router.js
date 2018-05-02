import React from 'react'
import { Link, Switch, Route, HashRouter as Router, Redirect, } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Admin from './pages/admin'
export default class Routers extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route exact path='/home' component={Home} />
                    <Route exact path='/admin' component={Admin} />
                    <Redirect to='/' />
                </Switch>
            </Router>
        )
    }
}