import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import request from '../../../utils/request';


class CreditMarketMaker extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const pms = request('/api/creditmarketscores');
    pms.then((datas) => {
      this.setState({ chartdata: datas.data });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <Chart height={400} data={this.state.chartdata} forceFit>
        <Legend />
        <Axis name="DAYS" />
        <Axis
          name="AMT" label={{
            formatter: (val) => {
              return `${val}亿`;
            },
          }}
        />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="line" position="DAYS*AMT" size={2} color={'INITIATOR'} shape={'smooth'} />
      </Chart>
    );
  }
}

export default CreditMarketMaker;
