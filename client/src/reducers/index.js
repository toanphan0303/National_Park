import {combineReducers} from 'redux';
import TripReducer from './reducer_trip';

const rootReducer = combineReducers({
  trip: TripReducer
})
