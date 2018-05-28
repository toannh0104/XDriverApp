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

import ImagePicker from 'react-native-image-crop-picker';

import { setSession, getSession} from './HelperFunctions';

export default class MaintainenceRecord extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {	  
	  	otherWork: '',
	  	otherWorkDocuments: [],
	  	myDate: 'select date',
	  	driverName: '',
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
		formData.append('comment', 'Initial');
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
	  
	onCloseModal(){}
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

	doSave(){
		var url = api_url+"/maintenancenine";
		let formData = new FormData();
		this.setState({isLoaded: false});
		formData.append('log_id', this.state.logId);
		formData.append('other_work', this.state.otherWork);
		formData.append('other_work_file', this.state.otherWorkDocuments);
		this.doPost(url, formData);
	}

	onOtherWorkDocumentsPress() {
		/*
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
			console.log(response.type);
				this.setState({otherWorkDocuments : { uri: response.uri, name: response.fileName, type: response.type }});				
			}
		});
		*/
		
		ImagePicker.openPicker({
		  multiple: true
		}).then(images => {
		  console.log(images);
		  var files=[];
		  images.forEach(function (item) {
			  var path = item.path;
			  var name = path.substring(path.lastIndexOf("/")+1, path.length)
				files.push({uri: path, name: name, type: item.mime});
			});
			//console.log(files);
		  this.setState({otherWorkDocuments : files});				
		});	
	}

	render() {

		return(
			<View style={styles.container}>
			
				
			  
				<ScrollView>
					<Card title="Truck Info">
<View style={{flex: 1, flexDirection: 'row'}}>						
	<Modal transparent={true} visible = {this.state.isModalVisible} onRequestClose={this.onCloseModal} >
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

					<Card title="Report a Incident">						
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ otherWork: text })}
			      			placeholder="Describe the incident in detail" 
			      			value={this.state.email}
			      		/>
			      		
			      		<Button
			        		buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
			        		title="Upload a file"
			        		onPress={this.onOtherWorkDocumentsPress}
						/>				
						
						<Button
			        			buttonStyle={{ marginTop: 20 }}
			        			backgroundColor="#000000"
			        			title="Save"
			        			onPress={() => this.doSave()}
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