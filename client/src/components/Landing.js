import React, {Component} from 'react';
import Header from './Header'
import ParkList from './ParkList'
import { Segment} from 'semantic-ui-react'
const App = (props) => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <Segment>
        <ParkList />
      </Segment>
    </div>
  )
};

export default App;
