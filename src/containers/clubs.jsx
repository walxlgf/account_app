/* eslint no-dupe-keys: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ObjsHeader } from '../components/objsHeader';
import { ListView, WingBlank, WhiteSpace, NoticeBar, Popover, Icon } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { fetchClubs, setClub, deleteClub } from '../actions/club';

const PAGE_SIZE = 8;
let startIndex = 0;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

class Clubs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource,
            popoverVisible: false,
        };
    }

    componentWillMount() {
        console.log(`clubs:componentWillMount:`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(`clubs:shouldComponentUpdate:`);
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        console.log(`clubs:componentWillUpdate:`);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(`clubs:componentDidUpdate:`);
    }
    componentWillUnmount() {
        console.log(`clubs:componentWillUnmount:`);
    }

    componentDidMount() {
        console.log(`clubs:componentDidMount:`);
        //获取第一页
        startIndex = 0;
        this.props.fetchClubs(startIndex, PAGE_SIZE);
    }

    componentWillReceiveProps(nextProps) {
        console.log(`clubs:componentWillReceiveProps:`);
        //处理按页获取数据
        if (!nextProps.fetching && nextProps.clubs.length > 0) {
            console.log(`clubs:fetched:`);
            //获得下一页的开始索引
            startIndex += PAGE_SIZE;
            if (this.clubs === undefined) {
                this.clubs = [];
            }
            this.clubs = [...this.clubs, ...nextProps.clubs];

            this.setState({
                dataSource: dataSource.cloneWithRows(this.clubs),
            });
        }

        //处理删除 删除成功 deletedClub 不为空
        if (!nextProps.deleting && nextProps.deletedClub) {
            let index = this.clubs.findIndex(function (value, index, arr) {
                return value.id === nextProps.deletedClub.id;
            });
            if (index !== -1) {
                this.clubs.splice(index, 1);
                //删除掉一个了 将下一页开始索引减一 防止漏数据
                startIndex--;
                this.setState({
                    dataSource: dataSource.cloneWithRows(this.clubs),
                });
            }
        }
    }

    onEndReached = (event) => {
        //获取下一页数据
        if (this.props.fetching || !this.props.hasmore) {
            return;
        }
        console.log(`clubs:onEndReached:startIndex:${JSON.stringify(startIndex)}`);
        this.props.fetchClubs(startIndex, PAGE_SIZE);
    }


    render() {
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
           const club = rowData;
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
                            //设置club 和只读
                            this.props.setClub(club, 'edit');
                            //然后跳转到编辑界面
                            this.props.history.push('/editClub');
                        }}
                    >{club.get('title')}</div>
                </div>
            );
        };

        return (<div>
            <ObjsHeader
                title='俱乐部'
                goBack={() => this.props.history.goBack()}
                pushAdd={() => {
                    this.props.setClub(null, 'add');
                    this.props.history.push('/editClub')
                }}
            />
            <WingBlank>
                {this.props.error &&
                    <NoticeBar mode="closable" icon={null}>{this.props.error.message}</NoticeBar>}
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderHeader={() => <span>Club列表</span>}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.props.fetching ? 'Loading...' : 'Loaded'}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={PAGE_SIZE}
                    useBodyScroll
                    onScroll={() => { console.log('scroll'); }}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={200}
                />
            </WingBlank>
        </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        //获取
        fetching: state.club.fetching,
        hasmore: state.club.hasmore,
        clubs: state.club.clubs,

        //删除
        deleting: state.club.deleting,
        deletedClub: state.club.deletedClub,

        //
        error: state.club.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchClubs: bindActionCreators(fetchClubs, dispatch),
        deleteClub: bindActionCreators(deleteClub, dispatch),
        setClub: bindActionCreators(setClub, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps)(Clubs)
);