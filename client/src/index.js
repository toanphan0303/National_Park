import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './style/materialize.css';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Router, hashHistory, Route, IndexRoute} from 'react-router';
import App from './components/App';
import Landing from './components/Landing'
import ParkDetail from './components/ParkDetails'
import AllParkList from './components/AllParkList'
import TripsSummary from './components/TripsSummary'
import RequireAuth from './components/Auth/RequireAuth'
import ParkDetailUpdate from './components/TripUpdate/ParkDetailUpdate'
import TripReview from './components/TripReview/TripReview'
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css'
const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin'
  }
})
const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id,
});

const Root = () => {
  console.log('GOOGLE_MAP_API',process.env.GOOGLE_MAP_API)
  console.log('Environment', process.env);

  return(
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App} >
          <IndexRoute component={Landing} />
          <Route path="/parks/" component={AllParkList} />
          <Route path="/parks/:id" component={RequireAuth(ParkDetail)} />
          <Route path="/parks/trips/summary" component={RequireAuth(TripsSummary)} />
          <Route path="parks/:parkid/trips/:id" component={RequireAuth(ParkDetailUpdate)} />
          <Route path='trips/:id/tripreview' component={RequireAuth(TripReview)} />
        </Route>
      </Router>
    </ApolloProvider>
  )
}
ReactDOM.render(<Root />, document.querySelector('#root'))
registerServiceWorker();
