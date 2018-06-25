import React from 'react';
import { NavBar, Icon, Button } from 'antd-mobile';
export class ViewHeader extends React.Component {
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.goBack()}
                >{this.props.title}</NavBar>
            </div>);
    }
}