import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, message, Radio } from 'antd';
// Select, InputNumber, DatePicker
import UserTable from '../../components/UserTable';
import FormModal from '../../components/FormModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Users.less';

const FormItem = Form.Item;
// const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// redux 链接store数据 to props
@connect(state => ({
  users: state.users,
}))
// antd 建立表单
@Form.create()
export default class Users extends PureComponent {
  // 初始化数据，类似constructor干的事儿
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  // 渲染时获取用户
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetch',
    });
  }

  /**
   * 新增用户的表单内容
   */
  onCreateRender = (form) => {
    const { getFieldDecorator } = form;
    return (
      // <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
      //   <Col md={8} sm={16}>
      <Form layout="inline">
        <Row>
          <Col>
            <FormItem
              required="true"
              label="用户名"
            >
              {getFieldDecorator('loginName', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入用户名',
                  }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="密码"
            >
              {getFieldDecorator('rawPassword', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入密码',
                  }],
              })(
                <Input placeholder="请输入明文密码" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="角色"
            >
              {getFieldDecorator('role', {
                rules: [
                  {
                    required: true,
                    message: '必须确定一个角色',
                  }],
              })(
                <Radio.Group>
                  <Radio.Button value="user">用户</Radio.Button>
                  <Radio.Button value="developer">开发者</Radio.Button>
                  <Radio.Button value="manager">管理员</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
      //   {/* </Col>
      // </Row> */}
    );
  }
  // 给UserTable的，变化时更新数据
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'users/fetch',
      payload: params,
    });
  }

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'users/fetch',
      payload: {},
    });
  }

  handleRemove = id => () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/remove',
      payload: {
        id: [id],
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'users/remove',
          payload: {
            id: selectedRows.map(row => row.id),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  // 点击搜索时，不放弃任何数据
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'users/fetch',
        payload: values,
      });
    });
  }

  // 隐藏or显示Modal
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  // 执行添加
  handleAdd = (data) => {
    this.props.dispatch({
      type: 'users/add',
      payload: data,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible(false);
      },
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('search')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { users: { loading, data } } = this.props;
    const { selectedRows, modalVisible } =
    this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <UserTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              doDelete={this.handleRemove}
            />
          </div>
        </Card>
        <FormModal
          title="新增用户"
          visible={modalVisible}
          onFormRender={this.onCreateRender}
          onCancel={() => this.handleModalVisible()}
          onOk={this.handleAdd}
        />
      </PageHeaderLayout>
    );
  }
}
