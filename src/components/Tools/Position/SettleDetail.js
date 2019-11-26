/* eslint-disable no-self-compare,react/sort-comp,no-empty */
import React from 'react';
import { Table, Popconfirm, Form, Button, Select, Row, Col, Switch, Input, message } from 'antd';
import fetch from 'dva/fetch';
import request from '../../../utils/request';
import '../../../config';
import styles from './SettleDetail.css';
import TextModal from './TextModal';

// const FormItem = Form.Item;
const { Option } = Select;

let traderFilter = global.constants.traders;
traderFilter = traderFilter.map((t) => {
  const obj = {};
  obj.text = t;
  obj.value = t;
  return obj;
});

class SettleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '交易员',
      dataIndex: 'trader',
      filters: traderFilter,
      onFilter: (value, record) => record.trader.indexOf(value) === 0,
      render: text => <h3>{text}</h3>,
    }, {
      title: '债券代码',
      dataIndex: 'bondcode',
      render: text => <h3>{text}</h3>,
    }, {
      title: '买入(亿)',
      dataIndex: 'buyamt',
      render: text => <h3>{text}</h3>,
    }, {
      title: '卖出(亿)',
      dataIndex: 'sellamt',
      render: text => <h3>{text}</h3>,
    }, {
      title: '轧差(亿)',
      dataIndex: 'netamt',
      render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    },
    // {
    //   title: '冻结(亿)',
    //   dataIndex: 'frozeamt',
    //   render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    // },
    {
      title: '备注',
      dataIndex: 'note',
    }, {
      title: '非现券头寸',
      editable: true,
      dataIndex: 'nonbond',
      width: '20%',
    }, {
      title: '',
      dataIndex: 'operation',
      width: '5%',
      render: (text, record) =>
        (this.state.dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        ) : null),
    }];


    this.state = {
      dataSource: [],
      visible: false,
      visible2: false,
      selectoption: '',
      NoAdd: false,
      psw: '',
      switchdisabled: true,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.getData('/api/positionpsw', (ds) => {
      const psw = ds.data;
      this.setState({ psw });
    });
    setInterval(() => this.getData('/api/positionstatus', (ds) => {
      let NoAdd;
      if (ds.data[0].NotAllowAdd === 1) {
        NoAdd = true;
      } else {
        NoAdd = false;
      }
      this.setState({ NoAdd });
    }), 5000);
    const selectchildren = global.constants.traders;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ selectoption: selectchildren.map(trader => <Option key={trader}>{trader}</Option>) });
    // selectchildren = selectchildren.map(trader => <Option key={trader}>{trader}</Option>);
  }
  onSwitchChange = () => {
    if (this.state.NoAdd) {
      try {
        fetch('/api/changepositionstatus', {
          method: 'POST',
          body: JSON.stringify({ data: 0 }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((ds) => {
            let NoAdd;
            if (ds[0].NotAllowAdd === 1) {
              NoAdd = true;
            } else {
              NoAdd = false;
            }
            this.setState({ NoAdd });
          });
        });
      } catch (error) {
      // console.log('error: ', error);
      }
    } else {
      this.postData('/api/changepositionstatus', { data: 1 }, (response) => {
        response.json().then((ds) => {
          let NoAdd;
          if (ds[0].NotAllowAdd === 1) {
            NoAdd = true;
          } else {
            NoAdd = false;
          }
          this.setState({ NoAdd });
        });
      });
    }
  };

  onInput =() => {
    if (this.state.psw === 'zjs666') {
      this.setState({ switchdisabled: false });
    } else {
      message.error('密码输入错误！');
    }
  };

   showModal = () => {
     this.setState({
       visible: true,
     });
   };
   showModal2 = () => {
     this.setState({
       visible2: true,
     });
   };
   handleCancel = () => {
     this.setState({
       visible: false,
     });
   };


   handleCancel2 = () => {
     this.setState({
       visible2: false,
     });
   };

   handleOk2 = (values) => {
     try {
       fetch('/api/postsettle', {
         method: 'POST',
         body: JSON.stringify(values),
         headers: {
           'Content-Type': 'application/json',
         },
       }).then(() => { this.fetchData(); }).then(() => { this.props.fetchSumData(); });
     } catch (error) {
       // console.log('error: ', error);
     }
     this.setState({
       visible2: false,
     });
   };

   fetchData = () => {
     const pms = request('/api/settleposition');
     pms.then((ds) => {
       this.setState({ dataSource: ds.data });
     }).catch(err => ({ err }));
   }

   getData = (requestUrl, fn) => {
     try {
       const pms = request(requestUrl);
       pms.then(fn).catch(err => ({ err }));
     } catch (err) {
     }
   };

   postData = (requestUrl, values, fn) => {
     try {
       fetch(requestUrl, {
         method: 'POST',
         body: JSON.stringify(values),
         headers: {
           'Content-Type': 'application/json',
         },
       }).then(fn);
     } catch (error) {
       // console.log('error: ', error);
     }
   };

   handleDelete = (values) => {
     try {
       fetch('/api/deletesettle', {
         method: 'POST',
         body: JSON.stringify(values),
         headers: {
           'Content-Type': 'application/json',
         },
       }).then(() => {
         this.fetchData();
       }).then(() => { this.props.fetchSumData(); });
     } catch (error) {
       // console.log('error: ', error);
     }
   };

   render() {
     return (
       <div className={styles.normal}>
         <Row gutter={16}>
           <Col span={18}>
             {/* <Button type="primary" onClick={this.showModal2} block disabled={new Date() > new Date(new Date().setHours(14)).setMinutes(30) & this.state.NoAdd}>新增头寸</Button>*/}
             <Button type="primary" onClick={this.showModal2} block disabled={this.state.NoAdd}>新增头寸</Button>
           </Col>
           <Col span={4}>
             <Input placeholder="请输入密码,按回车确认" type="password" onPressEnter={this.onInput} onChange={e => this.setState({ psw: e.target.value })} />
           </Col>
           <Col span={2}>
             <Switch checkedChildren="允许新增" unCheckedChildren="禁止新增" defaultChecked onChange={this.onSwitchChange} disabled={this.state.switchdisabled} />
           </Col>
         </Row>
         {/* <Button type="primary" onClick={this.showModal} disabled={new Date() > new Date(new Date().setHours(17)).setMinutes(50)}>新增一条结算头寸</Button>*/}
         <Table columns={this.columns} dataSource={this.state.dataSource} pagination={false} size="small" />
         <TextModal visible={this.state.visible2} handleOk={this.handleOk2} handleCancel={this.handleCancel2} selectchildren={this.state.selectoption} />
       </div>
     );
   }
}

export default Form.create()(SettleDetail);
