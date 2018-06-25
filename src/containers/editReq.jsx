import React from 'react';
import { Button, Icon, WingBlank, InputItem, Toast, Picker } from 'antd-mobile';
import { List } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save,fetchPlayers,fetchGames } from "../actions/req";
import { EditHeader } from '../components/editHeader';
import { lchmod } from 'fs';

const Item = List.Item;
const Brief = Item.Brief;

class ReqList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`req:componentWillMount`);
    }

    componentDidMount() {
        console.log(`req:componentDidMount`);
        const type = this.props.location.query;
        this.setState({ type })
        //先获取Game列表供选择 pageSize设置大一些 不分页
        this.props.fetchGames(0, 100000);
        //先获取Player列表供选择 pageSize设置大一些 不分页
        this.props.fetchPlayers(0, 100000);
    }

    componentWillReceiveProps(nextProps) {
        console.log(`req:componentWillReceiveProps`);
        //如果当前对象已经之删除 直接返回
        if (nextProps.deleted) {
            this.props.history.goBack();
        }
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        }
    }

    componentWillUnmount() {
        console.log(`req:componentWillUnmount`);
    }

    validateField = (rule, value, callback) => {
        if (rule.field === 'amount') {
            if (value >= 0) {
                callback();
            } else {
                callback(new Error('积分是大于等于0的整数。'));
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
                //如果this.props.req 为空，说明的新增
                console.log(`req:save:req:${this.props.req}`);
                if (this.props.req === null) {
                    let req = { ...form.getFieldsValue(), type: this.state.type };
                    console.log(`req:save:req1:${JSON.stringify(req)}`);
                    this.props.save(req);
                }
            } else {
                let errors = `${form.getFieldError('game') ? form.getFieldError('game').join('') + '\n' : ''}
                ${form.getFieldError('player') ? form.getFieldError('player').join('') + '\n' : ''}
                ${form.getFieldError('amount') ? form.getFieldError('amount').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);

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

        let title = '';
        let header = '';
        switch (this.state.type) {
            case 'up':
                title = '请求上分'
                header = '请设置上分请求'
                break;
            case 'down':
                title = '请求下分'
                header = '请设置下分请求'
                break;
        }

        return (
            <div>
                <EditHeader
                    title={title}
                    opt={this.props.opt}
                    save={() => this.onSubmit()}
                    goBack={() => this.props.history.goBack()}
                />
                <WingBlank>
                    <List
                        renderHeader={() => header}
                        className="my-list">

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
                        <InputItem
                            {...getFieldProps('amount', {
                                initialValue: 1000,
                                name: 'amount',
                                rules: [
                                    { required: true, message: '请输入数额' },
                                    { validator: this.validateField },
                                ],
                                validateTrigger: 'onBlur',
                            })}
                            extra='$'
                            clear
                            type='number'
                            placeholder="请输入数额"
                            error={!!getFieldError('amount')}
                            onErrorClick={() => {
                                Toast.fail(getFieldError('amount').join(','), 1);
                            }}
                        >数额:</InputItem>
                    </List>
                </WingBlank>

            </div >
        );
    }
}



function mapStateToProps(state) {

    return {
        players: state.req.players,//用于picker选择
        games: state.req.games,//用于picker选择

        opt: state.req.opt,//是否只读

        saving: state.req.saving,//正在保存
        saved: state.req.saved,//保存是否成功
        req: state.req.req,//保存成功后返回的req 有更新也通过这个字段返回

        deleted: state.req.deleted,

        error: state.req.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        fetchGames: bindActionCreators(fetchGames, dispatch),
        fetchPlayers: bindActionCreators(fetchPlayers, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm({
        mapPropsToFields(props) {
            console.log('mapPropsToFields:props:', props);
            let req = props.req;
            let name;
            if (req) {
                name = req.get('name');
            }
            return {
                name: createFormField({ value: name }),
            }
        }
    })(ReqList))
);