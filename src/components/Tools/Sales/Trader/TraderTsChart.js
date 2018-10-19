import React from 'react';
import { Modal } from 'antd';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { DataView } from '@antv/data-set';
import styles from './TraderTsChart.css';

function TraderTsChart(props) {
  const { data, title, visible, handleOk, handleCancel } = props;
  const dv = new DataView();
  dv.source(data).transform({
    type: 'fold',
    fields: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], // 展开字段集
    key: '月份', // key字段
    value: '获配额', // value字段
  });
  return (
    <div className={styles.normal}>
      <Modal
        title={title}
        visible={visible}
        width="80vw"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose="true"
      >
        <Chart height={400} data={dv} forceFit>
          <Axis name="月份" />
          <Axis
            name="获配额"
            label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Legend />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom type="interval" position="月份*获配额" color={'index'} adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
        </Chart>
      </Modal>
    </div>
  );
}

export default TraderTsChart;
