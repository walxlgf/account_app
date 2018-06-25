import React from 'react';
import { Button, WingBlank, InputItem, Toast, List, Radio } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchRakeoffs } from "../actions/addPlayer";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;
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

    onSubmit = () => {
        let rakeoff = this.state.checkedRakeoff;
        if (!rakeoff) {
            let errors = `请选择回水方案，只能单选`;
            Toast.fail(errors, 2, null, true);
            return;
        }

        let { form } = this.props;
        form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                let player = { ...form.getFieldsValue(), rakeoff };
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

    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        let rakeoffs = this.props.rakeoffs;
        let checkedRakeoff = this.state.checkedRakeoff;
        return (
            <div>
                <EditHeader
                    title={'新建比赛'}
                    save={() => this.onSubmit()}
                    goBack={() => this.props.history.goBack()}
                />
                <WingBlank>
                    <List
                        renderHeader={() => '请输入比赛信息'}
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

                    </List>

                    <List renderHeader={() => '请选择回水方案'}>
                        {rakeoffs && rakeoffs.map(rakeoff => (
                            <RadioItem key={rakeoff.id} checked={checkedRakeoff == rakeoff} onChange={(e) => this.onRakeoffChanged(rakeoff, e)}>
                                {rakeoff.get('name')} 赢:{rakeoff.get('win')}% 输:{rakeoff.get('lose')}%
                            </RadioItem>
                        ))}
                    </List>
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