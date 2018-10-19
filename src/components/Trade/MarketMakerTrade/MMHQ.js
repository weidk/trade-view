import React from 'react';
import { Table } from 'antd';
import { Button } from 'semantic-ui-react';
import styles from './MMHQ.css';
import NewQuoteModal from './NewQuoteModal';


class MMHQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      direction: '',
      code: '',
      price: '',
    };
  }


  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  showDrawer = (d, record, y) => {
    this.setState({
      visible: true,
      direction: d,
      code: record.code,
      price: y,
    });
  };
  render() {
    const columns = [{
      title: 'bondcode',
      dataIndex: 'code',
      width: 150,
    }, {
      title: 'bidvol',
      dataIndex: 'bidvol',
      width: 180,
    }, {
      title: 'bid',
      dataIndex: 'bid',
      width: 180,
      render: (text, record) => <Button negative onClick={() => this.showDrawer('本方卖出', record, text)}>{text}</Button>,
    },
    {
      title: 'ofr',
      dataIndex: 'ofr',
      width: 180,
      render: (text, record) => <Button positive onClick={() => this.showDrawer('本方买入', record, text)}>{text}</Button>,
    }, {
      title: 'ofrvol',
      dataIndex: 'ofrvol',
      width: 180,
    },
    {
      title: 'time',
      dataIndex: 'ordtime',
      width: 150,
    },
    ];
    return (
      <div className={styles.normal}>
        <Table
          columns={columns} dataSource={this.props.data}
          scroll={{ y: 300 }} pagination={false}
          size="small"
        />
        <NewQuoteModal
          // visible
          // code="180210.IB"
          // price="4.21"
          // direction="本方买入"
          visible={this.state.visible}
          code={this.state.code}
          price={this.state.price}
          direction={this.state.direction}
          onClose={this.onClose}
          onSend={this.props.send}
        />
      </div>
    );
  }
}

export default MMHQ;
