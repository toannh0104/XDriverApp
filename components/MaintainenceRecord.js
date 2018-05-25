import React, { Component } from 'react';


import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Image,
	AsyncStorage, Dimensions, TouchableOpacity, ActivityIndicator, Alert, Modal
} from 'react-native';

//import Modal from "react-native-modal";

import {
	Card,
	FormLabel,
	FormInput,
	Button
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';

import defaultTruck from '../truckAssets/default_truck.jpg';
import loadingImg from '../truckAssets/loading.gif';
import logoTruck from '../truckAssets/lg.png';

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
			steerTyreChangeComment: '',
			driveTyreChangeKM: '',
			driveTyreChangeComment: '',
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
			logId:'',
			progress: 20,
    progressWithOnComplete: 0,
    progressCustomized: 0,
	    isModalVisible: false


	  };	

	  this.onUploadRegistrationPress = this.onUploadRegistrationPress.bind(this);
	  this.onUploadInsuranceDocumentsPress = this. onUploadInsuranceDocumentsPress.bind(this);
	  this.onfifthWheelDocumentsUploadPress = this.onfifthWheelDocumentsUploadPress.bind(this);
	  this.on100SpeedDocumentsUploadPress = this.on100SpeedDocumentsUploadPress.bind(this);

	  this.onParkBrakeAlarmDocumentsUploadPress = this.onParkBrakeAlarmDocumentsUploadPress.bind(this);
	  this.onLastServiceDocumentsPress = this.onLastServiceDocumentsPress.bind(this);
	  this.onDriveTyreChangePress = this.onDriveTyreChangePress.bind(this);
		this.onOtherWorkDocumentsPress = this.onOtherWorkDocumentsPress.bind(this);
		this.doPost = this.doPost.bind(this);
	}
	

	  onDateChange(date) {
			this.setState({
			  date: date
			});			
			
		let userId = this.props.navigation.state.params.userId;
		let truckId = this.props.navigation.state.params.truckId;
		let cdate = date;
		let logidkey = "@spt:logid"+userId+','+truckId+','+cdate;
		/*getSession(logidkey).then((value) => {
			console.log("get from sessioin");
		});*/
		
		var url = api_url+"/maintenance";
		let formData = new FormData();
		formData.append('user_id', userId);
		formData.append('truck_id', truckId);
		formData.append('log_date', date);
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
					this.setState({logId : resData.data});
					setSession(logidkey, resData.data);
				}
				else{
					alert(resData['message']);
					this.props.navigation.navigate("Trucks");
				}
		});	
		
	  }
	  

	componentWillMount() {
		
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
		this.setState({isModalVisible: true});
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
			this.setState({isModalVisible: false});
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
				var url = api_url+"/maintenancethree";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('insurance_expiry', this.state.registrationExpiryDate);
				formData.append('insurance_expiry_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
		});
	}

	onfifthWheelDocumentsUploadPress() {
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
				var url = api_url+"/maintenancefour";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('fifth_wheel_expiry', this.state.fifthWheelExpiryDate);
				formData.append('fifth_wheel_expiry_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
		});
	}

	on100SpeedDocumentsUploadPress() {
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
				var url = api_url+"/maintenancefive";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('speed_expiry', this.state.fifthWheelExpiryDate);
				formData.append('speed_expiry_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
		});
	}

	onParkBrakeAlarmDocumentsUploadPress() {
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
				var url = api_url+"/maintenancesix";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('page_break_alarm_implements_date', this.state.fifthWheelExpiryDate);
				formData.append('page_break_alarm_implements_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
		});
	}

	onLastServiceDocumentsPress() {
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
				var url = api_url+"/maintenanceseven";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('previous_service_km_date', this.state.lastServiceDate);
				formData.append('previous_service_km', this.state.lastServiceKM);				
				formData.append('previous_service_km_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
		});
	}

	

	onDriveTyreChangePress() {
		var url = api_url+"/maintenanceeight";
		let formData = new FormData();
		this.setState({isLoaded: false});
		formData.append('log_id', this.state.logId);
		formData.append('steer_tyre_change_km', this.state.steerTyreChangeKM);
		formData.append('steer_tyre_change_km_comment', this.state.steerTyreChangeComment);
		formData.append('drive_tyre_change_km', this.state.steerTyreChangeKM);
		formData.append('drive_tyre_change_km_comment', this.state.steerTyreChangeComment);
		this.doPost(url, formData);
	}

	onOtherWorkDocumentsPress() {
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
				var url = api_url+"/maintenancenine";
				let formData = new FormData();
				this.setState({isLoaded: false});
				formData.append('log_id', this.state.logId);
				formData.append('other_work', this.state.otherWork);
				formData.append('other_work_file', { uri: response.uri, name: response.fileName, type: response.type })
				this.doPost(url, formData);
			}
		});
	}

	render() {

		return(
			<View style={styles.container}>
			
				
			  
				<ScrollView>
					<Card title="Truck Info">
<View style={{flex: 1, flexDirection: 'row'}}>						
	<Modal transparent={true} visible = {this.state.isModalVisible} >
		<View style={styles.modalBackground}>
				<View style={styles.activityIndicatorWrapper}>
				<ActivityIndicator visible={this.state.isModalVisible}
					animating={this.state.isModalVisible} />
				</View>
			</View>
		</Modal>						
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
								        onDateChange={(date) => this.onDateChange(date)}
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

						<FormLabel style={styles.formLabelStyle}>Enter steer tyre change(km): </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ steerTyreChangeKM: text })}
			      			placeholder="distance"
			      			keyboardType="numeric"
			      			value={this.state.steerTyreChangeKM} 
			      		/>
						<FormLabel style={styles.formLabelStyle}>Enter steer tyre comment: </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ steerTyreChangeComment: text })}
			      			placeholder="comment"
			      			value={this.state.steerTyreChangeComment} 
			      		/>
			     <FormLabel style={styles.formLabelStyle}>Enter drive tyre change(km): </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ driveTyreChangeKM: text })}
			      			placeholder="distance"
			      			keyboardType="numeric"
			      			value={this.state.driveTyreChangeKM} 
			      		/>
						<FormLabel style={styles.formLabelStyle}>Enter drive tyre comment: </FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ driveTyreChangeComment: text })}
			      			placeholder="comment"
			      			value={this.state.driveTyreChangeComment} 
			      		/>

						<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Save"
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
	modalBackground: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-around',
		backgroundColor: '#00000040'
	  },
	  activityIndicatorWrapper: {
		backgroundColor: '#FFFFFF',
		height: 100,
		width: 100,
		borderRadius: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around'
	  }
});