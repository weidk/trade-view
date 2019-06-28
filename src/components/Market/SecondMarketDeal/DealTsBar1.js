import React from 'react';
import fetch from 'dva/fetch';
import { Chart, Geom, Tooltip, Axis } from 'bizcharts';
import { Spin } from 'antd';
import styles from './DealTsBar.css';


class DealTsBar1 extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchData(this.props.ins, this.props.type);
  }

  fetchData = (insdata, typedata) => {
    try {
      fetch('/api/marketdealts1', {
        method: 'POST',
        body: JSON.stringify({ ins: insdata, type: typedata }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds, loading: false });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }


  render() {
    const data = this.state.chartdata;
    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.loading} >
          <Chart height={400} data={data} padding="auto" forceFit >
            <Axis name="date" />
            <Axis
              name="type" label={{
                formatter: (val) => {
                  return `${val}亿`;
                },
              }}
            />
            <Tooltip />
            <Geom
              type="interval"
              position="date*type"
              size={2}
              shape={'hv'}
              color={['type', (cut) => {
                if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
              }]}
            />
            <Geom type="line" position="date*yield" color="#fdae6b" size={3} shape="smooth" />
            <Axis name="tongbi" position="right" />
            <Geom
              type="line"
              position="date*tongbi"
              size={3}
              color="#FFA500"
            />
          </Chart>
        </Spin>
      </div>
    );
  }
}

export default DealTsBar1;
