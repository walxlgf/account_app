/* eslint no-dupe-keys: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { HomeHeader } from '../components/homeHeader';
import { WingBlank, WhiteSpace, Grid } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { logout } from "../actions/auth";
// import { setGame } from '../actions/game';
const subTitle = {
    color: '#888',
    fontSize: 14,
    padding: '15px 0 9px 15px'
};
const icon = 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png';
const gameData = [
    { value: 'games', text: '比赛列表', icon },
    { value: 'joinGame', text: '参加比赛', icon },
    { value: 'reqs', text: '请求上下分列表', icon },
];
const playerData = [
    { value: 'players', text: '玩家列表', icon },
    { value: 'addPlayer', text: '新增玩家', icon },
    { value: 'rakeoffs', text: '回水方案列表', icon },
    { value: 'addRakeoff', text: '新增回水方案', icon },
];


const reportData = [
    { value: 'report', text: '报表', icon },
];

const otherData = [
    { value: 'clubs', text: '俱乐部列表', icon },
];

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    onItemClicked = (item) => {
        switch (item.value) {
            case 'games':
                this.props.history.push('/games');
                break;
            case 'joinGame':
                this.props.history.push('/joinGame');
                break;
            case 'players':
                this.props.history.push('/players');
                break;
            case 'addPlayer':
                // this.props.setGame(null, 'add');
                this.props.history.push('/addPlayer')
                break;
            case 'rakeoffs':
                this.props.history.push('/rakeoffs')
                break;
            case 'addRakeoff':
                this.props.history.push('/addRakeoff')
                break;
            case 'reqs':
                this.props.history.push('/reqs');
                break;
            case 'clubs':
                this.props.history.push('/clubs');
                break;
            case 'report':
                this.props.history.push('/report');
                break;
        }
    }

    render() {
        return (<div>
            <HomeHeader
                logout={() => { this.props.logout() }}
            />
            <WingBlank>
                <div style={subTitle}>比赛 </div>
                <Grid data={gameData} columnNum={3} onClick={this.onItemClicked} />


                <div style={subTitle}>玩家 </div>
                <Grid data={playerData} columnNum={3} onClick={this.onItemClicked} />


                <div style={subTitle}>报表 </div>
                <Grid data={reportData} columnNum={3} onClick={this.onItemClicked} />

                <div style={subTitle}>其它 </div>
                <Grid data={otherData} columnNum={3} onClick={this.onItemClicked} />
            </WingBlank>

        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: bindActionCreators(logout, dispatch),
        // setGame: bindActionCreators(setGame, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps)(Home)
);