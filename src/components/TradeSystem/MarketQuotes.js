import React from 'react';
import { Table, Pagination } from 'semantic-ui-react';
import styles from './MarketQuotes.css';
import request from '../../utils/request';

class MarketQuotes extends React.Component {
  constructor() {
    super();
    this.state = {
      totalData: [],
      indexData: [],
      totalNum: '', // 总记录数
      current: 1, // 当前页码
      pageSize: 12, // 每页显示的条数8条
      totalPage: '', // 总页数
    };
  }
  componentWillMount() {
    this.interval = setInterval(() => this.fetchData(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData() {
    const pms = request('http://127.0.0.1:5000/marketquotes');
    pms.then((datas) => {
      // console.log(datas.data);
      this.setState({ totalData: datas.data });
      this.setState({ totalNum: datas.data.length });
      const totalPage = Math.ceil(this.state.totalNum / this.state.pageSize);
      this.setState({ totalPage });
      this.pageClick(1);
    }).catch(err => ({ err }));
  }

  pageClick(pageNum) {
    try {
      if (pageNum !== this.state.current) {
        this.state.current = pageNum;
      }
      const indexData = [];
      for (let i = (pageNum - 1) * this.state.pageSize; i < this.state.pageSize * pageNum; i += 1) {
        if (this.state.totalData[i]) {
          indexData.push(this.state.totalData[i]);
        }
      }
      this.setState({ indexData });
    } catch (err) {
      console.log(err);
    }
  }


  render() {
    return (
      <div className={styles.normal}>
        <Table sortable celled fixed inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell >
              债券代码
              </Table.HeaderCell>
              <Table.HeaderCell >
              买剩余量
              </Table.HeaderCell>
              <Table.HeaderCell >
              卖剩余量
              </Table.HeaderCell>
              <Table.HeaderCell >
              QUOTEID
              </Table.HeaderCell>
              <Table.HeaderCell >
              报价状态
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.state.indexData.map(d => (
                <Table.Row key={d.QUOTEID}>
                  <Table.Cell>{d.SECURITYID}</Table.Cell>
                  <Table.Cell>{d.BUYLEAVEQTY}</Table.Cell>
                  <Table.Cell>{d.SELLLEAVEQTY}</Table.Cell>
                  <Table.Cell>{d.QUOTEID}</Table.Cell>
                  <Table.Cell>{d.QUOTESTATUS}</Table.Cell>
                </Table.Row>
              ),
              )
            }
          </Table.Body>
        </Table>
        <div className={styles.right}>
          <Pagination
            activePage={this.state.current}
            totalPages={this.state.totalPage}
            inverted
            onPageChange={(e, { activePage }) => this.pageClick(activePage)}
            disabled
          />
        </div>
      </div>
    );
  }
}

export default MarketQuotes;
