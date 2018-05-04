import React from 'react';
import {Route,withRouter} from 'react-router-dom'
import {Button,Tabs,Row,Col} from 'antd';
import Header from '../../components/header'
import NavLeft from '../../components/navleft'
import menus from '../../config/menus'
import Home from '../home';
import Category from '../category';
import Article from '../article';

export default class Admin extends React.Component{
    render (){
        return (
            <div className="admin-page">
                <Header userName="珠峰博客"/>
                <Row className="welcome-page">
                    <Col span="3" className="nav-left">
                         <NavLeft menus={menus}/>
                    </Col>
					<Col span="21" className="right-container">
					    <Route exact path='/admin' component={Home} />	
                        <Route path='/admin/category' component={Category}/>
						<Route path='/admin/article' component={Article}/>
                    </Col>
                </Row>
            </div>
        )
    }
}