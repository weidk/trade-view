import React from 'react';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';
import styles from './CurveMatChart.css';

function CurveMatChart(props) {
  const { rawData } = props;
  const arr = ['同业存单(AAA)@0.25', '国债期货@5', '国债期货@10', '国债@1.0', '国债@3.0', '国债@5.0', '国债@7.0', '国债@10.0', '国开债@1.0', '国开债@3.0', '国开债@5.0', '国开债@7.0', '国开债@10.0', '农发行债@1.0', '农发行债@3.0', '农发行债@5.0', '农发行债@7.0', '农发行债@10.0', '地方债(AAA)@1.0', '地方债(AAA)@3.0', '地方债(AAA)@5.0', '城投债(AAA)@3.0', '城投债(AAA)@5.0', '企业债(AAA)@1.0', '企业债(AAA)@3.0', '企业债(AAA)@5.0'];
  const source = [];
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      const obj = {};
      obj.ax1 = i;
      obj.ax2 = j;
      const a = rawData.find(element => element.name === `${arr[i]}-${arr[j]}`);
      const b = rawData.find(element => element.name === `${arr[j]}-${arr[i]}`);
      if (typeof a !== 'undefined') {
        // if (a.cdf >= 80 || a.cdf <= 30) {
        obj.cdf = a.cdf;
        source.push(obj);
        // }
      } else if (typeof b !== 'undefined') {
        // if (b.cdf >= 70 || b.cdf <= 30) {
        obj.cdf = 100 - b.cdf;
        source.push(obj);
        // }
      }
    }
  }

  const cols = {
    ax1: {
      type: 'cat',
      values: arr,

    },
    ax2: {
      type: 'cat',
      values: arr,
    },
  };

  return (
    <div className={styles.normal}>
      <Chart
        height={window.innerHeight}
        data={source} scale={cols}
        padding="auto"
        forceFit
      >
        <Axis
          name="ax1" grid={{
            align: 'center',
            lineStyle: {
              lineWidth: 1,
              lineDash: null,
              stroke: '#f0f0f0',
            },
            // showFirstLine: true,
          }}
          position="top"
        />
        <Axis
          name="ax2" grid={{
            align: 'center',
            lineStyle: {
              lineWidth: 1,
              lineDash: null,
              stroke: '#f0f0f0',
            },
          }}
        />
        <Tooltip />
        <Geom
          type="polygon" position="ax1*ax2" color={['cdf', '#cef8d0-#16981c-#EE6A50']}
          style={{ stroke: '#fff', lineWidth: 1 }}
          tooltip={['ax1*ax2*cdf', (ax1, ax2, cdf) => {
            return {
              name: 'cdf',
              title: `${arr[ax1]} - ${arr[ax2]}`,
              value: cdf,
            };
          }]}
        >
          <Label
            content="cdf" offset={-2} textStyle={{
              fill: '#fff',
              fontWeight: 'bold',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
            }}
          />
        </Geom>
      </Chart>
    </div>
  );
}

export default CurveMatChart;
