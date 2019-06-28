import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
// import styles from './PositionModal.css';

const FormItem = Form.Item;

class TodoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };


  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { trader, todo, date } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="编辑待办事项"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="创建人"
              required
            >
              {
                getFieldDecorator('trader', {
                  initialValue: trader,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提醒内容"
            >
              {
                getFieldDecorator('todo', {
                  initialValue: todo,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提醒时间"
              required
            >
              {
                getFieldDecorator('date', {
                  initialValue: date,
                })(<DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}


export default Form.create()(TodoModal);
