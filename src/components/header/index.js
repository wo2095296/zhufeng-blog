import React from 'react'
import { Row, Col, Icon } from 'antd'
import {Link,withRouter} from 'react-router-dom'
import user from '../../service/user'
class Header extends React.Component {
    signout = () => {
        user.signout().then(() => {
            this.props.history.push('/');
        })
    }
    render() {
        return (
            <Row className='admin-header'>
                <Col span='12'>
                    <Link to='/admin'>珠峰博客</Link>
                </Col>
                <Col span='12'>
                    <div style={{ float: 'right'}}>
                        <Icon type="smile-o" /> 欢迎，{this.props.username}
                        <a className='anticon' onClick={this.signout}>
                        <Icon type="logout"/>    
                            退出</a>
                    </div>
                </Col>
            </Row>
        )
    }
}
export default withRouter(Header);