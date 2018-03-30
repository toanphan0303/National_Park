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
      <Segment style={{margin:'0px', padding:"0px 100px"}}>
        <ParkList />
      </Segment>
      <Segment style={{margin:'0px', padding:"0px 100px"}}>
        <div>
          Popular Trip
        </div>
        <div>
          Popular Trip
        </div>
        <div>
          Popular Trip
        </div>
        <div>
          Popular Trip
        </div>
      </Segment>
    </div>
  )
};

export default App;
