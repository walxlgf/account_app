import React from 'react';
import Parse from 'parse';
import { WingBlank, InputItem, Toast, List, Picker, Button, Modal } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchRakeoffs, getPlayer } from "../actions/editPlayer";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const myList = {
    flexBasis: 'initial',
}


class PlayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`editPlayer:componentWillMount`);
    }

    componentDidMount() {
        console.log(`editPlayer:componentDidMount`);
        this.props.fetchRakeoffs();

        //初始化picker选择当前player的rakeoff
        let player = this.props.playerBySet;
        this.props.getPlayer(player);
    }

    componentWillReceiveProps(nextProps) {
        console.log(`editPlayer:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        }

        if (!this.props.player && nextProps.player) {
            let player = nextProps.player;
            console.log(`editPlayer:componentWillReceiveProps:set:${player && player.get('name')}`);
            let rakeoff = player.get('rakeoff');
            let sons = player.get('sons');
            this.setState({ pickerValue: [rakeoff.id] });

            console.log(`editPlayer:componentWillReceiveProps:set:${sons && sons.length}`);
            //form 已经选择了rakeoff
            this.props.form.setFieldsValue({ rakeoff });
            this.props.form.setFieldsValue({ sons: sons });

            let newSons = this.props.form.getFieldValue('sons');
            let newRakeoff = this.props.form.getFieldValue('rakeoff');

            console.log(`editPlayer:componentWillReceiveProps:set2:${newSons && newSons.length} rakeoff:${newRakeoff && newRakeoff.get('name')}`);
        }
    }

    componentWillUnmount() {
        console.log(`editPlayer:componentWillUnmount`);
        this.props.clear();
    }

    validateField = (rule, value, callback) => {
        if (rule.field === 'name') {
            if (value) {
                callback();
            } else {
                callback(new Error('请输入名称'));
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
                let player = this.props.player;
                let name = form.getFieldValue('name');
                let rakeoff = form.getFieldValue('rakeoff');
                let sons = form.getFieldValue('sons');
                player.set('name', name);
                player.set('rakeoff', rakeoff);
                player.set('sons', sons);
                this.props.save(player);
            } else {
                let errors = `${form.getFieldError('name') ? form.getFieldError('name').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
    }


    onRakeoffChanged = (rakeoff, e) => {
        this.setState({ checkedRakeoff: rakeoff });
    }


    onAddSonClicked = () => {
        this.showAddSonModal();
    }
    /**
       * 显示上分对话框
       * @param {*} gamePlayer 
       */
    showAddSonModal() {
        let that = this;
        prompt('新增子玩家', `新增子玩家`, [
            { text: '取消' },
            {
                text: '确定 ',
                onPress: (value) => {
                    const { form } = that.props;
                    let sons = form.getFieldValue('sons');
                    console.log(`addPlayer:showAddSonModal:${sons && sons.length}`);
                    let Son = Parse.Object.extend("Son");
                    let son = new Son();
                    son.set('name', value);
                    son.set('player', that.props.player);
                    sons.push(son);
                    form.setFieldsValue({ sons });
                }
            },
        ], 'default', '', ['请输入子玩家名称']);
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        getFieldProps('rakeoff', {
            initialValue: [],
            rules: [
                { required: true, message: '请选择回水方案。' },
                { validator: this.validateField },
            ],
        });
        getFieldProps('sons', {
            initialValue: [],
            rules: [
                { required: true, message: '请添加子玩家。' },
                { validator: this.validateField },
            ],
        });

        let player = this.props.player;
        let sons;
        if (player)
            sons = player.get('sons');
        let rakeoffs = this.props.rakeoffs;
        let pickerRakeoffs = [];
        for (let rakeoff of rakeoffs) {
            let pickerRakeoff = { value: rakeoff.id, label: `${rakeoff.get('name')} 赢:${rakeoff.get('win')}% 输:${rakeoff.get('lose')}` }
            pickerRakeoffs.push(pickerRakeoff);
        }

        return (
            <div>
                <EditHeader
                    title={'编辑玩家'}
                    save={() => this.onSubmit()}
                    goBack={() => this.props.history.goBack()}
                />
                <WingBlank>
                    <List renderHeader={() => '请输入玩家信息'} style={myList}>
                        <InputItem
                            {...getFieldProps('name', {
                                initialValue: `${player && player.get('name')}`,
                                name: 'name',
                                rules: [
                                    { required: true, message: '请输入名称' },
                                ],
                                validateTrigger: 'onBlur',
                            })}
                            clear
                            placeholder="请输入名称"
                            error={!!getFieldError('name')}
                            onErrorClick={() => {
                                Toast.fail(getFieldError('name').join(','));
                            }}
                        >名称</InputItem>
                        <Item extra={player && player.get('balance')}>余额</Item>
                    </List>

                    <Picker
                        data={pickerRakeoffs}
                        title="选择回水方案:"
                        value={this.state.pickerValue}
                        onChange={v => {
                            this.setState({ pickerValue: v })
                        }}
                        onOk={v => {
                            let rakeoff = rakeoffs.find(function (value, index, arr) {
                                return value.id == v;
                            });
                            if (rakeoff) {
                                console.log(`editPlayer:pickerRakeoff:${rakeoff}`);
                                setFieldsValue({ rakeoff })
                            }
                        }}
                    >
                        <List.Item arrow="horizontal">选择回水方案:</List.Item>
                    </Picker>

                    <List renderHeader={() => '子玩家'} style={myList}>
                        {
                            sons && sons.map((son, index) => (
                                <Item
                                    key={index}
                                // arrow='horizontal'
                                // onClick={() => { this.onSonClicked(son) }}
                                >{son.get('name')}</Item>
                            ))
                        }
                    </List>
                    <Button
                        type='primary'
                        onClick={this.onAddSonClicked}
                        disabled={this.props.saving}
                    >添加子玩家</Button>
                </WingBlank>

            </div >
        );
    }
}



function mapStateToProps(state) {
    return {
        playerBySet: state.editPlayer.playerBySet,

        fetching: state.editPlayer.fetching,
        rakeoffs: state.editPlayer.rakeoffs,

        saving: state.editPlayer.saving,
        saved: state.editPlayer.saved,
        getting: state.editPlayer.getting,
        player: state.editPlayer.player,
        error: state.editPlayer.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        getPlayer: bindActionCreators(getPlayer, dispatch),
        clear: bindActionCreators(clear, dispatch),
        fetchRakeoffs: bindActionCreators(fetchRakeoffs, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm()(PlayerList))
);