import React, { Component } from "react";
import { 
  View,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Text,Image
 } from "react-native";

import {
	Card, 
	Button, 
	FormLabel, 
	FormInput 
} from "react-native-elements";
import AutoHeightImage from 'react-native-auto-height-image';
import { onSignIn } from "../auth";

import { 
  ValidateEmail,
  setSession, getSession, clearSession
} from './HelperFunctions';

import { NavigationActions } from 'react-navigation';
import logoTruck from '../truckAssets/lg.png';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      email: '',
      password: '',
      response: '',
      userID: '',
      userName: '',
      signInButtonDisabled: false,
	  isLoaded: true
    };

    this.signInPressed = this.signInPressed.bind(this);  
    this.setUserDetails = this.setUserDetails.bind(this);
	
	clearSession();
  }
  
  componentWillMount() {

    }

	

  setUserDetails(userID, userName, licenseNumber, commencementDate, licenseExpiry, mobileNumber, email) {
    
    try {
	  setSession("@spt:userid", userID.toString())
	  setSession("@spt:name", userName.toString())
	  setSession("@spt:license_number", licenseNumber.toString())
	  setSession("@spt:commence_date", commencementDate.toString())
	  setSession("@spt:license_expiry", licenseExpiry.toString())
	  setSession("@spt:mobile", mobileNumber.toString())
	  setSession("@spt:email", email.toString())
	  setSession("@spt:address", address.toString())
    } catch(error) {
      
    }
  }
  
  signInPressed() {
	  
       var payload = {
          email: this.state.email,
          password: this.state.password
        };

        var url = api_url+"/login";
		
		if (payload.email=='') {
            alert('Please enter email.');
        }
		else if (!ValidateEmail(payload.email))
		{
		    alert("Please enter valid email.");
		}
		else if(payload.password == '')
		{
			alert('Please enter password.');
		}
        else {
		  this.setState({isLoaded: false});
		  let formData = new FormData();
		  formData.append('email', payload.email);
		  formData.append('password', payload.password);
          fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
			  'Content-Type': 'multipart/form-data'
            },
            body: formData
          }).then(res => res.json())
          .catch(error => console.log('Error: ', error))
          .then(response => {
			resData = response;
			if (resData != null) {
			  if (resData['status'] == 1000) {
				var userID = resData['data']['id']
				var userName = resData['data']['name']
				var licenseNumber = resData['data']['license_number']
				var commencementDate = resData['data']['commence_date']
				var licenseExpiry = resData['data']['license_expiry']
				var mobileNumber = resData['data']['mobile']
				var email = resData['data']['email']
				var address = resData['data']['address']
				
				this.setUserDetails(userID, userName, licenseNumber, commencementDate, licenseExpiry, mobileNumber, email, address);
				
				this.props.navigation.navigate("SignedIn");
			  }
			  else{
				alert(resData['message']);
			  }
			} else {
			  alert("An error occured while signing in");
			}
			
			this.setState({isLoaded: true});
          });
        }
  }

  render() {
    var { navigation } = this.props.navigation;

    return(
      <View style={styles.container} >
		   <View style={styles.ximage}>
		  
		  <AutoHeightImage
                    width={280}
                    source={logoTruck}
                />
			  
		  </View>
        <Card
          title="Sign In" 
          containerStyle={styles.signInCard}>
		  
          <FormLabel>Email</FormLabel>
          <FormInput 
            onChangeText={(text) => this.setState({ email: text})}
			      autoCapitalize = 'none'
            placeholder="Email address" />

          <FormLabel>Password</FormLabel>
          <FormInput
            onChangeText={(text) => this.setState({ password: text})} 
            secureTextEntry placeholder="Password" />

          <Button
            disabled={this.state.signInButtonDisabled}
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#000000"
            title="SIGN IN"
            onPress={this.signInPressed}
          />
		  
          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#FF7F00"
            title="Forgot Password ?"
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
          />
		  
          <Button
            buttonStyle={{ marginTop: 10, opacity: 50 }}
            backgroundColor="#FF7F00"
            title="Sign Up"
            onPress={() => this.props.navigation.navigate("SignUp")}
          />
		  {
			!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
				: null
		  }
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
	  alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FF7F00',
    flex: 1
  },
  ximage: {
    flexGrow:1,
    alignItems: 'center',
    justifyContent:'center',
    height :10,

    marginTop: -110,
	paddingTop: 0,
	paddingBottom: 0
  },
  
  loader: {
	position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
	  backgroundColor:'rgba(0,0,0,.6)',
    justifyContent: 'center'
  },
  signInCard: {
    marginTop: -50,
	paddingTop: 0,
	paddingBottom: 0
	 // alignItems: 'stretch',
   // justifyContent: 'center',
  }
});