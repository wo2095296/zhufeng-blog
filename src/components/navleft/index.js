import React from 'react'
import {Menu} from 'antd'
import {Link} from 'react-router-dom'
export default class NavLeft extends React.Component{

    handleClick=(event)=>{
        this.setState({selectedKeys:event.key})
    }

    componentWillMount(){
        let menus=this.getMenu(this.props.menus);
        var key = window.location.hash
        this.setState({
            menus,
            selectedKeys:key
        })
    }

    getMenu=(menus,key='')=>{
        return menus.map((item)=>{
            if(item.children){
                return (
                    <Menu.SubMenu key={key+item.key} title={item.title}>
                        {this.getMenu(item.children,key+item.key)}
                    </Menu.SubMenu>
                )
            }
            return (
                <Menu.Item key={key+item.key} name={item.title}>
                    <Link to={key+item.key}>{item.title}</Link>
                </Menu.Item>
            )
        })
    }

    render(){
        return (
            <div style={{padding:'0 1px'}}>
                <Menu
                theme="dark"    
                  mode="inline"    
                  onClick = {this.handleClick}
                  className='nav-left'
                  selectedKeys={[this.state.selectedKeys]}
                >
                  {this.state.menus}
                </Menu>
            </div>
        )
    }
}