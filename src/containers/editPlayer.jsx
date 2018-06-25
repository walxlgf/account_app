import React from 'react';
import { WingBlank, InputItem, Toast, List, Radio } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, clear, fetchRakeoffs } from "../actions/editPlayer";
import { EditHeader } from '../components/editHeader';

const Item = List.Item;
const Brief = Item.Brief;
const myList = {
    flexBasis: 'initial',
}

const RadioItem = Radio.RadioItem;

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

        if (this.props.player)
            this.setState({ checkedRakeoff: this.props.player.get('rakeoff') })
    }

    componentWillReceiveProps(nextProps) {
        console.log(`editPlayer:componentWillReceiveProps`);
        //保存成功直接返回
        if (nextProps.saved) {
            this.props.history.goBack();
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
        let rakeoff = this.state.checkedRakeoff;
        if (!rakeoff) {
            let errors = `请选择回水方案，只能单选`;
            Toast.fail(errors, 2, null, true);
            return;
        }

        let { form } = this.props;
        form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                let player = this.props.player;
                let name = form.getFieldValue('name');
                player.set('name', name);
                player.set('rakeoff', rakeoff);
                console.log(`editPlayer:onSubmit:player:${JSON.stringify(player)}`);
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
        let player = this.props.player;
        let checkedRakeoff = this.state.checkedRakeoff;
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
                                initialValue: `${player.get('name')}`,
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
                        <Item extra={player.get('balance')}>余额</Item>
                    </List>

                    <List renderHeader={() => '请选择回水方案'}>
                        {rakeoffs && rakeoffs.map(rakeoff => (
                            <RadioItem key={rakeoff.id} checked={checkedRakeoff && checkedRakeoff.id == rakeoff.id} onChange={(e) => this.onRakeoffChanged(rakeoff, e)}>
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
        fetching: state.editPlayer.fetching,
        rakeoffs: state.editPlayer.rakeoffs,

        saving: state.editPlayer.saving,
        saved: state.editPlayer.saved,
        player: state.editPlayer.player,
        error: state.editPlayer.error,
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