import React from 'react';
import { Button, Icon, WingBlank, InputItem, Toast, Picker, DatePicker } from 'antd-mobile';
import { List } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save } from "../actions/addGame";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;

class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`game:componentWillMount`);
    }

    componentDidMount() {
        console.log(`game:componentDidMount`);
    }

    componentWillReceiveProps(nextProps) {
        console.log(`game:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        }
    }

    componentWillUnmount() {
        console.log(`game:componentWillUnmount`);
    }

    validateField = (rule, value, callback) => {
        if (rule.field === 'startTime') {
            if (value) {
                callback();
            } else {
                callback(new Error('请选择开始时间。'));
            }
        }
        else if (rule.field === 'duration') {
            if (value) {
                callback();
            } else {
                callback(new Error('请设置比赛时长。'));
            }
        } else if (rule.field === 'duration') {
            if (value > 0) {
                callback();
            } else {
                callback(new Error('时长是大于0的整数(分钟)。'));
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
                let game = { ...form.getFieldsValue() };
                console.log(`game:save:game1:${JSON.stringify(game)}`);
                this.props.save(game);
            } else {
                let errors = `${form.getFieldError('name') ? form.getFieldError('name').join('') + '\n' : ''}
                ${form.getFieldError('startTime') ? form.getFieldError('startTime').join('') + '\n' : ''}
                ${form.getFieldError('duration') ? form.getFieldError('duration').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);

        let title = '新建比赛';
        let header = '请输入比赛信息';
        return (
            <div>
                <EditHeader
                    title={title}
                    save={() => this.onSubmit()}
                    goBack={() => this.props.history.goBack()}
                />
                <WingBlank>
                    <List
                        renderHeader={() => header}
                        className="my-list">
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

                        <DatePicker
                            {...getFieldProps('startTime', {
                                initialValue: now,
                                rules: [
                                    { required: true, message: '请输入起始时间' },
                                    { validator: this.validateField },
                                ],
                            })}
                            error={!!getFieldError('startTime')}
                        >
                            <List.Item arrow="horizontal">开始时间：</List.Item>
                        </DatePicker>
                        <InputItem
                            {...getFieldProps('duration', {
                                initialValue: 120,
                                name: 'duration',
                                rules: [
                                    { required: true, message: '请输入时长' },
                                    { validator: this.validateField },
                                ],
                                validateTrigger: 'onBlur',
                            })}
                            extra='分钟'
                            clear
                            type='number'
                            placeholder="请输入时长"
                            error={!!getFieldError('duration')}
                            onErrorClick={() => {
                                Toast.fail(getFieldError('duration').join(','), 1);
                            }}
                        >时长:</InputItem>
                    </List>
                </WingBlank>

            </div >
        );
    }
}



function mapStateToProps(state) {
    return {
        saving: state.addGame.saving,//正在保存
        saved: state.addGame.saved,//保存是否成功
        game: state.addGame.game,//保存成功后返回的game 有更新也通过这个字段返回
        error: state.addGame.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm()(GameList))
);