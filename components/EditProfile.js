import React, { Component } from 'react';

import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	ActivityIndicator,
	AsyncStorage
} from 'react-native';

import { 
	ValidateEmail,
	clearSession, setSession, getSession,
	ValidateMobileNumber
} from './HelperFunctions';

import {
	Card,
	Button,
	FormInput,
	FormLabel
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';

export default class EditProfile extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	oldName: '',
	  	oldEmail: '',
	  	oldMobile: '',
	  	oldLicenseExpiry: '',
	  	oldLicenseNumber: '',
	  	oldCommencementDate: '',
	  	oldAddress: '',
	  	name: '',
	  	email: '',
	  	mobile: '',
		id: '',
	  	licenseExpiry: '',
	  	licenseNumber: '',
	  	commencementDate: '',
	  	address: '',
		isLoaded: false
	  };
	  
	  this.onSubmitChangesPressed = this.onSubmitChangesPressed.bind(this);
	}

	componentWillMount() {
		getSession("@spt:mobile").then((value) => {
			this.setState({oldMobile: value, mobile: value});
		});
		getSession("@spt:userid").then((value) => {
			this.setState({id: value});
		});
		getSession("@spt:address").then((value) => {
			this.setState({oldAddress: value, address: value});
		});
		
		getSession("@spt:license_expiry").then((value) => {
			this.setState({oldLicenseExpiry: value, licenseExpiry: value });
		});
		getSession("@spt:commence_date").then((value) => {
			this.setState({oldCommencementDate: value, commencementDate : value});
		});
		getSession("@spt:name").then((value) => {
			this.setState({oldName: value, name : value});
		});
		
		getSession("@spt:email").then((value) => {
			this.setState({oldEmail: value, email : value});
		});
		
		getSession("@spt:license_number").then((value) => {
			this.setState({oldLicenseNumber: value, licenseNumber : value, isLoaded: true});
		});
	}

	componentDidMount() {
		
	}

	onSubmitChangesPressed() {
		var payload = {
			name: this.state.name,
			id: this.state.id,
		  	email: this.state.email,
		  	mobile: this.state.mobile,
		  	address: this.state.address,
		  	license_number: this.state.licenseNumber,
		  	license_expiry: this.state.licenseExpiry,
		  	commence_date: this.state.commencementDate
		}

		var url = api_url+"/profile/";
		if (payload.email=='') {
            alert('Please enter email.');
        }
		else if (!ValidateEmail(payload.email))
		{
		    alert("Please enter valid email.");
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
			let formData = new FormData();
			this.setState({isLoaded: false});
			
			formData.append('user_id', payload.id);
			formData.append('name', payload.name);
			formData.append('email', payload.email);
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
				}
				else{
					alert("An error occured while processing your request. Please try again later.");
				}
				
				this.setState({isLoaded: true});
		  	});
		}
	}

	render() {
		return(
			<View style={styles.container}>
			{
				!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
				: 
			
				<ScrollView>
					<Card title="Edit Profile" containerStyle={styles.card}>
						<FormLabel style={styles.formLabelStyle}>Name</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ name: text })}
			      			placeholder={this.state.oldName}
			      			value={this.state.name}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Email</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ email: text })}
			      			placeholder={this.state.oldEmail} 
			      			value={this.state.email}
							autoCapitalize = 'none'
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Mobile</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ mobile: text })}
			      			placeholder={this.state.oldMobile}
			      			keyboardType="numeric"
			      			value={this.state.mobile}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Address</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ address: text })}
			      			placeholder={this.state.oldAddress}
			      			value={this.state.address} 
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>License Number</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ licenseNumber: text })}
			      			placeholder={this.state.oldLicenseNumber} 
			      			value={this.state.licenseNumber}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>License Expiry</FormLabel>
			      		<DatePicker
					        style={{width: "100%"}}
					        date={this.state.date}
					        mode="date"
					        placeholder={this.state.oldLicenseExpiry}
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
					        onDateChange={(date) => {this.setState({licenseExpiry: date})}}
					      />
	
			      		<FormLabel style={styles.formLabelStyle}>Commencement date</FormLabel>
			      		<DatePicker
					        style={{width: "100%"}}
					        date={this.state.date}
					        mode="date"
					        placeholder={this.state.oldCommencementDate}
					        format="DD-MM-YYYY"
					        maxDate={new Date()}
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
								textColor: "black"
					          }
					        }}
					        onDateChange={(date) => {this.setState({commencementDate: date})}}
					      />

					      <Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#000000"
			        		title="Submit Changes"
			        		onPress={this.onSubmitChangesPressed}
						/>
					
					</Card>
				</ScrollView>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 6,
		//backgroundColor: '#FF7F00'
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
	},
	card: {
		marginTop: 30,
		marginBottom: 20
	}
});