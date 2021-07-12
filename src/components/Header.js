import React from 'react';
import '../styles/Header.css';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import "react-responsive-modal/styles.css";
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { withRouter } from 'react-router';

//styles for modal
const styles = {
  fontFamily: "Poppins",
  textAlign: "center",
 
  content:{
    backgroundColor:"#ffffff",
    padding: "55px 67px 111.4px 85.9px"
    }
};

class Header extends React.Component {
     // state for moodal
  state = {
    open: false,
  };
  constructor() {
    super();
    this.state = {
      userName : undefined,
      isLoggedIn: false,
      name:undefined,
      email:undefined,
      password:undefined,
      users:[],
      loginStatus:[]
    }
  }

  // onclick function to open modal
  onOpenModal = () => {
    this.setState({ open: true });
  };
 
  // onclick function to close modal
  onCloseModal = () => {
    this.setState({ open: false });
  };
  //for google response
  responseGoogle = (response) => {
    console.log(response);
    this.setState({userName:response.profileObj.name, isLoggedIn:true,open: false}) //profileObj is the key you get in console after logging in with the registered google acc
    
  };
  
  // for handle logout
  handleLogOut = () => {
    this.setState ({isLoggedIn:false, userName:undefined});
  }
//for facebook response
 responseFacebook = (response) => {
  console.log(response);
  this.setState({userName:response.name, isLoggedIn:true,open: false}) //name is what we get after logging in facebook
}

//to handle click on logo
handleNavigate = () => {
  this.props.history.push('/'); //"/"will take user to homepage
}
//onclick createanacc fn to open formmodal
onCreateAccOpenModal = () => {
  this.setState({ createAcc: true });
}
//onclick createanacc fn to close formmodal
onCreateAccCloseModal = () => {
  this.setState({ createAcc: false });
}

//to capture name,email,password as user enters it so that it can be paassed to singup function
handleChange = (event,state) => {
  this.setState({ [state]:event.target.value});

 
}
 
//to call the singup api and pass name,email,password
signup = () => {
  const{name,email,password} = this.state;
  const inputObj = {
    //in singup api we expect name,email,password
     name:name,
     email:email,
     password:password
  };
  axios({
    method: 'POST',
    url: 'http://localhost:2022/SignUp',
    headers : {'Content-Type':'application/json'},
    //to pass the data to request body we have 'data'
    data: inputObj
}).then(response => this.setState({ users:response.data.Users
   })).catch(err => console.log(err));


}

//to call the login api and pass name,email,password
login = () => {
  const{name,email,password,loginStatus} = this.state;
  const inputObj = {
    //in login api we expect name,email,password
      name:name,
      email:email,
      password:password
  };
  axios({
    method: 'POST',
    url: 'http://localhost:2022/login',
    headers : {'Content-Type':'application/json'},
    //to pass the data to request body we have 'data'
    data: inputObj
}).then(response => this.setState({ loginStatus:response.data.LoginUser,userName:name,isLoggedIn:true})).catch(err => console.log(err));

this.setState({userName:loginStatus.name})
}

//to open a login modal onclick login with credentials
openLoginModal = () => {
  this.setState({ openLogin: true });
}
//to close a login modal onclick login with credentials
closeLoginModal = () => {
  this.setState({ openLogin: false });
}


    render() {
        const {open,userName, isLoggedIn, createAcc,openLogin} = this.state;
        return (
            <div>
                <div className="app-header">
                    <div class="logo-header" style={{display:"inline-block"}} onClick={this.handleNavigate}>
                        e!
                    </div>
                    {isLoggedIn ? <div  style={{float:"right"}}>
                    <div class="username" style={{display:"inline-block"}}>
                        {`hi! ${userName}`}
                    </div>
                    <div class="logout" style={{display:"inline-block"}} onClick={this.handleLogOut}>
                        Log Out
                    </div>
                </div>: <div  style={{float:"right"}}>
                <div class="login" style={{display:"inline-block"}} onClick={this.onOpenModal}>
                    Login
                </div>
                <div class="create-an-account" style={{display:"inline-block"}} onClick={this.onCreateAccOpenModal}>
                    Create an account
                </div>
            </div>}
                    
                    
                </div>
                <Modal open={open} onClose={this.onCloseModal}  style ={styles} center>
                      <div className="login-g-fb-popup">
                          <div class ="login-google-facebook">Login</div>
                          <GoogleLogin
                              clientId="1006418862786-ogj1vruqe5anmes1cotn9m7ib708j99u.apps.googleusercontent.com"
                              buttonText="Continue with Gmail"
                              onSuccess={this.responseGoogle}
                              onFailure={this.responseGoogle}
                              cookiePolicy={'single_host_origin'}
                          />
                      </div>
                      <div className="login-g-fb-popup">
                          <FacebookLogin
                          appId="301462378199231"
                          textButton="Continue with Facebook"
                          fields="name,email,picture"
                          callback={this.responseFacebook} 
                      />
                      <div>
                          <button className="login-w-cred mt-3"  onClick={() => { {this.openLoginModal()}; {this.onCloseModal()} }}>Login with credentials</button>

                      </div>
                  </div>

                </Modal>
                <Modal open={createAcc} onClose={this.onCreateAccCloseModal}  style ={styles} center>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                    <label className="head">Name:</label><br></br>
                    <input className="value"type='text' placeholder="Enter First Name" 
                    required  onChange={(event)=> this.handleChange(event,'name')}></input>  
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                    <label className="head">Email:</label><br></br>
                    <input className="value"type='text' placeholder="Enter Email address" 
                    required onChange={(event)=> this.handleChange(event,'email')}></input>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                    <label className="head">Password:</label><br></br>
                    <input className="value"type='password' placeholder="Enter Password" 
                    required onChange={(event)=> this.handleChange(event,'password')}></input>
                </div>
                <div  className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <button id="placeorder" style={{float:'none'}} onClick={() => { {this.signup()}; {this.onCreateAccCloseModal()} }}>Sign up</button>
                </div>
                </Modal>
                <Modal open={openLogin} onClose={this.closeLoginModal}  style ={styles} center>
                      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                        <label className="head">Name:</label><br></br>
                        <input className="value"type='text' placeholder="Enter First Name" 
                        required  onChange={(event)=> this.handleChange(event,'name')}></input>  
                      </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                      <label className="head">Email:</label><br></br>
                      <input className="value"type='text' placeholder="Enter Email address" 
                      required onChange={(event)=> this.handleChange(event,'email')}></input>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                      <label className="head">Password:</label><br></br>
                      <input className="value"type='password' placeholder="Enter Password" 
                      required onChange={(event)=> this.handleChange(event,'password')}></input>
                    </div>
                    <div  className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <button id="placeorder" style={{float:'none'}} onClick={() => { {this.login()}; {this.closeLoginModal()} }}>Log in</button>
                </div>
                </Modal>
            </div>
        )
    }
}
export default withRouter(Header);