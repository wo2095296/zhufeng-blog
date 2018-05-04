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
    Popconfirm,
    Select,
    Card,
    List,
    Avatar
} from 'antd'
import service from '../../service/article';
import category from '../../service/category';
export default class Article extends React.Component {
    state = {
        items: [],
        selectedRows: [],
        selectedRowKeys: [],
        pageNum: 1,
        keyword: '',
        loading: false,
        editVisible: false,
        viewVisible: false,
        commentVisible:false,
        item: {},
        categories:[]
    }
    componentDidMount() {
        category.list({pageNum: 1})
        .then(response => {
            if (response.code == 0) {
                let {items:categories} = response.data;
                this.setState({categories});
            }
        });
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
    onCancelView=() => {
        this.setState({viewVisible: false})
    }
    onCancelComment=() => {
        this.setState({commentVisible: false})
    }
    view=(item) => {
        service.addPv(item._id).then((res) => this.getList());
        this.setState({viewVisible: true,item})
    }
    comment = (item) => {
        this.setState({commentVisible: true,item})
    }
    update = (item) => {
        this.setState({title: '编辑文章', editVisible: true, isAdd: false,item})
    }
    add = () => {
        this.setState({title: '发表文章', editVisible: true, isAdd: true})
    }
    onEditSubmit = () => {
        var data = this
            .editForm
            .props
            .form
            .getFieldsValue();
        if (this.state.isAdd) {
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
    onCommentSubmit = (record) => {
        var data = this
            .commentForm
            .props
            .form
            .getFieldsValue();
            service
                .comment(data.id,data)
                .then((res) => {
                    if (res.code == 0) {
                        this.onCancelComment();
                        this.setState({}, this.getList);
                    }
                })
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
                title: '博客标题',
                dataIndex: 'title',
                width: 800
            }, {
                title: '分类',
                dataIndex: 'category',
                render: text=> text&&text.name,
                width: 100
            }, {
                title: '浏览量',
                dataIndex: 'pv',
                width: 100
            }, {
                title: '评论量',
                dataIndex: 'text',
                render: (text, record) => {
                    return record.comments.length
                },
                width: 100
            },
            {
                title: '操作',
                key: 'action',
                render: (text,record) => (
                    <Button.Group>
                         <Button
                            type='dash'
                            icon="edit"
                            onClick={()=>this.view(record)}>查看</Button>
                        <Button
                            style={{marginLeft:5}}    
                            type='primary'
                            icon="edit"
                            onClick={() => this.update(record)}>编辑</Button>
                        <Button
                            style={{marginLeft:5}}    
                            type='primary'
                            icon="message"
                            onClick={()=>this.comment(record)}>评论</Button>
                        <Popconfirm title="确认删除吗?" onConfirm={() => this.remove(record.key)}>
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
                                        onClick={this.add}>创建文章</Button>
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
                        rowSelection={rowSelection} />
                    
                        <Modal
                            title={this.state.title}
                            visible={this.state.editVisible}
                            onOk={this.onEditSubmit}
                            onCancel={this.onCancel}
                            width={800}
                            closable
                            destroyOnClose>
                            <EditModal
                                wrappedComponentRef={(instance) => this.editForm = instance}
                                isAdd={this.state.isAdd}
                                categories={this.state.categories}
                                item={this.state.item}/>
                        </Modal>
                        
                        <Modal
                            closable
                            visible={this.state.viewVisible}
                            onCancel={this.onCancelView}
                            footer={null}
                            width={800}
                            destroyOnClose>
                           <ViewModal item={this.state.item}/>
                        </Modal>
                        
                        <Modal
                                closable
                                visible={this.state.commentVisible}
                                onOk={()=>this.onCommentSubmit(this.state.item)}
                                onCancel={this.onCancelComment}
                                width={800}
                                destroyOnClose>
                        <CommentModal
                            wrappedComponentRef={(inst) => this.commentForm = inst}    
                            item={this.state.item} />
                        </Modal>
                    </Col>
                </Row>
                
        )
    }
}

class EditModal extends React.Component {
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
                {this.props.isAdd
                    ? <div>
                         <Form.Item label="分类" {...formItemLayout}>
                            {getFieldDecorator('category',{initialValue:this.props.categories&&this.props.categories[0]._id})(
                                <Select style={{width: '30%'}}>
                                    {
                                        this.props.categories.map((category) => (
                                            <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>  
                                        ))  
                                  }
                                </Select>
                            )}
                            </Form.Item>
                        <Form.Item label="标题" {...formItemLayout}>
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your title!'
                                        }
                                    ]
                                })(<Input maxLength={50} placeholder="最多输入50个字"/>)}
                            </Form.Item>
                        <Form.Item label="正文" {...formItemLayout}>
                        {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your title!'
                                        }
                                    ]
                            })(<Input.TextArea
                                maxLength={500}
                                placeholder='正文'
                                style={{
                                height: 200
                            }}/>)}
                            </Form.Item>
                        </div>
                    :<div>
                         <Form.Item label="标题" {...formItemLayout}>
                                {getFieldDecorator('title', { initialValue: item.title })(<Input maxLength={50} placeholder="最多输入50个字"/>)}
                        </Form.Item>
                        
                        <Form.Item label="正文" {...formItemLayout} >
                            {
                                getFieldDecorator('content',{initialValue: item.content})(
                                    <Input.TextArea
                                    maxLength={500}
                                    placeholder='正文'
                                    style={{height: 200}}
                                />)
                            } 
                        </Form.Item>
                        <Form.Item>
                        {
                            getFieldDecorator('id',{initialValue: item._id})(
                             <Input type="hidden"/>
                            )
                        } 
                        </Form.Item>
                    </div>}
            </div>
        )
    }
}

class ViewModal extends React.Component {
    render() {
        let item = this.props.item;
        return (
            <Card title={item.title} style={{marginTop: 20}}>
                <p>{item.content}</p>
            </Card>
        )
    }
}

class CommentModal extends React.Component {
    render() {
        let article=this.props.item;
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
                <List
                    itemLayout="horizontal"
                    dataSource={article.comments}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">{item.username}</a>}
                                description={item.content}
                        />
                    </List.Item>
                    )}
                />
                <Form >
                    <Form.Item>
                    {getFieldDecorator('content', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your title!'
                            }
                        ]
                    })(<Input.TextArea
                        maxLength={500}
                        placeholder='内容'
                        style={{
                        height: 200
                    }}/>)}
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('id',{initialValue: article._id})(
                             <Input type="hidden"/>
                            )
                        } 
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
EditModal = Form.create({})(EditModal)
CommentModal = Form.create({})(CommentModal)