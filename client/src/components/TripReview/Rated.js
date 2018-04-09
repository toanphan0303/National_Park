import React , {Component} from 'react'
import {Button, Form,Comment, Dimmer, Loader} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import ratedTrip from '../mutations/ratedTrip'
import ratedYet from '../queries/ratedYet'
import {Rating} from 'semantic-ui-react'
class Rated extends Component{
  constructor(props){
    super(props)
    this.state = {
      rated: false,
      rateValue: 0
    }
  }
  handleRate = async (e, {rating}) =>{
    const {userId, tripId} = this.props
    return await this.props.ratedTrip({
      variables: { userId, tripId, value:rating},
      refetchQueries: [{query:ratedYet, variables:{userId: this.props.userId, tripId:this.props.tripId} }]
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data.ratedYet.id){
      this.setState({
        rated: true,
        rateValue:nextProps.data.ratedYet.rated
      })
    }
  }
  render(){
    if(!this.props.data.ratedYet){
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return(
      <div>
        <h5>Your Rating</h5>
        {this.state.rated ? <div>You already rated this trip</div> : <div>Please rate this trip</div>}
        <Rating icon='star' maxRating={5} onRate={this.handleRate} disabled={this.state.rated} defaultRating={this.state.rateValue}/>
      </div>
    )
  }
}
export default compose(
  graphql(ratedTrip, {
    name: 'ratedTrip'
  }),
  graphql(ratedYet, {
    options: (props) => { return {variables: { userId: props.userId, tripId:props.tripId}}}
  })
)(Rated)
