import React from 'react';
import { Chart, Geom, Tooltip, Coord, Label, View } from 'bizcharts';
import { DataView } from '@antv/data-set';
import styles from './PositionPie.css';
import request from '../../../utils/request';

class PositionPie extends React.Component {
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
    const pms = request('/api/reprotpositionpie');
    pms.then((datas) => {
      this.setState({ chartdata: datas.data });
    }).catch(err => ({ err }));
  }

  render() {
    const data = this.state.chartdata;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'amt',
      dimension: 'ftype',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: (val) => {
          val = `${(val * 100).toFixed(2)}%`;
          return val;
        },
      },
    };
    const dv1 = new DataView();
    dv1.source(data).transform({
      type: 'percent',
      field: 'amt',
      dimension: 'stype',
      as: 'percent',
    });
    return (
      <div className={styles.normal}>
        <Chart data={dv} scale={cols} padding={[80, 100, 80, 80]} forceFit>
          <Coord type="theta" radius={0.5} />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="ftype"
            tooltip={['ftype*percent', (item, percent) => {
              percent = `${(percent * 100).toFixed(2)}%`;
              return {
                name: item,
                value: percent,
              };
            }]}
            style={{ lineWidth: 1, stroke: '#fff' }}
            select={false}
          >
            <Label content="ftype" offset={-10} />
          </Geom>
          <View data={dv1} scale={cols} >
            <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />
            <Geom
              type="intervalStack"
              position="percent"
              color={['stype', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4']]}
              tooltip={['stype*percent', (item, percent) => {
                percent = `${(percent * 100).toFixed(2)}%`;
                return {
                  name: item,
                  value: percent,
                };
              }]}
              style={{ lineWidth: 1, stroke: '#fff' }}
              select={false}
            >
              <Label content="stype" />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}

export default PositionPie;
