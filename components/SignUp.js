import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
	View,
	ScrollView,
	ActivityIndicator,
	Text,Image
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import { 
	StyleSheet,
	AsyncStorage
} from 'react-native';

import {
	Card,
	Button,
	FormInput,
	FormLabel
} from 'react-native-elements';

import { onSignIn } from '../auth';

import { 
	ValidateEmail,
	MatchPasswords,
	clearSession, setSession, getSession,
	ValidateMobileNumber
} from './HelperFunctions';

import DatePicker from 'react-native-datepicker';
import logoTruck from '../truckAssets/lg.png';

export default class SignUp extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	name: '',
	  	email: '',
	  	password: '',
	  	confirmPassword: '',
	  	mobileNumber: '',
	  	address: '',
	  	licenseNumber: '',
	  	licenseExpiry: 'select date',
	  	commencementDate: 'select date',
	  	documents: '',
	  	response: '',
		isLoaded: true
	  };

	  this.onSignUpPress = this.onSignUpPress.bind(this);
	}
	componentDidMount() {
		// this.getAsyncValues()
	}

	onSignUpPress() {
		var payload = {
			name: this.state.name,
		  	email: this.state.email,
		  	password: this.state.password,
			confirm_password : this.state.confirmPassword,
		  	mobile: this.state.mobileNumber,
		  	address: this.state.address,
		  	license_number: this.state.licenseNumber,
		  	license_expiry: this.state.licenseExpiry,
		  	commence_date: this.state.commencementDate
		}

		var url = api_url+"/register/";
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
		else if(payload.confirm_password == '')
		{
			alert('Please confirm password.');
		}
		else if (!MatchPasswords(payload.password, payload.confirm_password)) {
            alert('Password and confirm password should match.');
        }
		else if(payload.mobile == '')
		{
			alert('Please enter mobile number.');
		}
		else if(!ValidateMobileNumber(payload.mobile))
		{
			alert('Please enter valid mobile number.');
		}
		else if(payload.address == '')
		{
			alert('Please enter address.');
		}
		else if(payload.license_number == '')
		{
			alert('Please enter license number.');
		}
		else if(payload.license_expiry == '')
		{
			alert('Please enter license expiry.');
		}
		else if(payload.commence_date == '')
		{
			alert('Please enter commence date.');
		}
		else{
			this.setState({isLoaded: false});
			let formData = new FormData();
			formData.append('name', payload.name);
			formData.append('email', payload.email);
			formData.append('password', payload.password);
			formData.append('mobile', payload.mobile);
			formData.append('address', payload.address);
			formData.append('license_number', payload.license_number);
			formData.append('license_expiry', payload.license_expiry);
			formData.append('commence_date', payload.commence_date);
			
			fetch(url, {
	  		method: 'POST',
	  		headers: {
              'Accept': 'application/json',
			  'Content-Type': 'multipart/form-data'
            },
	  		body: formData
		  	}).then(res => res.json())
		  	.catch(error => {console.log('Error: ', error)})
		  	.then(response => {
		  		var resData = response;
				if (resData != null) {
					alert(resData['message']);
					if (resData['status'] == 1000) {
						var userID = resData['data']['id'];
						setSession("@spt:signupid", userID)
						this.props.navigation.navigate("FileUploadAfterSignUp");
					}
				}
				else{
					alert("An error occured while signing up. Please try again later.");
				}
				
				this.setState({isLoaded: true});
		  	});
		}

		// console.log(this.state.documents[1]) 
	}

	render() {
		var { navigation } = this.props.navigation;
		return(
			<ScrollView>
				<View style={styles.container}>
				
				<View style={styles.ximage}>
          <AutoHeightImage
                    width={250}
                    source={logoTruck}
                />	
		  </View>
		  
					<Card 
						title="Sign Up"
						containerStyle={styles.signUpCard}>
						<FormLabel style={styles.formLabelStyle}>Name</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ name: text })}
			      			placeholder="Name"
			      			value={this.state.name}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Email</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ email: text })}
			      			placeholder="Email Address"
							autoCapitalize = 'none'
			      			value={this.state.email}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Create Password</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ password: text })}
			      			secureTextEntry placeholder="Password" 
			      			value={this.state.password}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Confirm Password</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ confirmPassword: text })}
			      			secureTextEntry placeholder="Confirm Password" 
			      			value={this.state.confirmPassword}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Mobile</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ mobileNumber: text })}
			      			placeholder="Mobile Number"
			      			keyboardType="numeric"
			      			value={this.state.mobileNumber} 
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Address</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ address: text })}
			      			placeholder="Address"
			      			value={this.state.address} 
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>License</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ licenseNumber: text })}
			      			placeholder="License Number" 
			      			value={this.state.licenseNumber}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>License Expiry</FormLabel>
			      		<DatePicker
					        style={{width: "100%"}}
					        date={this.state.date}
					        mode="date"
					        placeholder={this.state.licenseExpiry}
					        format="DD-MM-YYYY"
					        minDate={new Date()}
					        confirmBtnText="Confirm"
					        cancelBtnText="Cancel"
					        customStyles={{
					          dateIcon: {
					            height: 0,
					            width: 0
					          },
					          dateInput: {
					          	height: 40,
					          	marginLeft: 20,
								textAlignVertical: 'top',
					          	borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderTopWidth: 0,
					          }
					        }}
					        onDateChange={(date) => {this.setState({licenseExpiry: date})}}
					      />
	
			      		<FormLabel style={styles.formLabelStyle}>Commencement date</FormLabel>
			      		<DatePicker
					        style={{width: "100%"}}
					        date={this.state.date}
					        mode="date"
					        placeholder={this.state.commencementDate}
					        format="DD-MM-YYYY"
					        minDate={new Date()}
					        confirmBtnText="Confirm"
					        cancelBtnText="Cancel"
					        customStyles={{
					          dateIcon: {
					            height: 0,
					            width: 0
					          },
					          dateInput: {
					          	height: 40,
					          	marginLeft: 20,
					          	borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderTopWidth: 0,
					          }
					        }}
					        onDateChange={(date) => {this.setState({commencementDate: date})}}
					      />

						<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#000000"
			        		title="SIGN UP"
			        		onPress={this.onSignUpPress}
						/>
						<Button
							buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="SIGN IN"
							onPress={() => this.props.navigation.navigate("SignIn")}
						/>
						{
							!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
								: null
						  }
					</Card>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FF7F00',		
	},
	signUpCard: {
		marginTop: 0,
		zIndex: 1
	},
	  ximage: {
		  zIndex:5,
    flexGrow:2,
    alignItems: 'center',
    justifyContent:'center',height:100
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
	formLabelStyle: {
		marginBottom: 0
	},
	dateStyle: {

	}
});