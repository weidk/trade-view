import React from 'react';
import { Chart, Geom, Tooltip, Coord, Label, Axis, Legend } from 'bizcharts';
import { DataView } from '@antv/data-set';
import styles from './FRprofitPie.css';
import request from '../../../utils/request';


class FRprofitPie extends React.Component {
  constructor() {
    super();
    this.state = {
      piedata: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const pms = request('/api/reportfrprofit');
    pms.then((datas) => {
      this.setState({ piedata: datas.data });
    }).catch(err => ({ err }));
  }

  render() {
    const dv = new DataView();
    const data = this.state.piedata;
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => `${(val * 100).toFixed(0)}%`,
      },
    };

    return (
      <div className={styles.normal}>
        <Chart data={dv} scale={cols} padding={[80, 100, 80, 80]} forceFit>
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" />
          <Legend position="right" />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            style={{ lineWidth: 1, stroke: '#fff' }}
          >
            <Label
              content="percent" offset={-40} textStyle={{
                rotate: 0,
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              }}
            />

          </Geom>
        </Chart>
      </div>
    );
  }
}

export default FRprofitPie;
