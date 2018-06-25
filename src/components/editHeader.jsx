import React from 'react';
import { NavBar, Icon, Button } from 'antd-mobile';
export class EditHeader extends React.Component {
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.goBack()}
                    rightContent={
                        <Button
                            type="primary"
                            size="small"
                            inline
                            onClick={() => this.props.save()}
                        >保存</Button>
                    }
                >{this.props.title}</NavBar>
            </div>);
    }
}