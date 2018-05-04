import React from 'react'
import Header from '../../components/header'
import {
    Row,
    Col,
    Table,
    Button,
    Input,
    Divider,
    Modal,
    Form,
    Popconfirm
} from 'antd'
import service from '../../service/category';

export default class Category extends React.Component {
    state = {
        items: [],
        selectedRows: [],
        selectedRowKeys: [],
        pageNum: 1,
        keyword: '',
        editVisible:false,
        loading: false,
        item: {}
    }
    componentDidMount() {
        this.getList();
    }
    pageChange = (pageNum) => {
        this.setState({
            pageNum
        }, this.getList);
    }
    getList=() => {
        this.setState({loading: true},() => {
            service
            .list({pageNum: this.state.pageNum, 'keyword': this.state.keyword})
            .then(response => {
                if (response.code == 0) {
                    let {items, total, pageNum, pageSize} = response.data;
                    items = items.map(item=>(item.key=item._id,item))
                    this.setState({
                        items,
                        pagination: {
                            onChange: this.pageChange,
                            total: total,
                            pageSize: pageSize,
                            current: pageNum,
                            showTotal: () => {
                                return '共' + total + '条'
                            },
                            showQuickJumper: true
                        },
                        loading:false
                    });
                }
            });
        });
    }
    remove = (id) => {
        service
            .remove(id)
            .then((res) => {
                if (res.code == 0) {
                    this.setState({
                        pageNum: 1
                    }, this.getList);
                }
            });
    }
    onCancel = () => {
        this.setState({editVisible: false})
    }

    update = (item) => {
        this.setState({title: '编辑分类', editVisible: true, isCreate: false,item})
    }
    create = () => {
        this.setState({title: '发表分类', editVisible: true, isCreate: true})
    }
    onSubmit = () => {
        var data = this
            .form
            .props
            .form
            .getFieldsValue();
        if (this.state.isCreate) {
            service
                .create(data)
                .then((res) => {
                    if (res.code == 0) {
                        this.onCancel();
                        this.setState({}, this.getList);
                    }
                })
        } else {
            service
                .update(data.id, data)
                .then((res) => {
                    if (res.code == 0) {
                        this.onCancel();
                        this.setState({}, this.getList);
                    }
                })
        }
    }
    render() {
        const {selectedRowKeys,loading} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys,selectedRows) => {
                this.setState({ selectedRowKeys,selectedRows});
            }
        };
        const columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                width: 800
            },
            {
                title: '操作',
                key: 'action',
                render: (text,record) => (
                    <Button.Group>
                        <Button
                            type='primary'
                            icon="edit"
                            onClick={()=>this.update(record)}>编辑</Button>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.remove(record.key)}>
                           <Button
                                        style={{marginLeft:5}}
                                        type='danger'
                                        icon="delete">删除</Button>
                        </Popconfirm>
                       
                    </Button.Group>
                ),
              }
        ]
        return (
                <Row style={{margin:'3px'}}>
                    <Col span='24'>
                        <Row >
                            <Col span='18'>
                                <Button.Group>
                                <Button type='dashed'
                                        icon="save"    
                                        onClick={this.create}>创建分类</Button>
                                <Button
                                        style={{marginLeft:5}}
                                        type='danger'
                                        icon="delete"
                                        onClick={()=>this.remove(this.state.selectedRowKeys)}>全部删除</Button>
                                </Button.Group>    
                            </Col>
                            <Col span='6'>
                            <Input.Search enterButton={true}
                                onSearch={(keyword) => this.setState({pageNum: 1,keyword},this.getList)}></Input.Search>
                            </Col>
                        </Row>
                        
                    <Table
                            loading={loading}    
                            style={{margin:'3px'}}    
                            bordered
                            columns={columns}
                            dataSource={this.state.items}
                            pagination={this.state.pagination}
                        rowSelection={rowSelection}
                    />
                    <Modal
                            title={this.state.title}
                            visible={this.state.editVisible}
                            onOk={this.onSubmit}
                            onCancel={this.onCancel}
                            width={800}
                            key={Date.now()}>
                            <DataModal
                                wrappedComponentRef={(inst) => this.form = inst}
                                isCreate={this.state.isCreate}
                                item={this.state.item}/>
                    </Modal>
                    </Col>
                </Row>
                
        )
    }
}

class DataModal extends React.Component {
    render() {
        let item = this.props.item;
        const formItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 21
            }
        };
        let {getFieldDecorator} = this.props.form;

        return (
            <div>
                {this.props.isCreate
                    ? <div>
                            <Form.Item label="名称" {...formItemLayout}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入分类名称!'
                                        }
                                    ]
                                })(<Input maxLength={50} placeholder="最多输入50个字"/>)}
                            </Form.Item>
                        </div>
                    :<div>
                         <Form.Item label="名称" {...formItemLayout}>
                                {getFieldDecorator('name', { initialValue: item.name })(<Input maxLength={50} />)}
                        </Form.Item>
                        {
                            getFieldDecorator('id',{initialValue: item._id})(
                             <Input type="hidden"/>
                            )
                        } 
                        
                    </div>}
            </div>
        )
    }
}

DataModal = Form.create({})(DataModal)