import React from 'react';
import { notification, Card, Col, Row } from 'antd';
import request from '../../../utils/request';
import styles from './SysMonitorMain.css';

class SysMonitorMain extends React.Component {
  constructor() {
    super();
    this.state = {
      latestInterval: '',
      maxInterval: '',
      latestUpdate: '',
      intervalUpdate: '',
    };
  }
  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
      if (this.state.latestInterval > 60) {
        notification.warning({
          key: 'interval',
          message: <div className={styles.alert}>行情报价延时</div>,
          description: `当前报价延时：${this.state.latestInterval} 秒`,
          duration: 10,
        });
      }
      if (this.state.intervalUpdate > 30) {
        notification.warning({
          key: 'update',
          message: <div className={styles.alert}>行情推送异常</div>,
          description: `已经有：${this.state.intervalUpdate} 秒 没有报价更新！`,
          duration: 10,
        });
      }
      if (this.state.intervalUpdate > 180) {
        notification.error({
          key: 'update',
          message: <div className={styles.alert}>行情异常</div>,
          description: `已经有：${this.state.intervalUpdate} 秒 没有报价更新，行情可能已经断开！！`,
          duration: 10,
        });
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  fetchData = () => {
    const pms = request('/api/monitormaxinterval');
    pms.then((datas) => {
      this.setState({ maxInterval: datas.data });
    }).catch(err => ({ err }));
    const pms1 = request('/api/monitorlatestinterval');
    pms1.then((datas) => {
      this.setState({ latestInterval: datas.data });
    }).catch(err => ({ err }));
    const pms2 = request('/api/monitorlatestupdate');
    pms2.then((datas) => {
      this.setState({ latestUpdate: datas.data.CT[0],
        intervalUpdate: datas.data.INTERVAL[0] });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <div className={styles.normal}>
        <div style={{ padding: '30px' }}>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Card title="行情监控" >
                <p>最新延迟时间：
                <b className={this.state.latestInterval > 60 ? styles.alert : styles.normal}>
                  {this.state.latestInterval}</b> 秒</p>
                <p>最大延迟时间：
                <b className={this.state.maxInterval > 3 ? styles.alert : styles.normal}>
                  {this.state.maxInterval}</b> 分</p>
                <p>最新行情更新时间：
                <b
                  className={this.state.intervalUpdate > 30 ? styles.alert : styles.normal}
                >{this.state.latestUpdate} （{this.state.intervalUpdate} 秒前）</b> </p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default SysMonitorMain;
