import React from 'react';
import { Tab, Container } from 'semantic-ui-react';
import MainMenu from '../Layout/MainMenu';
import QuoteStatus from './QuoteStatus';

const panes = [
  { menuItem: '报价监控',
    render: () => <Tab.Pane>
      <QuoteStatus />
    </Tab.Pane> },
  { menuItem: '成交监控', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: '撤销监控', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
];


const Example = () => {
  return (
    <MainMenu >
      <Container style={{ marginTop: '7em' }}>
        <Tab grid={{ paneWidth: 14, tabWidth: 2 }} menu={{ fluid: true, vertical: true, tabular: 'left' }} panes={panes} />
      </Container>
    </MainMenu>
  );
};

Example.propTypes = {
};

export default Example;
