import React from 'react';
import { Button } from 'antd';
import fetch from 'dva/fetch';
import request from '../../../utils/request';
import styles from './TodoMain.css';
import TodoTable from './TodoTable';
import TodoModal from './TodoModal';

const R = require('ramda');

class TodoMain extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filterTraders: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }


  getFilters=() => {
    const { data } = this.state;
    if (data.length > 0) {
      const traders = R.pluck('trader')(data);
      const filterTrader = R.uniq(traders);
      const traderList = [];
      filterTrader.forEach(d => traderList.push({ text: d, value: d }));
      this.setState({ filterTraders: traderList,
      });
    }
  };


  createHandler = (values) => {
    try {
      const values2 = values;
      values2.date = values.date.format('YYYY-MM-DD HH:mm:ss').toString();
      fetch('/api/posttodo', {
        method: 'POST',
        body: JSON.stringify(values2),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(this.fetchData());
    } catch (error) {
      // console.log('error: ', error);
    }
  };

  fetchData = () => {
    const pms = request('/api/todo');
    pms.then((datas) => {
      this.setState({ data: datas.data });
      this.getFilters();
    }).catch(err => ({ err }));
  }

  deleteHandle = (values) => {
    try {
      fetch('/api/deletetodo', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        this.fetchData();
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  };


  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.create}>
          <TodoModal record={{}} onOk={this.createHandler} >
            <Button type="primary">新建事项</Button>
          </TodoModal>
        </div>
        <TodoTable
          fetchedData={this.state.data} deleteData={this.deleteHandle}
          traders={this.state.filterTraders}
        />
      </div>
    );
  }
}

export default TodoMain;
