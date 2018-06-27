import React from 'react';
import { Button, WingBlank, InputItem, Toast, List, Picker, Modal, ActionSheet } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchRakeoffs } from "../actions/addPlayer";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
const myList = {
    flexBasis: 'initial',
}

//actionSheet相关
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
const BUTTONS = ['删除', '取消'];


class PlayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`addPlayer:componentWillMount`);
    }

    componentDidMount() {
        console.log(`addPlayer:componentDidMount`);
        this.props.fetchRakeoffs();
    }

    componentWillReceiveProps(nextProps) {
        console.log(`addPlayer:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        }
    }

    componentWillUnmount() {
        console.log(`addPlayer:componentWillUnmount`);
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


    onSonClicked = (son) => {
        let that = this;
        console.log(`addPlayer:onSonClicked:son:${son.name}`);
        //弹出操作actionSheet
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            title: '玩家操作',
            message: `对子玩家[${son.name}]进行如下操作`,
            maskClosable: true,
            'data-seed': 'logId',
            wrapProps,
        },
            (buttonIndex) => {
                //根据按钮位置 确定操作
                switch (buttonIndex) {
                    case 0:
                        that.showDeleteSonModal(son);
                        break;
                }

            });
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
                    let son = { name: value };
                    sons.push(son);
                    form.setFieldsValue({ sons });
                    console.log(`addPlayer:showAddSonModal:${sons && sons.length}`);
                }
            },
        ], 'default', '', ['请输入子玩家名称']);
    }


    showDeleteSonModal(son) {
        let that = this;
        alert('删除', `确定删除${son.name}`, [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            {
                text: '确定', onPress: () => {
                    console.log(`addPlayer:showDeleteSonModal:son:${son.name}`)
                    let sons = that.props.form.getFieldValue('sons');
                    let index = sons.findIndex(function (value, index, arr) {
                        return value.name == son.name;
                    })
                    if (index !== -1) {
                        sons.splice(index, 1);
                        that.props.form.setFieldsValue({ sons });
                    }
                }
            },
        ]);
    }


    onSubmit = () => {
        let { form } = this.props;
        form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                let player = { ...form.getFieldsValue() };

                console.log(`addPlayer:onSubmit:player:${JSON.stringify(player)}`);
                this.props.save(player);
            } else {
                let errors = `${form.getFieldError('name') ? form.getFieldError('name').join('') + '\n' : ''}
                ${form.getFieldError('rakeoff') ? form.getFieldError('rakeoff').join('') + '\n' : ''}
                ${form.getFieldError('sons') ? form.getFieldError('sons').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
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

        let rakeoffs = this.props.rakeoffs;
        let pickerRakeoffs = [];
        for (let rakeoff of rakeoffs) {
            let pickerRakeoff = { value: rakeoff.id, label: `${rakeoff.get('name')} 赢:${rakeoff.get('win')}% 输:${rakeoff.get('lose')}` }
            pickerRakeoffs.push(pickerRakeoff);
        }

        let sons = getFieldValue('sons');
        return (
            <div>
                <EditHeader
                    title={'新建比赛'}
                    save={() => this.onSubmit()}
                    goBack={() => this.props.history.goBack()}
                />
                <WingBlank>
                    <List renderHeader={() => '请输入比赛信息'} style={myList}>
                        <InputItem
                            {...getFieldProps('name', {
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
                        >名称:</InputItem>
                    </List>

                    <Picker
                        data={pickerRakeoffs}
                        title="选择回水方案:"
                        value={this.state.pickerRakeoff}
                        onChange={v => {
                            this.setState({ pickerRakeoff: v })
                        }}
                        onOk={v => {
                            let rakeoff = rakeoffs.find(function (value, index, arr) {
                                return value.id == v;
                            });
                            if (rakeoff) {
                                console.log(`addPlayer:pickerRakeoff:${rakeoff}`);
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
                                    arrow='horizontal'
                                    onClick={() => { this.onSonClicked(son) }}
                                >{son.name}</Item>
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
        fetching: state.addPlayer.fetching,
        rakeoffs: state.addPlayer.rakeoffs,

        saving: state.addPlayer.saving,//正在保存
        saved: state.addPlayer.saved,//保存是否成功
        player: state.addPlayer.player,//保存成功后返回的player 有更新也通过这个字段返回

        error: state.addPlayer.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
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