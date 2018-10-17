import React, { Component } from 'react';

import {
	View,
	Text,
	StyleSheet
} from 'react-native';

export default class MainComponent extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};

	  this.getLoginResponse = this.getLoginResponse.bind(this);
	}

	getLoginResponse() {
		var url = "http://spt.metapixer.com/mobile/forgotpassword/";
	  	var data = { email: 'gauravsingh.re@gmail.com' }

	  	fetch(url, {
	  		method: 'POST',
	  		body: JSON.stringify(data),
	  		headers: new Headers({
	  			'Content-Type': 'application/json'
	  		})
	  	}).then(res => res.json())
	  	.catch(error => console.log('Error: ', error))
	  	.then(response => console.log('Success: ', response));
	  }

	  componentDidMount() {
	  	console.log(this.getLoginResponse());
	  }

	render() {
		return(
			<View style={styles.container}>
				<Text>Welcome to Main Component son!</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});