import React from 'react';
import { Button, Icon, WingBlank, InputItem, Toast, Picker } from 'antd-mobile';
import { List } from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { save, updateClub} from "../actions/club";
import { EditHeader } from '../components/editHeader';
import { lchmod } from 'fs';

const Item = List.Item;
const Brief = Item.Brief;

class ClubList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`club:componentWillMount`);
    }

    componentDidMount() {
        console.log(`club:componentDidMount`);
        //先获取盲注结构列表 pageSize设置大一些 不分页
        // this.props.fetchPatterns(0, 100000);
    }

    componentWillReceiveProps(nextProps) {
        console.log(`club:componentWillReceiveProps`);
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
        console.log(`club:componentWillUnmount`);
    }

    validateField = (rule, value, callback) => {

        if (rule.field === 'startTime') {
            // if (value) {
            //     callback();
            // } else {
            //     callback(new Error('请选择开始时间。'));
            // }
        } else if (rule.field === 'rounds') {
            // if (value.length > 0) {
            //     callback();
            // } else {
            //     callback(new Error('尚未添加级别。'));
            // }
        }
        else {
            callback();
        }
    }

    onSubmit = () => {
        let { form } = this.props;
        form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                //如果this.props.club 为空，说明的新增
                console.log(`club:save:club:${this.props.club}`);
                if (this.props.club === null) {
                    console.log(`club:save:club1:${this.props.club}`);
                    let club = { ...form.getFieldsValue() };
                    this.props.save(club);
                } else {
                    let club = this.props.club;
                    console.log(`club:save:club2:${this.props.club}`);
                    club.set('title', form.getFieldValue('title'))
                    club.set('rounds', form.getFieldValue('rounds'))
                    this.props.updateClub(club);
                }
            } else {
                let errors = `${form.getFieldError('title') ? form.getFieldError('title').join('') + '\n' : ''}
                ${form.getFieldError('rounds') ? form.getFieldError('rounds').join('') + '\n' : ''}`;
                Toast.fail(errors, 2, null, true);
            }
        });
    }


    render() {
        const { getFieldProps, getFieldValue, getFieldError, setFieldsValue } = this.props.form;
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        let pickerPatterns = [];
        for (let obj of this.props.patterns) {
            let pattern = { value: obj.id, label: obj.get('title') }
            pickerPatterns.push(pattern);
        }

        let title = '';
        let header = '';
        switch (this.props.opt) {
            case 'add':
                title = '新建Club'
                header = '请输入Club信息'
                break;
            case 'edit':
                title = '编辑Club'
                header = '请编辑Club信息'
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
                        <InputItem
                            {...getFieldProps('title', {
                                name: 'title',
                                // initialValue: title,
                                rules: [
                                    { required: true, message: '请输入名称' },
                                ],
                                validateTrigger: 'onBlur',
                            }) }
                            clear
                            placeholder="请输入名称"
                            error={!!getFieldError('title')}
                            onErrorClick={() => {
                                Toast.fail(getFieldError('title').join(','));
                            }}
                        >名称:</InputItem>
                    </List>
                </WingBlank>

            </div >
        );
    }
}



function mapStateToProps(state) {

    return {
        patterns: state.pattern.patterns,//用于picker选择
        opt: state.club.opt,//是否只读

        saving: state.club.saving,//正在保存
        saved: state.club.saved,//保存是否成功
        club: state.club.club,//保存成功后返回的club 有更新也通过这个字段返回

        deleted: state.club.deleted,

        error: state.club.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        updateClub: bindActionCreators(updateClub, dispatch),
        // fetchPatterns: bindActionCreators(fetchPatterns, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(createForm({
        mapPropsToFields(props) {
            console.log('mapPropsToFields:props:', props);
            let club = props.club;
            let title;
            let startChips;
            let startTime;
            let rounds = [];
            if (club) {
                title = club.get('title');
                startChips = club.get('startChips');
                startTime = club.get('startTime');
                rounds = club.get('rounds');
            }
            return {
                title: createFormField({ value: title }),
                startChips: createFormField({ value: startChips }),
                startTime: createFormField({ value: startTime }),
                rounds: createFormField({ value: rounds })
            }
        }
    })(ClubList))
);