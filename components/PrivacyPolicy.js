import React, { Component } from 'react';

import {
	View,
	ScrollView,
	Text,
	StyleSheet,
	WebView,
	ActivityIndicator
} from 'react-native';

import {
	Card
} from 'react-native-elements';

export default class PrivacyPolicy extends Component {
	constructor(props) {
	  super(props);
	
		this.state = {
	  	id: 2,
		pageTitle:'',
		pageDescription: '',
		isLoaded: false,
	  };
	}
	
	
	componentWillMount() {
		var url = api_url+"/content";
		let formData = new FormData();
		formData.append('type', this.state.id);
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
				this.setState({ isLoaded: true, pageDescription: resData['data'][0]['description'] });
			}
			else{
				alert("An error occured while processing your request. Please try again later.");
				this.setState({ isLoaded: true})
			}
		});
	}
	
	render() {
		if (!this.state.isLoaded) {
			return (
				<View style={styles.loader}>
					<ActivityIndicator size="large"/>
				</View>
			)
		} else {
			return(
				<WebView
					html={this.state.pageDescription}
					style={styles.container}
				  />
			);
		}
		
	}
}

const styles = StyleSheet.create({
	loader: {
		flex: 6,
		justifyContent: 'center'
	},
	container: {
		flex: 6,
		justifyContent: 'center',
	},
	card: {
		

	}
});