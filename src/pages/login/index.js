import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import user from '../../service/user'

export default class Login extends Component {
    handleSubmit = (isSignup, data) => {
        user[isSignup ? 'signup' : 'signin'](data).then((res) => {
            if (res.code == 0) {
                this.props.history.push('/admin')
            }
            this.props.history.push('/admin');
        });
    }
    render() {
        return (
            <div className='login-page'>
                <div className='login-content-wrap'>
                    <div className='login-content'>
                        <div className='login-box'>
                            <div className='title'>珠峰博客</div>
                            <UserForm onSubmit={this.handleSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class UserForm extends Component {
    state = {
        isSignUp: false //是否是注册表单
    }
    checkUserName = (rule, value, callback) => {
        let reg = /^1\d{10}$/;
        if (!value) {
            callback('请输入用户名')
        } else if (!reg.test(value)) {
            callback('用户名错误')
        } else {
            callback()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { isSignUp } = this.state
        return (
            <Form style={{ height: isSignUp ? '330px' : '270px' }}>
                <Form.Item>
                    {
                        getFieldDecorator('username', {
                            rules: [{ validator: this.checkUserName }]
                        })(
                            <Input placeholder='用户名' />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }]
                        })(
                            <Input placeholder='密码' type='password' />
                        )
                    }
                </Form.Item>
                {isSignUp && <Form.Item>
                    {
                        getFieldDecorator('email', {
                            rules: [{ required: true, message: '请输入邮箱' }]
                        })(
                            <Input placeholder='邮箱' type='email' />
                        )
                    }
                </Form.Item>
                }

                <Form.Item>
                    <Button
                        type="primary"
                        className='login-form-button'
                        onClick={() => this.props.onSubmit(isSignUp, this.props.form.getFieldsValue())}
                    >{isSignUp ? '注册' : '登录'}</Button>
                </Form.Item>

                <a onClick={() => this.setState({ isSignUp: !this.state.isSignUp })}>{isSignUp ? '已有账号！登录' : '没有账号？注册'}</a>
            </Form>
        )
    }
}
UserForm = Form.create({})(UserForm)