import React, { Component } from 'react';

import {
	Card,
	Button
} from 'react-native-elements';

import {
	View,
	ScrollView,
	StyleSheet,
	Text
} from 'react-native';

import { clearSession, setSession, getSession } from './HelperFunctions.js';


export default class SignUpSuccessScreen extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	
	componentDidMount() {
		clearSession();
	}
	
	render() {
		return(
			<View style={styles.container}>
				<ScrollView>
					<Card title="Welcome to SPT" containerStyle={styles.card}>
						<Text>Your account has successfully been created and it will be activated after verification.</Text>
						<Text>Check Back in later.</Text>

						<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#000000"
			        		title="Log In"
			        		onPress={() => this.props.navigation.navigate("SignIn")}
						/>
					</Card>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 6,
		backgroundColor: '#FF7F00',
	},
	card: {
		marginTop: 30,
		marginBottom: 20
	}
});