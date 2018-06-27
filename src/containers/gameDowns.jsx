import React from 'react';
import { WingBlank, Toast, InputItem, List, Modal } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchRakeoffs, setFinalChips } from "../actions/gameDowns";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;

class GameDownsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedPlayers: [],
        };
    }

    componentWillMount() {
        console.log(`gameDowns:componentWillMount`);
    }

    componentDidMount() {
        console.log(`gameDowns:componentDidMount:`);
        //gameplayer.get('player').get('rakeoff') 层次太深 直接拿只能拿到id 
        //获取一个所有的rakeoffs，就可以拿到整个对象了 
        this.props.fetchRakeoffs();
    }

    componentWillReceiveProps(nextProps) {
        console.log(`gameDowns:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        } else {
            let gps = this.props.gamePlayers;
            let totalChips = 0;
            let totalFinalChips = 0;
            let totalShuiChips = 0;
            let restChips = totalChips;

            gps && gps.map(gp => {
                totalChips += gp.get('chips');
                let finalChips = gp.get('finalChips');
                if (finalChips)
                    totalFinalChips += finalChips

                let shuiChips = gp.get('shuiChips');
                if (shuiChips)
                    totalShuiChips += shuiChips
            })

            restChips = totalChips - totalFinalChips;

            this.setState({
                totalChips,
                totalFinalChips,
                totalShuiChips,
                restChips,
            })
        }
    }

    componentWillUnmount() {
        console.log(`gameDowns:componentWillUnmount`);
        this.props.clear();
    }

    validateField = (rule, value, callback) => {
        if (rule.field === 'player') {
            if (value) {
                callback();
            } else {
                callback(new Error('尚未选择玩家'));
            }
        }
        else {
            callback();
        }
    }

    onSubmit = () => {
        if (this.state.restChips !== 0) {
            let errors = `请把所有买入分配完成`;
            Toast.fail(errors, 2, null, true);
            return;
        }

        this.props.save(this.props.gamePlayers, this.props.game);
    }

    getRakeoffString = (gp) => {
        let rakeoffs = this.props.rakeoffs;
        let result = '';
        let player = gp.get('player');
        let rakeoff = player.get('rakeoff');

        // console.log(`gameDowns:getRakeoffString:rakeoff:${JSON.stringify(rakeoff)}`);

        if (!rakeoff)
            result = '未设置玩家回水方案。请设置'
        else {
            result = `赢抽${rakeoff.get('win')}% 输返${rakeoff.get('lose')}%`
            // if (rakeoffs) {
            //     let rakeoff = rakeoffs.find(function (value, index, arr) {
            //         return value.id === rakeoff.id;
            //     });
            //     if (rakeoff)
            // result = `${rakeoff.get('name')} 赢:${rakeoff.get('win')}% 输:${rakeoff.get('lose')}%`
            // }
        }
        return result;
    }

    getChipsString = (gamePlayer) => {
        let result = '';
        let chips = gamePlayer.get('chips');

        let finalChips = gamePlayer.get('finalChips');
        let winChips = gamePlayer.get('winChips');
        let shuiChips = gamePlayer.get('shuiChips');

        if (finalChips)
            result = `买${chips} 算${finalChips} 赢${winChips} 水${shuiChips}`
        else
            result = `买${chips} 请单击输入最终筹码`;

        return result;
    }



    /**
     * 显示上分对话框
     * @param {*} gamePlayer 
     */
    showFinalChipsModal(gamePlayer) {
        let that = this;
        let game = gamePlayer.get('game');
        let player = gamePlayer.get('player');
        let son = gamePlayer.get('son');
        prompt('结算', `玩家：${son.get('name')} [${player.get('name')}] 比赛：${game.get('name')} `, [
            { text: '取消' },
            { text: '确定 ', onPress: value => { that.props.setFinalChips(gamePlayer, parseInt(value, 10)) } },
        ], 'default', '', ['请输入最终筹码']);
    }

    onPlayerClicked = (gamePlayer) => {
        this.showFinalChipsModal(gamePlayer);
    }


    render() {
        let game = this.props.game;
        let gps = this.props.gamePlayers;
        return (
            <div>
                <EditHeader
                    title={'结算'}
                    opt={'add'}
                    save={() => this.onSubmit()}
                    goBack={() => {
                        this.props.history.goBack();
                    }}
                />
                <WingBlank>
                    <List renderHeader={() => '比赛'} className="my-list">
                        <Item extra={game.get('name')}>名称</Item>
                    </List>
                    <List renderHeader={() => '积分'} className="my-list">
                        <Item extra={this.state.totalChips}>总额</Item>
                        <Item extra={this.state.restChips}>剩余</Item>
                        <Item extra={this.state.totalShuiChips}>水钱</Item>
                    </List>
                    <List renderHeader={() => '玩家'} className="my-list">
                        {
                            gps && gps.map(gp => (
                                <Item
                                    wrap
                                    key={gp.id}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => { this.onPlayerClicked(gp) }}>
                                    {gp.get('son').get('name')}[{gp.get('player').get('name')}]: {this.getChipsString(gp)}
                                    <Brief >
                                        {this.getRakeoffString(gp)}
                                    </Brief>
                                </Item>
                            ))
                        }
                    </List>
                </WingBlank>

            </div >
        );
    }
}

function mapStateToProps(state) {

    return {
        game: state.gameDowns.game,
        gamePlayers: state.gameDowns.gamePlayers,

        saving: state.gameDowns.saving,//正在保存
        saved: state.gameDowns.saved,//保存是否成功


        fetching: state.gameDowns.fetching,
        rakeoffs: state.gameDowns.rakeoffs,//正在保存

        error: state.gameDowns.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        clear: bindActionCreators(clear, dispatch),
        fetchRakeoffs: bindActionCreators(fetchRakeoffs, dispatch),
        setFinalChips: bindActionCreators(setFinalChips, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm()(GameDownsList))
);