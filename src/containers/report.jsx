import React from 'react';
import { WingBlank, List, WhiteSpace, ActionSheet, Modal, Button } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { ViewHeader } from '../components/viewHeader';
import { save, clear, fetchReports, subscribeReports, unsubscribeReports } from '../actions/report';
import { formatShortDate } from '../utils';


const prompt = Modal.prompt;

const subTitle = {
    color: '#888',
    fontSize: 14,
    padding: '15px 0 9px 15px'
};
//actionSheet相关
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}


const Item = List.Item;
const Brief = Item.Brief;

const myList = {
    flexBasis: 'initial',
}


class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canClear: false,//两种情况会触发componentWillUnmount 一是点击玩家参赛或其它按钮，这时不clear,二是返回，需要clear
        };
    }

    componentWillMount() {
        console.log(`viewGame:componentWillMount`);
        this.setState({ canClear: false });
        this.props.fetchReports();
        this.props.subscribeReports();
    }

    componentDidMount() {
        console.log(`viewGame:componentDidMount`);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        console.log(`viewGame:componentWillUnmount`);

        this.props.unsubscribeReports();
        if (this.state.canClear)
            this.props.clear();
    }
    getMoneyString = (report) => {
        let result = '';
        let up = report.get('up');
        let down = report.get('down');
        let deposit = report.get('deposit');
        let withdraw = report.get('withdraw');
        let shui = report.get('shui');
        let players = report.get('players');
        let games = report.get('games');
        let sons = report.get('sons');
        result = `上分${up} 下分${down} 充值${deposit} 提现${withdraw} 水${shui} 玩家${players ? players.length : 0} 子玩家${sons ? sons.length : 0} 比赛${games ? games.length : 0}`
        return result;
    }

    getDateString = (report) => {
        let result = '';
        let start = report.get('start');
        let end = report.get('end');
        result = `开始${start ? formatShortDate(start) : ''} 结束${end ? formatShortDate(end) : ''}`
        return result;

    }


    onReportClicked = (report) => {
        console.log(`viewGame:onReportClicked:report:${report}`);
    }



    render() {
        let reports = this.props.reports;
        return (
            <div>
                <ViewHeader
                    title={'比赛详情'}
                    goBack={() => {
                        this.setState({ canClear: true });
                        this.props.history.goBack();
                    }}
                />

                <WingBlank>
                    <WhiteSpace size='md' />

                    <div style={subTitle}>操作列表 </div>
                    <Button type="primary" inline size="small"
                        style={{ marginRight: '4px', marginLeft: '8px' }}
                        onClick={() => {
                            this.props.save();
                        }}
                    >生成报表</Button>


                    <WhiteSpace size='md' />
                    <List renderHeader={() => '报表'} className="my-list">
                        {
                            reports && reports.map(report => (
                                <Item
                                    wrap
                                    key={report.id}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => { this.onReportClicked(report) }}>
                                    {this.getMoneyString(report)}
                                    <Brief >
                                        {this.getDateString(report)}
                                    </Brief>
                                </Item>
                            ))
                        }
                    </List>
                </WingBlank>
            </div >
        );
    }
}

// 



function mapStateToProps(state) {
    return {
        //获取
        fetching: state.report.fetching,
        reports: state.report.reports,
        error: state.report.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clear: bindActionCreators(clear, dispatch),
        save: bindActionCreators(save, dispatch),
        fetchReports: bindActionCreators(fetchReports, dispatch),
        subscribeReports: bindActionCreators(subscribeReports, dispatch),
        unsubscribeReports: bindActionCreators(unsubscribeReports, dispatch),
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Report)
);