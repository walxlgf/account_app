import React from 'react';
import { WingBlank, List, WhiteSpace, ActionSheet, Modal, Button } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { ViewHeader } from '../components/viewHeader';
import { formatShortDate, formatCountdown } from '../utils';
import { subscribeGamePlayers, unsubscribeGamePlayers, clear, fetchGamePlayers, up } from '../actions/viewGame';
import { setJoinGame } from '../actions/joinGameInner';
import { setGameDown } from '../actions/gameDowns';
import { STATUS_FINISHED, STATUS_GAMING } from '../parse/game';


const prompt = Modal.prompt;

const subTitle = {
    color: '#888',
    fontSize: 14,
    padding: '15px 0 9px 15px'
};
//actionSheet相关
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}


const Item = List.Item;
const Brief = Item.Brief;

const myList = {
    flexBasis: 'initial',
}

const BUTTONS = ['上分', '取消'];


class ViewGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            buttonIndex: -1,
            gamePlayer: null,
            canClear: false,//两种情况会触发componentWillUnmount 一是点击玩家参赛或其它按钮，这时不clear,二是返回，需要clear
        };
    }

    componentWillMount() {
        console.log(`viewGame:componentWillMount`);
        let game = this.props.game;
        this.props.fetchGamePlayers(game);
        this.props.subscribeGamePlayers(game);
        this.setState({ canClear: false });
    }

    componentDidMount() {
        console.log(`viewGame:componentDidMount`);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        console.log(`viewGame:componentWillUnmount`);
        this.props.unsubscribeGamePlayers();

        if (this.state.canClear)
            this.props.clear();
    }

    /**
     * 显示上分对话框
     * @param {*} gamePlayer 
     */
    showUpModal(gamePlayer) {
        let game = gamePlayer.get('game');
        let player = gamePlayer.get('player');
        prompt('上分', `玩家：${player.get('name')} 比赛：${game.get('name')}`, [
            { text: '取消' },
            { text: '确定 ', onPress: value => this.props.up(gamePlayer, parseInt(value, 10)) },
        ], 'default', '', ['请输入上分金额']);
    }


    //点击玩家弹出操作actionSheet
    onPlayerClicked = (gamePlayer) => {
        let that = this;
        console.log(`viewGame:onPlayerClicked:gamePlayer:${gamePlayer.get('player').get('name')}`);
        let player = gamePlayer.get('player');
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
                        that.showUpModal(gamePlayer);
                        break;
                }

            });
    };




    onModalClose = key => () => {
        this.setState({
            [key]: false,
        });


    }

    render() {
        let game = this.props.game;
        let gamePlayers = this.props.gamePlayers;
        let gamePlayer = this.state.gamePlayer;//选中gameplayer  用于弹出modal
        let buttonIndex = this.state.buttonIndex;//操作索引

        console.log(`viewGame:render:gamePlayers:${gamePlayers && gamePlayers.length}`);
        return (
            <div>
                <ViewHeader
                    title={'比赛详情'}
                    goBack={() => {
                        this.setState({ canClear: true });
                        this.props.history.goBack();

                    }}
                />

                <WingBlank>
                    <WhiteSpace size='md' />

                    <div style={subTitle}>操作列表 </div>
                    <Button type="primary" inline size="small"
                        style={{ marginRight: '4px', marginLeft: '8px' }}
                        disabled={STATUS_FINISHED === game.get('status') ? true : false}
                        onClick={() => {
                            this.props.setJoinGame(this.props.game);
                            this.props.history.push('/joinGameInner')
                        }}
                    >玩家参赛</Button>
                    {/* use `am-button-borderfix`. because Multiple buttons inline arranged, the last one border-right may not display */}

                    <Button type="primary" inline size="small" style={{ marginRight: '4px' }}
                        className="am-button-borderfix"
                        // disabled={STATUS_FINISHED === game.get('status') ? true : false}
                        onClick={() => {
                            this.props.setGameDown(game, gamePlayers);
                            this.props.history.push('/gameDowns')
                        }}
                    >最终分配</Button>


                    <WhiteSpace size='md' />
                    {
                        game && <List renderHeader={() => '比赛信息'} style={myList}>
                            <Item extra={game.get('name')}>名称</Item>
                            <Item extra={formatShortDate(game.get('startTime'))}>开始时间</Item>
                            <Item extra={`${game.get('duration')}分钟`}>比赛时长</Item>
                        </List>
                    }

                    <List renderHeader={() => '参赛玩家'} style={myList}>
                        {
                            gamePlayers && gamePlayers.map(gp => (
                                <Item
                                    key={gp.id}
                                    arrow='horizontal'
                                    extra={`${gp.get('chips')}积分`}
                                    onClick={() => { this.onPlayerClicked(gp) }}
                                >{gp.get('player').get('name')}</Item>
                            ))
                        }
                    </List>
                </WingBlank>
            </div >
        );
    }
}

// 



function mapStateToProps(state) {
    return {
        game: state.viewGame.game,
        fetching: state.viewGame.fetching,
        gamePlayers: state.viewGame.gamePlayers,
        error: state.viewGame.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clear: bindActionCreators(clear, dispatch),
        fetchGamePlayers: bindActionCreators(fetchGamePlayers, dispatch),
        up: bindActionCreators(up, dispatch),
        subscribeGamePlayers: bindActionCreators(subscribeGamePlayers, dispatch),
        unsubscribeGamePlayers: bindActionCreators(unsubscribeGamePlayers, dispatch),
        setJoinGame: bindActionCreators(setJoinGame, dispatch),
        setGameDown: bindActionCreators(setGameDown, dispatch),
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ViewGame)
);