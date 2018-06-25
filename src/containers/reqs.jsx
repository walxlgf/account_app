/* eslint no-dupe-keys: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ReqsHeader } from '../components/reqsHeader';
import { ListView, WingBlank, WhiteSpace, NoticeBar, Popover, Icon, Modal, List, Button } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { fetchReqs, setReq, deleteReq, subscribeReqs, unsubscribeReqs } from '../actions/req';
import { upReq } from '../actions/op';

const Item = List.Item;
const Brief = Item.Brief;

const PAGE_SIZE = 8;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

class Reqs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource,
            popover: false,
            modal: false,
            optReq: null,
        };
    }

    componentWillMount() {
        console.log(`reqs:componentWillMount:`);
    }


    componentWillUnmount() {
        console.log(`reqs:componentWillUnmount:`);
        this.props.unsubscribeReqs();
    }

    componentDidMount() {
        console.log(`reqs:componentDidMount:`);
        //获取第一页
        this.props.fetchReqs();
        //监听变华
        this.props.subscribeReqs();
    }

    componentWillReceiveProps(nextProps) {
        console.log(`reqs:componentWillReceiveProps:`);
        if (!nextProps.fetching) {
            this.setState({
                dataSource: dataSource.cloneWithRows(nextProps.reqs),
            });
        }
    }

    onEndReached = (event) => {
        return;
    }


    onSelect = (opt) => {
        if (opt.key.startsWith('delete')) {
            let req = opt.props.value;
            console.log(`reqs:onSelect:delete:title:${req.get('title')} id:${req.id}`);
            this.props.deleteReq(req);
        }

        this.setState({
            popover: false,
        });
    };


    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }

    onModalClose = key => () => {
        this.setState({
            [key]: false,
        });
    }


    onConfirm = () => {
        let req = this.state.optReq;
        this.props.upReq(req);
        this.setState({
            modal: false,
        });
    }


    render() {

        const optReq = this.state.optReq;

        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );


        const row = (rowData, sectionID, rowID) => {
            // console.log(`rowData:${JSON.stringify(rowData.get('title'))} sectionID:${sectionID} rowID:${rowID} `);
            const req = rowData;
            return (
                <div key={rowID}
                    style={{ padding: '0 15px', display: 'flex' }}
                >
                    <div
                        style={{
                            width: '90%',
                            lineHeight: '50px',
                            color: '#888',
                            fontSize: 18,
                            borderBottom: '1px solid #F6F6F6',
                        }}

                        onClick={() => {
                            // //设置req 和只读
                            // this.props.setReq(req, 'view');
                            // //然后跳转到编辑界面
                            // this.props.history.push('/editReq');
                            this.setState({
                                modal: true,
                                optReq: req,
                            });
                        }}
                    >{req.get('player').get('name')} - {req.get('game').get('name')} - {req.get('type')} - {req.get('amount')}</div>
                    <Popover mask
                        style={{
                            width: '10%',
                            color: '#888',
                            fontSize: 18,
                        }}
                        overlayClassName="fortest"
                        overlayStyle={{ color: 'currentColor' }}
                        overlay={[
                            (<Popover.Item key={`delete-${req.id}`} value={req} >删除</Popover.Item>),
                        ]}
                        visible={this.state.popover}
                        align={{
                            overflow: { adjustY: 0, adjustX: 0 },
                            offset: [-10, 0],
                        }}
                        onSelect={this.onSelect}>
                        <Icon type="ellipsis" />
                    </Popover>

                </div>
            );
        };

        return (<div>
            <ReqsHeader
                title='玩家'
                goBack={() => this.props.history.goBack()}
                pushUp={() => {
                    this.props.setReq(null, 'add');
                    let path = { pathname: '/editReq', query: 'up' };
                    this.props.history.push(path)

                }}
                pushDown={() => {
                    this.props.setReq(null, 'add');
                    let path = { pathname: '/editReq', query: 'down' };
                    this.props.history.push(path)
                }}
            />
            <WingBlank>
                {this.props.error &&
                    <NoticeBar mode="closable" icon={null}>{this.props.error.message}</NoticeBar>}
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderHeader={() => <span>请求上下分列表</span>}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.props.fetching ? 'Loading...' : 'Loaded'}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    useBodyScroll
                    onScroll={() => { console.log('scroll'); }}
                />
            </WingBlank>

            {this.state.optReq &&
                <Modal
                    popup
                    visible={this.state.modal}
                    onClose={this.onModalClose('modal')}
                    animationType="slide-up"
                >
                    <List renderHeader={() => <div>{optReq.get('type') === 'up' ? `确认上分请求` : '确认下分请求'}</div>} className="popup-list">
                        <Item extra={optReq.get('player').get('name')}>玩家</Item>
                        <Item extra={optReq.get('game').get('name')}>Game</Item>
                        <Item extra={optReq.get('amount')}>金额</Item>
                        <List.Item>
                            <Button type="primary" onClick={
                                this.onConfirm
                                // this.onModalClose('modal')
                            }>{optReq.get('type') === 'up' ? `确认上分` : '确认下分'}</Button>
                        </List.Item>
                    </List>
                </Modal>}
        </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(`reqs:mapStateToProps:state.req.reqs:${state.req.reqs.length}`);
    return {

        //获取
        fetching: state.req.fetching,
        reqs: state.req.reqs,

        //删除
        deleting: state.req.deleting,
        deletedReq: state.req.deletedReq,

        //
        error: state.req.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchReqs: bindActionCreators(fetchReqs, dispatch),
        deleteReq: bindActionCreators(deleteReq, dispatch),
        setReq: bindActionCreators(setReq, dispatch),
        upReq: bindActionCreators(upReq, dispatch),
        unsubscribeReqs: bindActionCreators(unsubscribeReqs, dispatch),
        subscribeReqs: bindActionCreators(subscribeReqs, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps)(Reqs)
);