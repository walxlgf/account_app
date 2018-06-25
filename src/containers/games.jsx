
import React from 'react';
import ReactDOM from 'react-dom';
import { ObjsHeader } from '../components/objsHeader';
import { ListView, WingBlank, WhiteSpace, NoticeBar, Popover, Icon } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { fetchGames } from '../actions/games';
import { setGame } from '../actions/viewGame';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource,
            popover: false,
        };
    }

    componentWillMount() {
        console.log(`games:componentWillMount:`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(`games:shouldComponentUpdate:`);
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        console.log(`games:componentWillUpdate:`);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(`games:componentDidUpdate:`);
    }
    componentWillUnmount() {
        console.log(`games:componentWillUnmount:`);
    }

    componentDidMount() {
        console.log(`games:componentDidMount:`);
        this.props.fetchGames();
    }

    componentWillReceiveProps(nextProps) {
        console.log(`games:componentWillReceiveProps:`);
        if (!nextProps.fetching) {
            this.setState({
                dataSource: dataSource.cloneWithRows(nextProps.games),
            });
        }
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
            const game = rowData;
            return (
                <div key={rowID} style={{ padding: '0 15px', display: 'flex' }}>
                    <div
                        style={{
                            width: '90%',
                            lineHeight: '50px',
                            color: '#888',
                            fontSize: 18,
                            borderBottom: '1px solid #F6F6F6',
                        }}

                        onClick={() => {
                            //然后跳转到编辑界面
                            // let path = { pathname: '/viewGame', query: game };
                            this.props.setGame(game)
                            this.props.history.push('/viewGame');
                        }}
                    >{game.get('name')} {game.get('status')}</div>
                </div>
            );
        };

        return (<div>
            <ObjsHeader
                title='比赛列表'
                goBack={() => this.props.history.goBack()}
                pushAdd={() => {
                    this.props.history.push('/addGame')
                }}
            />
            <WingBlank>
                {this.props.error &&
                    <NoticeBar mode="closable" icon={null}>{this.props.error.message}</NoticeBar>}
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderHeader={() => <span>比赛列表</span>}
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
        </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        //获取
        fetching: state.games.fetching,
        games: state.games.games,
        //
        error: state.games.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGames: bindActionCreators(fetchGames, dispatch),
        setGame: bindActionCreators(setGame, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Games)
);