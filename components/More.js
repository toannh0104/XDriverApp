import React, { Component } from 'react';

import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';

import {
	Button,
	Card
} from 'react-native-elements';

import {
	GetItemFromAsyncStorage
} from './HelperFunctions';

import { onSignOut } from "../auth";

export default class More extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	mobile: '',
	  	license_number: '',
	  	license_expiry: '',
	  	name: '',
	  	email: ''
	  };

	  this.onEditProfilePress = this.onEditProfilePress.bind(this);

	  this.onSignoutPress = this.onSignoutPress.bind(this);
	}

	onEditProfilePress() {
		this.props.navigation.navigate("EditProfile");
	}

	onSignoutPress() {
		onSignOut();

		AsyncStorage.removeItem("id");
    	AsyncStorage.removeItem("name");

    	this.props.navigation.navigate("SignedOut")
	}

	componentWillMount() {
		AsyncStorage.getItem("mobile").then((value) => {
        	this.setState({"mobile": value});
		});

		AsyncStorage.getItem("license_number").then((value) => {
        	this.setState({"license_number": value});
		});

		AsyncStorage.getItem("license_expiry").then((value) => {
        	this.setState({"license_expiry": value});
		});

		AsyncStorage.getItem("name").then((value) => {
        	this.setState({"name": value});
		});

		AsyncStorage.getItem("email").then((value) => {
        	this.setState({"email": value});
		});
	}

	componentDidMount() {
		console.log(this.state.mobile);
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView>
					<Card title="User Details" containerStyle={styles.infoCard}>
						<Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}>Welcome, {this.state.name}</Text>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={styles.userDetailLine}>Mobile Number: </Text>
							<Text style={{ fontWeight: 'bold'}}>{this.state.mobile}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={styles.userDetailLine}>License Number: </Text>							
							<Text style={{ fontWeight: 'bold'}}>{this.state.license_number}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={styles.userDetailLine}>License Expiry: </Text>	
							<Text style={{ fontWeight: 'bold'}}>{this.state.license_expiry}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={styles.userDetailLine}>Email: </Text>
							<Text style={{ fontWeight: 'bold'}}>{this.state.email}</Text>	
						</View>

						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
							<TouchableOpacity onPress={this.onEditProfilePress} style={styles.editProfileButton}>
								<Text style={{ color: 'white' }}>Edit Profile</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={this.onSignoutPress} style={styles.editProfileButton}>
								<Text style={{ color: 'white' }}>Sign Out</Text>
							</TouchableOpacity>
						</View>
					</Card>

					<Card title="Information" containerStyle={styles.card}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate("TermsOfUse")} style={styles.additionalInfoButtons}>
							<Text style={{ fontSize: 16, color: '#FF7F00' }}>Terms Of Use</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => this.props.navigation.navigate("PrivacyPolicy")} style={styles.additionalInfoButtons}>
							<Text style={{ fontSize: 16, color: '#FF7F00' }}>Privacy Policy</Text>
						</TouchableOpacity>
					</Card>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 6,
		backgroundColor: '#FF7F00'
	},
	infoCard: {
		marginTop: 20
	},
	card: {
		marginTop: 20,
		marginBottom: 30
	},
	editProfileButton: {
		marginTop: 10,
		alignItems: 'center',
		backgroundColor: '#FF7F00',
		padding: 10,
		width: 150
	},
	userDetailLine: {
		marginBottom: 5
	},
	additionalInfoButtons: {
		marginBottom: 10,
	}
});