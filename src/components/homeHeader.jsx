import React from 'react';
import { Popover, NavBar, Icon } from 'antd-mobile';
const Item = Popover.Item;
export class HomeHeader extends React.Component {
    state = {
        visible: false,
        selected: '',
    };


    onSelect = (opt) => {
        switch (opt.key) {
            case 'logout':
                this.props.logout();
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
                            (<Item key="logout" >退出</Item>),
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
                德扑计分器
      </NavBar>
        </div>);
    }
}
