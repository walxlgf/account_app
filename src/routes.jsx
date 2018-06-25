import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './containers/home';
import Players from './containers/players';
import AddPlayer from './containers/addPlayer';
import EditPlayer from './containers/editPlayer';
import AddRakeoff from './containers/addRakeoff';
import Rakeoffs from './containers/rakeoffs';
import Clubs from './containers/clubs';
import EditClub from './containers/editClub';
import Games from './containers/games';
import AddGame from './containers/addGame';
import Reqs from './containers/reqs';
import EditReq from './containers/editReq';
import JoinGame from './containers/joinGame';
import JoinGameInner from './containers/joinGameInner';
import GameDowns from './containers/gameDowns';
import ViewGame from './containers/viewGame';
import Report from './containers/report';
import Login from './containers/login';
import Signup from './containers/signup';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
// import { subscribeGames, unsubscribeGames } from './actions/game';


class Routes extends Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        // //认证状态发生改变 对Games的监听也会改变
        // if (this.props.isAuthenticated != nextProps.isAuthenticated) {
        //     //如果已经登录 注册对Games的监听
        //     if (nextProps.isAuthenticated) {
        //         this.props.subscribeGames();
        //     }
        //     //如果logout，取消对Games的监听 
        //     else {
        //         this.props.unsubscribeGames();
        //     }
        // }
    }
    render() {
        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={props => (
                this.props.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                        <Redirect to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }} />
                    )
            )} />
        )
        return (
            <div>
                <Router>
                    <Switch>
                        <PrivateRoute exact path="/" component={Games} />
                        <PrivateRoute path='/home' component={Home} />
                        <PrivateRoute path='/clubs' component={Clubs} />
                        <PrivateRoute path='/editClub' component={EditClub} />
                        <PrivateRoute path='/players' component={Players} />
                        <PrivateRoute path='/addPlayer' component={AddPlayer} />
                        <PrivateRoute path='/editPlayer' component={EditPlayer} />
                        <PrivateRoute path='/addRakeoff' component={AddRakeoff} />
                        <PrivateRoute path='/rakeoffs' component={Rakeoffs} />
                        <PrivateRoute path='/games' component={Games} />
                        <PrivateRoute path='/addGame' component={AddGame} />
                        <PrivateRoute path='/reqs' component={Reqs} />
                        <PrivateRoute path='/editReq' component={EditReq} />
                        <PrivateRoute path='/joinGame' component={JoinGame} />
                        <PrivateRoute path='/joinGameInner' component={JoinGameInner} />
                        <PrivateRoute path='/gameDowns' component={GameDowns} />
                        <PrivateRoute path='/viewGame' component={ViewGame} />
                        <PrivateRoute path='/report' component={Report} />
                        <Route path='/login' component={Login} />
                        <Route path='/signup' component={Signup} />
                    </Switch>
                </Router>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // subscribeGames: bindActionCreators(subscribeGames, dispatch),
        // unsubscribeGames: bindActionCreators(unsubscribeGames, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Routes)

