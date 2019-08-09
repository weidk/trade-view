import React from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { Tag, Divider } from 'antd';
import request from '../../../../utils/request';
import styles from './XondIndexMain.css';


class XondIndexMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      latest: '',
    };
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    let ds = [];
    const pms = request('/api/xbondindex');
    pms.then((datas) => {
      ds = datas.data;
      this.setState({
        chartdata: ds,
        latest: ds[ds.length - 1],
      });
    }).catch(err => ({ err }));
  }


  render() {
    return (
      <div className={styles.normal}>
        <h3>
          {`${this.state.latest.TRADEDATE} 日预测：下个交易日  ——  `}{this.state.latest.NEXTDAYINDEX === 1 ? <Tag color="#f50">上涨</Tag> : <Tag color="#87d068">下跌</Tag>}
        </h3>
        <Divider />
        <Chart padding="auto" forceFit height={200} data={this.state.chartdata}>
          <Axis name="TRADEDATE" />
          <Axis
            name="NEXTDAYINDEX" label={{
              formatter: (val) => {
                if (val < 0) { return '跌'; } else { return '涨'; }
              },
            }}
          />
          <Tooltip />
          <Geom
            type="interval" position="TRADEDATE*NEXTDAYINDEX" size={4}
            color={['NEXTDAYINDEX', (cut) => {
              if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
            }]}
          />
        </Chart>
      </div>
    );
  }
}


export default XondIndexMain;
