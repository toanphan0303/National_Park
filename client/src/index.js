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
import TripsSummary from './components/TripsSummary'
import Blog from './components/blog'
import ParkDetailUpdate from './components/TripUpdate/ParkDetailUpdate'
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
  return(
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App} >
          <IndexRoute component={Landing} />
          <Route path="/parks/:id" component={ParkDetail} />
          <Route path="/parks/trips/summary" component={TripsSummary} />
          <Route path="parks/:parkid/trips/:id" component={ParkDetailUpdate} />
          <Route path="blog" component={Blog} />
        </Route>
      </Router>
    </ApolloProvider>
  )
}
ReactDOM.render(<Root />, document.querySelector('#root'))
registerServiceWorker();
