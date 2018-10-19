import React from 'react';
import { Chart, Tooltip, Axis, Geom, Coord, Label } from 'bizcharts';
import styles from './ChangeBar.css';

function ChangeBar(props) {
  const { barData, title, ax1, ax2 } = props;
  return (
    <div className={styles.normal}>
      <h3>{title}</h3>
      <Chart data={barData} forceFit padding={{ top: 20, right: 66, bottom: 20, left: 66 }} >
        <Coord transpose />
        <Axis name={ax1} />
        <Axis name={ax2} />
        <Tooltip />
        <Geom
          type="interval"
          position={`${ax1}*${ax2}`}
          color={[ax2, (cut) => {
            if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
          }]}
        >
          <Label
            content="yield"
            textStyle={{
              textAlign: 'middle', // 文本对齐方向，可取值为： start middle end
              fill: '#272227', // 文本的颜色
              fontSize: '12', // 文本大小
              fontWeight: 'bold', // 文本粗细
              autoRotate: true,
            }}
          />
        </Geom>
      </Chart>
    </div>
  );
}

export default ChangeBar;
