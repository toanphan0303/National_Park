import React, {Component} from 'react';
import Header from './Header'
import ParkList from './ParkList'
const App = (props) => {
  return (
    <div>
      <Header />
      <div>
        <ParkList />
      </div>
    </div>
  )
};

export default App;
