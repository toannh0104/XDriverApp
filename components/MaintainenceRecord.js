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
import { setSession, getSession} from './HelperFunctions';

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
			parkBrakeAlarmExpiryDate: 'select date',
			truckid:'',
			truckname:'',
			truckmodel:'',
			truckimage:'',
			userId: '',
			logId:''
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
		//this.loadLogId = this.loadLogId.bind(this);
		this.doPost = this.doPost.bind(this);
	}

	componentWillMount() {
		console.log("param navigation");
		let userId = this.props.navigation.state.params.userId;
		let truckId = this.props.navigation.state.params.truckId;

		var url = api_url+"/maintenance";
		let formData = new FormData();
		var cDate = new Date();
		formData.append('user_id', userId);
		formData.append('truck_id', truckId);
		formData.append('log_date', cDate.getDate() +"-" +(cDate.getMonth() + 1) +"-" +cDate.getFullYear());
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
				if (resData != null && resData.status == 1000) {
					this.state.logId = resData.data;
				}
				else{
					alert(resData['message']);
				}
		});	
		getSession("@spt:userid").then((value) => {
			this.setState({"userid": value});
		});
		
		getSession("@spt:truckid").then((value) => {
			this.setState({truckid: value});
		});

		getSession("@spt:name").then((value) => {
			this.setState({"driverName": value});
		});
		
		getSession("@spt:truckname").then((value) => {
			this.setState({truckname: value});
		});

		getSession("@spt:truckmodel").then((value) => {
			this.setState({truckmodel: value});
		});
		
		getSession("@spt:truckimage").then((value) => {
			this.setState({truckimage: value});
		});
	}
	componentDidMount (){
	}

	doPost(url, formData){
		console.log("posting....")
		console.log(formData);
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
		});	
	}

	onUploadRegistrationPress() {
		var options = {
			title: 'Select Document',
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		};
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);
			if (response.didCancel) {
				console.log('User cancelled photo picker');
			}else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response != null && response.uri != undefined && response.uri != '') {	
				var url = api_url+"/maintenancetwo";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('registration_expiry', this.state.registrationExpiryDate);
				formData.append('registration_expiry_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
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
									source={{uri: this.state.truckimage}}
									style={{ width: 80, height: 70 }}
								/>
							</View>

							<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ marginLeft: 20, fontSize: 16 }}>Name: </Text>
									<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.truckname}</Text>
								</View>

								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ marginLeft: 20, fontSize: 16 }}>Number: </Text>
									<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.truckid}</Text>
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