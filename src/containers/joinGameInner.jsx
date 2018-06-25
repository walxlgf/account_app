import React from 'react';
import { WingBlank, Toast, Picker, Checkbox } from 'antd-mobile';
import { List } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchPlayers } from "../actions/joinGameInner";
import { EditHeader } from '../components/editHeader';

const CheckboxItem = Checkbox.CheckboxItem;
const Item = List.Item;
const Brief = Item.Brief;

class JoinGameInnerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedPlayers: [],
        };
    }

    componentWillMount() {
        console.log(`joinGame:componentWillMount`);
    }

    componentDidMount() {
        console.log(`joinGame:componentDidMount:game:${this.props.game}`);

        //先获取Player列表供选择 pageSize设置大一些 不分页
        this.props.fetchPlayers();
    }

    componentWillReceiveProps(nextProps) {
        console.log(`joinGame:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        }
    }

    componentWillUnmount() {
        console.log(`joinGame:componentWillUnmount`);
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
        let players = this.state.checkedPlayers;
        if (!players || players.length === 0) {
            let errors = `请选择用户，可多选`;
            Toast.fail(errors, 2, null, true);
            return;
        }
        let game = this.props.game;
        this.props.save(players, game);
    }

    onPlayerChange = (player, e) => {
        let players = this.state.checkedPlayers;
        //不管选中与否，都要查找player 如果有删除
        let index = players.findIndex(function (value, index, arr) {
            return value.id === player.id;
        });
        if (index !== -1) {
            players.splice(index, 1);
        }
        //如果checked 添加进来
        if (e.target.checked) {
            players.push(player);
        }
        let str = '['
        for (let p of players) {
            str += `${p.get('name')} ,`
        }
        str += `]`
        console.log(`joinGame:onPlayerChange:p:${str}`);
        this.setState({ checkedPlayers: [...players] });
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        let players = this.props.players;
        let game = this.props.game;
        return (
            <div>
                <EditHeader
                    title={'参加比赛'}
                    opt={'add'}
                    save={() => this.onSubmit()}
                    goBack={() => {
                        this.props.history.goBack();
                    }}
                />
                <WingBlank>
                    <List renderHeader={() => '比赛'} className="my-list">
                        <Item extra={game && game.get('name')}>名称</Item>
                    </List>
                    <List renderHeader={() => '玩家'} className="my-list">
                        {players && players.map(player => (
                            <CheckboxItem key={player.id} onChange={(e) => this.onPlayerChange(player, e)}>
                                {player.get('name')}
                            </CheckboxItem>
                        ))}
                    </List>
                </WingBlank>

            </div >
        );
    }
}

function mapStateToProps(state) {

    return {
        game: state.joinGameInner.game,

        players: state.joinGameInner.players,

        saving: state.joinGameInner.saving,//正在保存
        saved: state.joinGameInner.saved,//保存是否成功

        error: state.joinGameInner.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        clear: bindActionCreators(clear, dispatch),
        fetchPlayers: bindActionCreators(fetchPlayers, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm()(JoinGameInnerList))
);