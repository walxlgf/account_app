import React from 'react';
import { Popover, NavBar, Icon } from 'antd-mobile';
const Item = Popover.Item;
export class GamesHeader extends React.Component {
    state = {
        visible: false,
        selected: '',
    };


    onSelect = (opt) => {
        switch (opt.key) {
            case 'newGame':
                this.props.pushAddGame();
                break;
            case 'clubs':
                this.props.pushClubs();
                break;
            case 'players':
                this.props.pushPlayers();
                break;
            case 'reqs':
                this.props.pushReqs();
                break;
            case 'joinGame':
                this.props.pushJoinGame();
                break;
        }
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        console.log(`GamesHeader:handleVisibleChange:visible:${visible}`);
        this.setState({
            visible,
        });
    };


    render() {
        return (<div>
            <NavBar
                mode="light"
                rightContent={
                    <Popover mask
                        overlayClassName="fortest"
                        overlayStyle={{ color: 'currentColor' }}
                        visible={this.state.visible}
                        overlay={[
                            (<Item key="newGame" >新建比赛</Item>),
                            (<Item key="clubs" style={{ whiteSpace: 'nowrap' }}>Clubs</Item>),
                            (<Item key="players" style={{ whiteSpace: 'nowrap' }}>玩家</Item>),
                            (<Item key="reqs" style={{ whiteSpace: 'nowrap' }}>请求上下分列表</Item>),
                            (<Item key="joinGame" style={{ whiteSpace: 'nowrap' }}>参加比赛</Item>)
                        ]}
                        align={{
                            overflow: { adjustY: 0, adjustX: 0 },
                            offset: [-10, 0],
                        }}
                        onVisibleChange={this.handleVisibleChange}
                        onSelect={this.onSelect}
                    >
                        <div style={{
                            height: '100%',
                            padding: '0 15px',
                            marginRight: '-15px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        >
                            <Icon type="ellipsis" />
                        </div>
                    </Popover>
                }
            >
                计分器
      </NavBar>
        </div>);
    }
}
