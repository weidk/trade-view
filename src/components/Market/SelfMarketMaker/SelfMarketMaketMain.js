import React from 'react';
import { Input, Button, Icon, Table } from 'antd';
import request from '../../../utils/request';
import styles from './SelfMarketMaketMain.css';

class SelfMarketMaketMain extends React.Component {
  constructor() {
    super();
    this.state = {
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      data: '',
    };
  }
  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  onSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: this.state.data.map((record) => {
        const match = record.SCode.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          SCode: (
            <span>
              {record.SCode.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((text, i) => (
                text.toLowerCase() === searchText.toLowerCase() ?
                  <span key={i} className={styles.highlight}>{text}</span> : text // eslint-disable-line
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }

  fetchData = () => {
    const pms = request('/api/selfmarketquote');
    pms.then((datas) => {
      this.setState({ data: datas.data });
    }).catch(err => ({ err }));
  }

  render() {
    const columns = [{
      title: '代码',
      dataIndex: 'SCode',
      width: 180,
      filterDropdown: (
        <div className={styles.dropdown}>
          <Input
            className={styles.input}
            placeholder="Search code"
            value={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>Search</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput && this.searchInput.focus());
      },
    }, {
      title: '净价',
      dataIndex: 'OrdPrice',
      width: 150,
    }, {
      title: '收益',
      dataIndex: 'OrdYield',
      width: 150,
    }, {
      title: '数量',
      dataIndex: 'OrdVolume',
      width: 150,
    }, {
      title: '方向',
      dataIndex: 'Direction',
      width: 150,

    }, {
      title: '时间',
      dataIndex: 'OrdTime',
      width: 200,
    },
    ];
    return (
      <div className={styles.normal}>
        <Table
          columns={columns} dataSource={this.state.data}
          scroll={{ y: 500 }} pagination={false}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
}

export default SelfMarketMaketMain;
