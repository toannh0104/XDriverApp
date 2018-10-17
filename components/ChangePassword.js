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
	MatchPasswords,
	ValidateMobileNumber
} from './HelperFunctions';

import {
	Card,
	Button,
	FormInput,
	FormLabel
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';

export default class ChangePassword extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	password: '',
	  	confirmPassword: '',
		current_password:'',
		id: '',
		isLoaded: false
	  };
	  
	  this.onSubmitChangesPressed = this.onSubmitChangesPressed.bind(this);
	}

	componentWillMount() {
		getSession("@spt:userid").then((value) => {
			this.setState({id: value, isLoaded: true});
		});
		
	}

	componentDidMount() {
		
	}

	onSubmitChangesPressed() {
		var payload = {
			password: this.state.password,
			current_password: this.state.current_password,
			confirm_password : this.state.confirmPassword,
			id: this.state.id
		}

		var url = api_url+"/updatepassword/";
		if(payload.current_password == '')
		{
			alert('Please enter current password.');
		}
		else if(payload.password == '')
		{
			alert('Please enter new password.');
		}
		else if(payload.confirm_password == '')
		{
			alert('Please confirm password.');
		}
		else if (!MatchPasswords(payload.password, payload.confirm_password)) {
            alert('New password and confirm password should match.');
        }
		else{
			let formData = new FormData()
			this.setState({isLoaded: false})
			
			formData.append('user_id', payload.id)
			formData.append('password', payload.current_password)
			formData.append('new_password', payload.password)
			
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
				console.log(resData);
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
					<Card title="Change Password" containerStyle={styles.card}>
						<FormLabel style={styles.formLabelStyle}>Current Password</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ current_password: text })}
			      			secureTextEntry placeholder="Current Password" 
			      			value={this.state.current_password}
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