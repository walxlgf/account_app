import React from 'react';
import { Button, Icon, WingBlank, InputItem, Toast, Picker, DatePicker } from 'antd-mobile';
import { List } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save,clear } from "../actions/addRakeoff";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;

class RakeoffList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`rakeoff:componentWillMount`);
    }

    componentDidMount() {
        console.log(`rakeoff:componentDidMount`);
    }

    componentWillReceiveProps(nextProps) {
        console.log(`rakeoff:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
        }
    }

    componentWillUnmount() {
        console.log(`rakeoff:componentWillUnmount`);
        this.props.clear();
    }

    validateField = (rule, value, callback) => {
        if (rule.field === 'lose') {
            if (value) {
                if (value <= 0 || value >= 100)
                    callback(new Error('百分是只能0到100之前的整数'));
                else
                    callback();
            } else {
                callback(new Error('请选择输时百分比。'));
            }
        }
        else if (rule.field === 'win') {
            if (value) {
                if (value <= 0 || value >= 100)
                    callback(new Error('百分是只能0到100之前的整数'));
                else
                    callback();
            } else {
                callback(new Error('请设置赢时百分比。'));
            }
        } else if (rule.field === 'name') {
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
                let rakeoff = { ...form.getFieldsValue() };
                console.log(`rakeoff:save:rakeoff1:${JSON.stringify(rakeoff)}`);
                this.props.save(rakeoff);
            } else {
                let errors = `${form.getFieldError('name') ? form.getFieldError('name').join('') + '\n' : ''}
                ${form.getFieldError('win') ? form.getFieldError('win').join('') + '\n' : ''}
                ${form.getFieldError('lose') ? form.getFieldError('lose').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);

        let title = '新建回水方案';
        let header = '请输入回水方案信息';
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
                        <InputItem
                            {...getFieldProps('win', {
                                initialValue: 5,
                                name: 'win',
                                rules: [
                                    { required: true, message: '请输入赢时返回(0到100)%' },
                                    { validator: this.validateField },
                                ],
                                validateTrigger: 'onBlur',
                            })}
                            extra='%'
                            clear
                            type='number'
                            placeholder="请输入赢时返水(0到100)%"
                            error={!!getFieldError('win')}
                            onErrorClick={() => {
                                Toast.fail(getFieldError('win').join(','), 1);
                            }}
                        >赢:</InputItem>
                        <InputItem
                            {...getFieldProps('lose', {
                                initialValue: 2,
                                name: 'lose',
                                rules: [
                                    { required: true, message: '请输入输时返水比例(0到100)%' },
                                    { validator: this.validateField },
                                ],
                                validateTrigger: 'onBlur',
                            })}
                            extra='%'
                            clear
                            type='number'
                            placeholder="请输入输时返水(0到100)%"
                            error={!!getFieldError('lose')}
                            onErrorClick={() => {
                                Toast.fail(getFieldError('lose').join(','), 1);
                            }}
                        >输:</InputItem>
                    </List>
                </WingBlank>

            </div >
        );
    }
}



function mapStateToProps(state) {
    return {
        saving: state.addRakeoff.saving,//正在保存
        saved: state.addRakeoff.saved,//保存是否成功
        rakeoff: state.addRakeoff.rakeoff,//保存成功后返回的rakeoff 有更新也通过这个字段返回
        error: state.addRakeoff.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        clear: bindActionCreators(clear, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm()(RakeoffList))
);