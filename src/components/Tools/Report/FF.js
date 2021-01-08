/* eslint-disable react/sort-comp */
import React from 'react';
import fetch from 'dva/fetch';
import { Table, Tag, Divider, Input, Icon, Button, DatePicker } from 'antd';
// import moment from 'moment';
import Highlighter from 'react-highlight-words';
import styles from './FF.css';

const _ = require('lodash');

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class FF extends React.Component {
  constructor() {
    super();
    this.state = {
      totalData: [],
      tabledata: [],
      sumamt: 0,
      sumff: 0,
      gkamt: 0,
      weightamt: 0,
      gkff: 0,
      khamt: 0,
      khff: 0,
    };
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('/api/getff')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ tabledata: jsonData, totalData: jsonData });
        this.groupData(jsonData);
      });
  };

  groupData = (jsonData) => {
    // const sumamt = _.sumBy(jsonData, 'ALLOCATIONAMT') / 10000;

    const sumff = Math.round(_.sumBy(jsonData, 'FF'), 2);

    const gk = _.filter(jsonData, { TYPE: '2' });
    const gkamt = _.sumBy(gk, 'ALLOCATIONAMT') / 10000;
    const weightamt = _.sumBy(gk, 'WEIGHTAMT') / 10000;
    const gkff = Math.round(_.sumBy(gk, 'FF'), 2);

    const kh = _.filter(jsonData, { TYPE: '3' });
    const khamt = _.sumBy(kh, 'ALLOCATIONAMT') / 10000;
    const khff = Math.round(_.sumBy(kh, 'FF'), 2);

    const sumamt = weightamt + khamt;
    this.setState({ sumamt, sumff, gkamt, weightamt, gkff, khamt, khff });
  }


  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1DA57A' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      (this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      const jsonData = _.filter(this.state.totalData, o => o.ISSUEDAY >= startDay && o.ISSUEDAY <= endDay);
      this.setState({ tabledata: jsonData });
      this.groupData(jsonData);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const columns = [{
      title: '代码',
      dataIndex: 'BONDCODE',
    },
    {
      title: '简称',
      dataIndex: 'BONDNAME',
      key: 'BONDNAME',
      ...this.getColumnSearchProps('BONDNAME'),
    },
    {
      title: '中标量(亿)',
      dataIndex: 'ALLOCATIONAMT',
      render: text => text / 10000,
    },
    {
      title: '加权中标量(亿)',
      dataIndex: 'WEIGHTAMT',
      render: text => text / 10000,
    },
    {
      title: 'FF(万)',
      dataIndex: 'FF',
      render: (text, record) => {
        if (record.TYPE === '2') {
          return <Tag color="#53ab53">{text}</Tag>;
        } else {
          return <Tag color="#108ee9">{text}</Tag>;
        }
      },
    },
    {
      title: '发行日',
      dataIndex: 'ISSUEDAY',
    },
    {
      title: '期限',
      dataIndex: 'TERM',
    },
    ];

    return (
      <div className={styles.normal}>
        <a>请选择统计区间 ：</a>
        <RangePicker
          onChange={this.pickerChange}
          format={dateFormat}
        />
        <Divider>
          总中标量 <Tag color="#ec6663">{this.state.sumamt}</Tag>亿，总FF <Tag color="#ec6663">{this.state.sumff}</Tag>万；
          国开中标量 <Tag color="#53ab53">{this.state.gkamt}</Tag>亿，加权 <Tag
            color="#53ab53"
          >{this.state.weightamt}</Tag>亿，FF <Tag color="#53ab53">{this.state.gkff}</Tag>万；
          口行中标量 <Tag color="#108ee9">{this.state.khamt}</Tag>亿，FF <Tag color="#108ee9">{this.state.khff}</Tag>万
        </Divider>
        <Table
          columns={columns}
          dataSource={this.state.tabledata}
          pagination={false}
          size="small"
          onChange={(pagination, filters) => {
            try {
              const fdata = filters.BONDNAME.length === 0 ? this.state.tabledata : this.state.tabledata.filter(data => data.BONDNAME.includes(filters.BONDNAME[0].toLowerCase()));
              this.groupData(fdata);
              // eslint-disable-next-line no-empty
            } catch (err) {
            }
          }}
        />
      </div>
    );
  }
}

export default FF;
