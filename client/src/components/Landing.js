import React, {Component} from 'react';
import Header from './Header'
import ParkList from './ParkList'
import { Segment} from 'semantic-ui-react'
import PopularTrips from './PopularTrips'
const App = (props) => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <Segment style={{margin:'0px', padding:"0px 100px"}}>
        <div style={{marginBottom:'20px'}}>
          <PopularTrips />
        </div>
      </Segment>
      <Segment style={{margin:'0px', padding:"0px 100px"}}>
        <ParkList />
      </Segment>
    </div>
  )
};

export default App;
