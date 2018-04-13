import React , {Component} from 'react'
import {FacebookShareButton,TwitterShareButton,FacebookIcon,TwitterIcon,EmailShareButton,EmailIcon} from 'react-share'
class SocialShare extends Component{

  render(){
    return(
      <div style={{display:'inline-flex', paddingLeft:'20px', paddingTop:'20px'}}>
        <FacebookShareButton
          url={String(window.location)}
          quote={'Please check out my trip'}
        >
          <FacebookIcon
            size={32}
            round />
        </FacebookShareButton>
        <TwitterShareButton
          url={String(window.location)}
          title={'Please check out my trip'}
        >
        <TwitterIcon
          size={32}
          round />
        </TwitterShareButton>
        <EmailShareButton
          url={String(window.location)}
          subject={'title'}
          body={`Hello, Please check out my trip ${String(window.location)}`}
        >
          <EmailIcon
            size={32}
            round />
         </EmailShareButton>
      </div>
    )
  }
}
export default SocialShare
