import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
// import styles from './PositionModal.css';

const FormItem = Form.Item;

class PositionModal extends React.Component {
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
    const { trader, bondcode, bondname, amt, date } = this.props.record;
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
          title="编辑持仓"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="交易员"
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
              label="债券代码/简称"
              required
            >
              {
                getFieldDecorator('bondcode', {
                  initialValue: bondcode,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {
                getFieldDecorator('bondname', {
                  initialValue: bondname,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数量"
              required
            >
              {
                getFieldDecorator('amt', {
                  initialValue: amt,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="日期"
              required
            >
              {
                getFieldDecorator('date', {
                  initialValue: date,
                })(<DatePicker />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}


export default Form.create()(PositionModal);
