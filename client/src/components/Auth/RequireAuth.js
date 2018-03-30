import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import currentUserQuery from '../queries/CurrentUser'
import {hashHistory} from 'react-router'
import AuthModal from '../modals/AuthMo'
export default(WrappedComponent) => {
  class RequireAuth extends Component {
    openSignup(){
      this.child.openModalSignUp()
    }
    componentWillUpdate(nextProps){
      if(!nextProps.data.loading && !nextProps.data.user){
        this.openSignup()
      }
    }
    render(){
      console.log(this.props.data)
      if(!this.props.data.user){
        return(
          <AuthModal
            onRef={ref =>{this.child = ref}}
          />
        )
      }
      return <WrappedComponent {...this.props} />
    }
  }

  return graphql(currentUserQuery)(RequireAuth)
}
