import React, { Component } from 'react';

import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Image,
	AsyncStorage
} from 'react-native';

import {
	Card,
	FormLabel,
	FormInput,
	Button
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';

import defaultTruck from '../truckAssets/default_truck.jpg';

var ImagePicker = require('react-native-image-picker'); 

export default class MaintainenceRecord extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	registrationDocuments: [],
	  	insuranceDocuments: [],
	  	fifthWheelDocuments: [],
	  	hundredSpeedDocuments: [],
	  	parkBrakeAlarmDocuments: [],
	  	lastServiceDocuments: [],
	  	lastServiceKM: '',
	  	lastServiceDate: 'select date',
	  	steerTyreChangeKM: '',
	  	driveTyreChangeKM: '',
	  	steerTyreDocuments: [],
	  	driveTyreDocuments: [],
	  	otherWork: '',
	  	otherWorkDocuments: [],
	  	myDate: 'select date',
	  	driverName: '',
	  	registrationExpiryDate: 'select date',
	  	insuranceExpiryDate: 'select date',
	  	fifthWheelExpiryDate: 'select date',
	  	hundredSpeedExpiryDate: 'select date',
	  	parkBrakeAlarmExpiryDate: 'select date'
	  };

	  this.onUploadRegistrationPress = this.onUploadRegistrationPress.bind(this);
	  this.onUploadInsuranceDocumentsPress = this. onUploadInsuranceDocumentsPress.bind(this);
	  this.onfifthWheelDocumentsUploadPress = this.onfifthWheelDocumentsUploadPress.bind(this);
	  this.on100SpeedDocumentsUploadPress = this.on100SpeedDocumentsUploadPress.bind(this);

	  this.onParkBrakeAlarmDocumentsUploadPress = this.onParkBrakeAlarmDocumentsUploadPress.bind(this);
	  this.onLastServiceDocumentsPress = this.onLastServiceDocumentsPress.bind(this);
	  this.onSteerTyreChangePress = this.onSteerTyreChangePress.bind(this);
	  this.onDriveTyreChangePress = this.onDriveTyreChangePress.bind(this);
	  this.onOtherWorkDocumentsPress = this.onOtherWorkDocumentsPress.bind(this);
	}

	componentWillMount() {
		AsyncStorage.getItem("name").then((value) => {
        	this.setState({"driverName": value});
    	});
	}

	onUploadRegistrationPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ registrationDocuments: images });
		});
	}

	onUploadInsuranceDocumentsPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ insuranceDocuments: images });
		});	
	}

	onfifthWheelDocumentsUploadPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ fifthWheelDocuments: images });
		});	
	}

	on100SpeedDocumentsUploadPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ hundredSpeedDocuments: images });
		});	
	}

	onParkBrakeAlarmDocumentsUploadPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ parkBrakeAlarmDocuments: images });
		});	
	}

	onLastServiceDocumentsPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ lastServiceDocuments: images });
		});	
	}

	onSteerTyreChangePress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ steerTyreDocuments: images });
		});	
	}

	onDriveTyreChangePress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ driveTyreDocuments: images });
		});	
	}

	onOtherWorkDocumentsPress() {
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  this.setState({ otherWorkDocuments: images });
		});	
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView>
					<Card title="Truck Info">
						<View style={{flex: 1, flexDirection: 'row'}}>
							<View>
								<Image
									source={defaultTruck}
									style={{ width: 80, height: 70 }}
								/>
							</View>

							<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ marginLeft: 20, fontSize: 16 }}>Name: </Text>
									<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Volvo</Text>
								</View>

								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ marginLeft: 20, fontSize: 16 }}>Number: </Text>
									<Text style={{ fontSize: 16, fontWeight: 'bold' }}>346346244</Text>
								</View>

								<View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
									<Text style={{ marginLeft: 20, fontSize: 16 }}>Driver Name: </Text>
									<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.driverName}</Text>
								</View>

								<View style={{ flex: 1, flexDirection: 'row' }}>
									<DatePicker
								        style={{width: 200}}
								        date={this.state.date}
								        mode="date"
								        placeholder={this.state.myDate}
								        format="DD-MM-YYYY"
								        minDate="01-04-2017"
					        			maxDate="01-12-2030"
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
								        onDateChange={(date) => {this.setState({date: date})}}
								      />
								</View>
								
							</View>

							
						</View>
					</Card>

					<Card title="Registration">
						<FormLabel style={styles.formLabelStyle}>Expiry Date: </FormLabel>
			      		<DatePicker
					        style={{width: 200}}
					        
					        mode="date"
					        placeholder={this.state.registrationExpiryDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2018"
					        maxDate="01-12-2030"
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
					        onDateChange={(date) => {this.setState({registrationExpiryDate: date})}}
					      />
						
						
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onUploadRegistrationPress}
						/>

					</Card>

					<Card title="Insurance">
						<FormLabel style={styles.formLabelStyle}>Expiry Date: </FormLabel>
			      		<DatePicker
					        style={{width: 200}}
					        
					        mode="date"
					        placeholder={this.state.insuranceExpiryDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2018"
					        maxDate="01-12-2030"
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
					        onDateChange={(date) => {this.setState({insuranceExpiryDate: date})}}
					      />
						
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onUploadInsuranceDocumentsPress}
						/>

					</Card>

					<Card title="Fifth Wheel">
						<FormLabel style={styles.formLabelStyle}>Expiry Date: </FormLabel>
			      		<DatePicker
					        style={{width: 200}}
					        
					        mode="date"
					        placeholder={this.state.fifthWheelExpiryDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2018"
					        maxDate="01-12-2030"
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
					        onDateChange={(date) => {this.setState({fifthWheelExpiryDate: date})}}
					      />
						
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onfifthWheelDocumentsUploadPress}
						/>

					</Card>

					<Card title="100 Speed">
						<FormLabel style={styles.formLabelStyle}>Expiry Date: </FormLabel>
			      		<DatePicker
					        style={{width: 200}}
					        
					        mode="date"
					        placeholder={this.state.hundredSpeedExpiryDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2018"
					        maxDate="01-12-2030"
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
					        onDateChange={(date) => {this.setState({hundredSpeedExpiryDate: date})}}
					      />

			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.on100SpeedDocumentsUploadPress}
						/>

					</Card>

					<Card title="Park Brake Alarm Implements">
						<FormLabel style={styles.formLabelStyle}>Expiry Date: </FormLabel>
			      		<DatePicker
					        style={{width: 200}}
					        
					        mode="date"
					        placeholder={this.state.parkBrakeAlarmExpiryDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2018"
					        maxDate="01-12-2030"
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
					        onDateChange={(date) => {this.setState({parkBrakeAlarmExpiryDate: date})}}
					      />
						
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onParkBrakeAlarmDocumentsUploadPress}
						/>

					</Card>

					<Card title="Last Service KM">
						<FormLabel style={styles.formLabelStyle}>Last Service Date</FormLabel>
			      		<DatePicker
					        style={{width: 200}}
					        date={this.state.date}
					        mode="date"
					        placeholder={this.state.lastServiceDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2018"
					        maxDate="01-12-2030"
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
					        onDateChange={(date) => {this.setState({lastServiceDate: date})}}
					      />

						<FormLabel style={styles.formLabelStyle}>Enter distance(km): </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ lastServiceKM: text })}
			      			placeholder="distance"
			      			keyboardType="numeric"
			      			value={this.state.lastServiceKM} 
			      		/>

			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onLastServiceDocumentsPress}
						/>

					</Card>

					<Card title="Steer Tyre Change KM">

						<FormLabel style={styles.formLabelStyle}>Enter distance(km): </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ steerTyreChangeKM: text })}
			      			placeholder="distance"
			      			keyboardType="numeric"
			      			value={this.state.steerTyreChangeKM} 
			      		/>
						
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onSteerTyreChangePress}
						/>

					</Card>

					<Card title="Drive Tyre Change KM">

						<FormLabel style={styles.formLabelStyle}>Enter distance(km): </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ driveTyreChangeKM: text })}
			      			placeholder="distance"
			      			keyboardType="numeric"
			      			value={this.state.driveTyreChangeKM} 
			      		/>
						
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onDriveTyreChangePress}
						/>

					</Card>

					<Card title="Other Work">
						
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ otherWork: text })}
			      			placeholder="additional work if any" 
			      			value={this.state.email}
			      		/>

			      		
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onOtherWorkDocumentsPress}
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
		backgroundColor: '#FF7F00'
	},
	informationCard: {
		marginTop: 30
	},
	infoCard: {
		marginTop: 20
	},
});