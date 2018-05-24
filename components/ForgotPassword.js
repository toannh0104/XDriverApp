import React, { Component } from 'react';

import {
	View,
	ScrollView,
	ActivityIndicator
} from 'react-native';

import { StyleSheet } from 'react-native';

import {
	Card,
	Button,
	FormInput,
	FormLabel
} from 'react-native-elements';

import { onSignIn } from '../auth';

import {
	ValidateEmail
} from './HelperFunctions';

export default class SignUp extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	email: '',
		isLoaded: true
	  };

	  this.onResetPasswordPress = this.onResetPasswordPress.bind(this);
	}

	onResetPasswordPress() {
		var url = api_url+"/forgotpassword";

	  	var payload = {
	  		email: this.state.email
	  	}

	  	if (payload.email=='') {
            alert('Please enter email.');
        }
		else if (!ValidateEmail(payload.email))
		{
		    alert("Please enter valid email.");
		}
	  	else {
		  let formData = new FormData();
		  formData.append('email', payload.email);
		  this.setState({isLoaded: false});
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
			  		var resData = response;
					if (resData != null) {
						alert(resData['message']);
						if (resData['status'] == 1000) {
                            this.props.navigation.navigate("SignIn");
                        }
						
					} else {
						alert("Please try again later");
					}
					
					this.setState({isLoaded: true});
			  	});
	  	}

	  	
	  	
	}

	render() {
		var { navigation } = this.props.navigation;
		return(
			<View style={styles.container}>
				<Card 
					title="Forgot Password"
					containerStyle={styles.forgotPasswordCard}>
		      		<FormLabel>Email</FormLabel>
		      		<FormInput 
		      			onChangeText={(text) => this.setState({ email: text })}
		      			placeholder="Email address"
						autoCapitalize = 'none'
		      			value={this.state.email}
		      		/>

					<Button
		        		buttonStyle={{ marginTop: 20 }}
		        		backgroundColor="#000000"
		        		title="Submit"
		        		onPress={this.onResetPasswordPress}
					/>
					<Button
						buttonStyle={{ marginTop: 20 }}
		        		backgroundColor="#FF7F00"
		        		title="Sign In"
						onPress={() => this.props.navigation.navigate("SignIn")}
					/>
					{
						!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
							: null
					  }
				</Card>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FF7F00',
		flex: 6
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
	forgotPasswordCard: {
		marginTop: 30
	}
});