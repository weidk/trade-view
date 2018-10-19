import React from 'react';
import { Tab } from 'semantic-ui-react';
import MarketQuotes from './MarketQuotes';
import LimitQuotes from './LimitQuotes';
import styles from './QuoteStatus.css';

const panes = [
  { menuItem: '做市报价', render: () => <Tab.Pane attached={false}><MarketQuotes /></Tab.Pane> },
  { menuItem: '限价报价', render: () => <Tab.Pane attached={false}><LimitQuotes /></Tab.Pane> },
];

class QuoteStatus extends React.Component {
  componentWillMount() {
  }

  render() {
    return (
      <div className={styles.normal}>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    );
  }
}


export default QuoteStatus;
