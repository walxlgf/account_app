/* eslint no-dupe-keys: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ObjsHeader } from '../components/objsHeader';
import { WingBlank, WhiteSpace, Modal, List, ActionSheet } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { fetchPlayers, deletePlayer, subscribePlayers, unsubscribePlayers, deposit, withdraw,clear } from '../actions/players';
import { setPlayer, } from '../actions/editPlayer';

const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;

//actionSheet相关
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const myList = {
    flexBasis: 'initial',
}
const BUTTONS = ['编辑', '充值', '提现', '取消'];
class Players extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`players:componentWillMount:`);
        this.props.fetchPlayers();
        this.props.subscribePlayers();
        this.setState({ canClear: false });
    }

    componentDidMount() {
        console.log(`players:componentDidMount:`);
    }

    componentWillUnmount() {
        console.log(`players:componentWillUnmount:`);
        this.props.unsubscribePlayers();
        if (this.state.canClear)
            this.props.clear();
    }

    componentWillReceiveProps(nextProps) {
        console.log(`players:componentWillReceiveProps:`);
    }

    onEditPlayer(player) {
        this.props.setPlayer(player);
        this.props.history.push('/editPlayer')
    };

    /**
     * 显示充值对话框
     * @param {*} gamePlayer 
     */
    showDepositModal(player) {
        let that = this;
        prompt('充值', `玩家：${player.get('name')} `, [
            { text: '取消' },
            { text: '确定 ', onPress: value => this.props.deposit(player, parseInt(value, 10)) },
        ], 'default', '', ['请输入充值金额']);
    }

    /**
     * 显示提现对话框
     * @param {*} gamePlayer 
     */
    showWithdrawModal(player) {
        prompt('提现', `玩家：${player.get('name')} `, [
            { text: '取消' },
            { text: '确定 ', onPress: value => this.props.withdraw(player, parseInt(value, 10)) },
        ], 'default', '', ['请输入提现金额']);
    }
    //点击玩家弹出操作actionSheet
    onPlayerClicked = (player) => {
        let that = this;
        console.log(`viewGame:onPlayerClicked:player:${player.get('name')}`);
        //弹出操作actionSheet
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            title: '玩家操作',
            message: `对玩家[${player.get('name')}]进行如下操作`,
            maskClosable: true,
            'data-seed': 'logId',
            wrapProps,
        },
            (buttonIndex) => {
                //根据按钮位置 确定操作
                switch (buttonIndex) {
                    case 0:
                        that.onEditPlayer(player);
                        break;
                    case 1:
                        that.showDepositModal(player);
                        break;
                    case 2:
                        that.showWithdrawModal(player);
                        break;
                }

            });
    };
    render() {
        let players = this.props.players;

        return (<div>
            <ObjsHeader
                title='玩家'
                goBack={() => {
                    this.setState({ canClear: true });
                    this.props.history.goBack();
                }}
                pushAdd={() => {

                    this.props.history.push('/addPlayer')
                }}
            />
            <WingBlank>
                <List renderHeader={() => '玩家列表'} style={myList}>
                    {
                        players && players.map((player, index) => {
                            return <Item
                                key={player.id}
                                arrow='horizontal'
                                extra={`${player.get('balance')}积分`}
                                onClick={() => { this.onPlayerClicked(player) }}
                            >{player.get('name')}
                                <Brief>
                                    {player.get('rakeoff') ?
                                        `${player.get('rakeoff').get('name')} 赢:${player.get('rakeoff').get('win')}% 输:${player.get('rakeoff').get('lose')}%`
                                        : '未设置回水方案'}
                                </Brief>
                            </Item>
                        })
                    }
                </List>
            </WingBlank>
        </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        //获取
        fetching: state.players.fetching,
        players: state.players.players,
        //
        error: state.players.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchPlayers: bindActionCreators(fetchPlayers, dispatch),
        setPlayer: bindActionCreators(setPlayer, dispatch),
        deposit: bindActionCreators(deposit, dispatch),
        withdraw: bindActionCreators(withdraw, dispatch),
        subscribePlayers: bindActionCreators(subscribePlayers, dispatch),
        unsubscribePlayers: bindActionCreators(unsubscribePlayers, dispatch),
        clear: bindActionCreators(clear, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps)(Players)
);