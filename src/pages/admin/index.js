import React from 'react'
import Header from '../../components/header'
import { Row, Col, Table, Button, Input, Divider, Modal, Form } from 'antd'
import article from '../../service/article';

export default class Admin extends React.Component {
    state = {
        articles: [],
        selectedItem: {},
        selectedRowKeys: [],
        menus: [],
        pageNum: 1,
        keyword: ''
    }
    componentDidMount() {
        this.getArticleList();
    }
    pageChange = (pageNum) => {
        this.setState({
            pageNum
        }, this.getArticleList);
    }
    getArticleList = () => {
        article.list({ pageNum: this.state.pageNum, 'keyword': this.state.keyword }).then(response => {
            if (response.code == 0) {
                let { articles, total, pageNum, pageSize } = response.data;
                articles = articles.map((item, index) => {
                    item.key = index;
                    return item;
                })
                this.setState({
                    articles,
                    pagination: {
                        onChange: this.pageChange,
                        total: total,
                        pageSize: pageSize,
                        current: pageNum,
                        showTotal: () => {
                            return '共' + total + '条'
                        },
                        showQuickJumper: true,
                    },
                    selectedItem: null
                });
            }
        });
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedItem: selectedRows[0]
        });
    };
    onRowClick = (record, index) => {
        this.setState({
            selectedRowKeys: [index],
            selectedItem: (this.state.articles[index] || {})
        });
    };
    removeArticle = () => {
        if (!this.state.selectedItem) {
            alert('请选择一条博客');
            return;
        }
        article.remove(this.state.selectedItem._id).then((res) => {
            if (res.code == 0) {
                this.setState({
                    pageNum: 1
                }, this.getArticleList);
            }
        });
    }
    onCancel = () => {
        this.setState({
            visibleModal: false
        })
    }

    updateArticle = () => {
        if (!this.state.selectedItem) {
            alert('请选择一条博客')
            return
        }
        this.setState({
            title: '编辑文章',
            visibleModal: true,
            isAdd: false
        })
    }
    addArticle = () => {
        this.setState({
            title: '发表文章',
            visibleModal: true,
            isAdd: true,
        })
    }
    handleSearch = () => {
        this.setState({
            pageNum: 1
        }, this.getArticleList);
    }
    handleSearchChange = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }
    onSubmit = () => {
        var data = this.articleForm.props.form.getFieldsValue();
        if (this.state.isAdd) {
            article.add(data).then((res) => {
                if (res.code == 0) {
                    this.onCancel();
                    this.setState({}, this.getArticleList);
                }
            })
        } else {
            article.update(data.id, data).then((res) => {
                if (res.code == 0) {
                    this.onCancel();
                    this.setState({}, this.getArticleList);
                }
            })
        }
    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const columns = [
            {
                title: '博客标题',
                dataIndex: 'title',
            },
            {
                title: '浏览量',
                dataIndex: 'pv',
                width: 150
            },
            {
                title: '评论量',
                dataIndex: 'text',
                render: (text, current) => {
                    return current.comments.length
                },
                width: 150
            },
        ]
        return (
            <div>
                <Header username={'珠峰培训'} />
                <Row className='blog-list'>
                    <Col span='24'>
                        <Row >
                            <Col span='18'>
                                <Button type='primary' style={{ margin: 10 }} onClick={this.addArticle}>创建文章</Button>
                                <Button type='primary' style={{ margin: 10 }} onClick={this.updateArticle}>编辑文章</Button>
                                <Button type='primary' style={{ margin: 10 }} onClick={this.removeArticle}>删除文章</Button>
                            </Col>
                            <Col span='6'>
                                <Input placeholder='请输入要搜索的内容' style={{ width: 200 }} onChange={this.handleSearchChange} />
                                <Button type='primary' style={{ margin: 10 }} onClick={this.handleSearch}>搜索</Button>
                            </Col>
                        </Row>

                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: this.onRowClick,
                                };
                            }}
                            columns={columns}
                            dataSource={this.state.articles}
                            pagination={this.state.pagination}
                            rowSelection={rowSelection}
                        />
                    </Col>
                </Row>
                <Modal
                    title={this.state.title}
                    visible={this.state.visibleModal}
                    onOk={this.onSubmit}
                    onCancel={this.onCancel}
                    width={800}
                >
                    <Article
                        wrappedComponentRef={(inst) => this.articleForm = inst}
                        isAdd={this.state.isAdd}
                        article={this.state.selectedItem}
                    />
                </Modal>
            </div>
        )
    }
}


class Article extends React.Component {
    render() {
        let article = this.props.article;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        };
        let { getFieldProps } = this.props.form;
        let commentList = []
        article && article.comments.length > 0 && article.comments.forEach((item) => {
            commentList.push(
                <Form.Item label={item.user} {...formItemLayout}>
                    <div style={{ height: 100 }}>{item.content}</div>
                    <span style={{ float: 'right' }}>{item.createAt}</span>
                </Form.Item>
            )
        })

        return (
            <div>
                {this.props.isAdd ?
                    <div>
                        <Form.Item label="标题" {...formItemLayout} >
                            <Input
                                maxLength={50}
                                placeholder="最多输入50个字"
                                {...getFieldProps('title')}
                            />
                        </Form.Item>
                        <Form.Item label="正文" {...formItemLayout}  >
                            <Input.TextArea
                                maxLength={500}
                                placeholder='博客正文'
                                {...getFieldProps('content')}
                                style={{ height: 200 }}
                            />
                        </Form.Item>
                    </div> :
                    <div>
                        <Form.Item label="标题" {...formItemLayout} >
                            <Input
                                maxLength={50}
                                placeholder="最多输入50个字"
                                {...getFieldProps('title', { initialValue: article.title })}
                            />
                        </Form.Item>
                        <Form.Item label="正文" {...formItemLayout}  >
                            <Input.TextArea
                                maxLength={500}
                                placeholder='博客正文'
                                {...getFieldProps('content', { initialValue: article.content })}
                                style={{ height: 200 }}
                            />
                        </Form.Item>
                        <Input
                            type="hidden"
                            {...getFieldProps('id', { initialValue: article._id })}
                        />
                        <div style={{ padding: 10 }}>
                            <big>评论列表</big>
                            <span style={{ float: 'right' }}> 评论数:  {article.comments.length}</span>
                        </div>
                        {article.comments.length <= 0 ? <Form.Item  {...formItemLayout}>
                            <div style={{ height: 100 }}>还没有评论~~</div>
                        </Form.Item> : commentList}
                    </div>
                }

            </div>
        )
    }

}

Article = Form.create({})(Article)