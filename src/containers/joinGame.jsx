import React from 'react';
import { Button, Icon, WingBlank, InputItem, Toast, Picker } from 'antd-mobile';
import { List } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchGames, fetchPlayers } from "../actions/joinGame";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;

class JoinGameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`joinGame:componentWillMount`);
    }

    componentDidMount() {
        console.log(`joinGame:componentDidMount:`);
        //先获取Game列表供选择 pageSize设置大一些 不分页
        this.props.fetchGames(0, 100000);

        //先获取Player列表供选择 pageSize设置大一些 不分页
        this.props.fetchPlayers(0, 100000);
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
        else if (rule.field === 'game') {
            if (value) {
                callback();
            } else {
                callback(new Error('尚未选择Club。'));
            }
        }
        else {
            callback();
        }
    }

    onSubmit = () => {
        let { form } = this.props;
        form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                let gamePlayer = { ...form.getFieldsValue() };
                this.props.save(gamePlayer);
            } else {
                let errors = `${form.getFieldError('game') ? form.getFieldError('game').join('') + '\n' : ''}
                ${form.getFieldError('player') ? form.getFieldError('player').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;

        getFieldProps('game', {
            initialValue: [],
            rules: [
                { required: true, message: '请选择Game。' },
                { validator: this.validateField },
            ],
        });

        getFieldProps('player', {
            initialValue: [],
            rules: [
                { required: true, message: '请选择Player。' },
                { validator: this.validateField },
            ],
        });


        let pickerGames = [];
        for (let obj of this.props.games) {
            let game = { value: obj.id, label: obj.get('name') }
            pickerGames.push(game);
        }



        let pickerPlayers = [];
        for (let obj of this.props.players) {
            let player = { value: obj.id, label: obj.get('name') }
            pickerPlayers.push(player);
        }

        let title = '参加比赛';
        let header = '请设置参加比赛';
        return (
            <div>
                <EditHeader
                    title={title}
                    opt={'add'}
                    save={() => this.onSubmit()}
                    goBack={() => {
                        this.props.clear();
                        this.props.history.goBack();
                    }}
                />
                <WingBlank>
                    <List renderHeader={() => header} className="my-list">
                        {
                            this.props.games.length > 0 &&
                            <Picker
                                data={pickerGames}
                                title="选择Game:"
                                value={this.state.pickerGame}
                                onChange={v => {
                                    this.setState({ pickerGame: v })
                                }}
                                onOk={v => {
                                    let pickedGame;
                                    if (this.props.games.length > 0) {
                                        pickedGame = this.props.games.find(function (value, index, arr) {
                                            return value.id == v;
                                        });
                                    }
                                    if (pickedGame)
                                        setFieldsValue({ game: pickedGame })
                                }}
                            >
                                <List.Item arrow="horizontal">选择Game:</List.Item>
                            </Picker>
                        }

                        {
                            this.props.players.length > 0 &&
                            <Picker
                                data={pickerPlayers}
                                title="选择Player:"
                                value={this.state.pickerPlayer}
                                onChange={v => {
                                    this.setState({ pickerPlayer: v })
                                }}
                                onOk={v => {
                                    let pickerPlayer;
                                    if (this.props.players.length > 0) {
                                        pickerPlayer = this.props.players.find(function (value, index, arr) {
                                            return value.id == v;
                                        });
                                    }
                                    if (pickerPlayer)
                                        setFieldsValue({ player: pickerPlayer })
                                }}
                            >
                                <List.Item arrow="horizontal">选择玩家:</List.Item>
                            </Picker>
                        }
                    </List>
                </WingBlank>

            </div >
        );
    }
}



function mapStateToProps(state) {

    return {
        players: state.joinGame.players,//用于picker选择
        games: state.joinGame.games,//用于picker选择

        saving: state.joinGame.saving,//正在保存
        saved: state.joinGame.saved,//保存是否成功

        error: state.joinGame.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        clear: bindActionCreators(clear, dispatch),
        fetchGames: bindActionCreators(fetchGames, dispatch),
        fetchPlayers: bindActionCreators(fetchPlayers, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm()(JoinGameList))
);