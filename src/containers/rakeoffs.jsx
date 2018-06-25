/* eslint no-dupe-keys: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ObjsHeader } from '../components/objsHeader';
import { WingBlank, WhiteSpace, List } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { fetchRakeoffs, clear } from '../actions/rakeoffs';

const Item = List.Item;
const Brief = Item.Brief;
const myList = {
    flexBasis: 'initial',
}

class Rakeoffs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log(`rakeoffs:componentWillMount:`);
    }

    componentWillUnmount() {
        console.log(`rakeoffs:componentWillUnmount:`);
        this.props.clear();
    }

    componentDidMount() {
        console.log(`rakeoffs:componentDidMount:`);
        this.props.fetchRakeoffs();
    }

    componentWillReceiveProps(nextProps) {
    }

    onRakeoffClicked = (rakeoff) => {
        console.log(`rakeoffs:onRakeoffClicked:rakeoff:${rakeoff.get('name')}`);
    }

    render() {
        let rakeoffs = this.props.rakeoffs;
        return (<div>
            <ObjsHeader
                title='回水方案'
                goBack={() => this.props.history.goBack()}
                pushAdd={() => {
                    this.props.history.push('/addRakeoff')
                }}
            />
            <WingBlank>
                <List renderHeader={() => '玩家列表'} style={myList}>
                    {rakeoffs && rakeoffs.map((rakeoff, index) => {
                        return <Item
                            key={rakeoff.id}
                            arrow='horizontal'
                            onClick={() => { this.onRakeoffClicked(rakeoff) }}
                        >{rakeoff.get('name')}
                            <Brief>
                                赢:{rakeoff.get('win')}% 输:{rakeoff.get('lose')}%
                                </Brief>
                        </Item>
                    })}
                </List>
            </WingBlank>
        </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        //获取
        fetching: state.rakeoffs.fetching,
        rakeoffs: state.rakeoffs.rakeoffs,

        error: state.rakeoffs.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchRakeoffs: bindActionCreators(fetchRakeoffs, dispatch),
        clear: bindActionCreators(clear, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps)(Rakeoffs)
);