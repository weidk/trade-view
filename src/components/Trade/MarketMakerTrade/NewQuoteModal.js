import React from 'react';
import moment from 'moment';
import { Label, Header, Button } from 'semantic-ui-react';
import { Drawer, Form, Input, Col, Row, Icon } from 'antd';
import styles from './NewQuoteModal.css';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class NewQuoteModal extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSend(
          { ...values, bondcode: this.props.code, direction: this.props.direction, ordertime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'), orderid: values.name + moment().locale('zh-cn').format('YYYYMMDDHHmmss') },
        );
        this.props.onClose();
      }
    });
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { direction, code, title, visible, onClose, price } = this.props;
    const FormItem = Form.Item;
    const priceError = isFieldTouched('price') && getFieldError('price');
    const amtError = isFieldTouched('amt') && getFieldError('amt');
    const nameError = isFieldTouched('name') && getFieldError('name');
    return (
      <div className={styles.normal}>
        <Drawer
          title={title}
          placement="bottom"
          visible={visible}
          onClose={onClose}
          height={150}
          destroyOnClose
          maskClosable={false}
        >
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Row type="flex" justify="space-around" align="top">
              <Col span={2}>
                <Label color={(direction === '本方买入') ? 'red' : 'green'} size="huge">{direction}</Label>
              </Col>
              <Col span={2}>
                <Header as="h2">
                  { code }
                </Header>
              </Col>
              <Col span={4}>
                <FormItem
                  validateStatus={priceError ? 'error' : ''}
                  help={priceError || ''}
                >
                  {getFieldDecorator('price', {
                    rules: [{
                      pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/, message: '收益必须为数字',
                    }, {
                      required: true, message: '请输入收益率',
                    }],
                    initialValue: price,
                  })(
                    <Input prefix={<Icon type="line-chart" style={{ color: '#1DA57A' }} />} size="large" suffix="%" placeholder="收益率" />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  validateStatus={amtError ? 'error' : ''}
                  help={amtError || ''}
                >
                  {getFieldDecorator('amt', {
                    rules: [{
                      pattern: /^[1-9]\d*$/, message: '券面总额必须为数字',
                    }, {
                      min: 4, message: '券面总额必须大于1000万',
                    }, {
                      required: true, message: '请输入券面总额',
                    }],
                  })(
                    <Input prefix={<Icon type="pay-circle" style={{ color: '#1DA57A' }} />} size="large" suffix="万元" placeholder="券面总额" />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem
                  validateStatus={nameError ? 'error' : ''}
                  help={nameError || ''}
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '交易员不可为空',
                    }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: '#1DA57A' }} />} size="large" placeholder="交易员" onPressEnter={() => {}} />,
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem>
                  <Button
                    color={(direction === '本方买入') ? 'red' : 'green'}
                    size="huge"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                  >下单</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(NewQuoteModal);
