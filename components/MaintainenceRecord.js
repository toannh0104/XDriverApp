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
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class MaintainenceRecord extends Component {
	constructor(props) {
	  super(props);
	  var date = new Date();
	  this.state = {	  
	  	otherWork: '',
	  	otherWorkDocuments: [],
		fileNames: [],
	  	myDate: 'select date',
	  	driverName: '',
		truckid:'',
		truckname:'',
		truckmodel:'',
		truckimage:'',
		userId: '',
		logId:'',
	    isModalVisible: false,
		action:'Next',
		comment: '',
		date: date.getDate() + "-"+(date.getMonth()+ 1) + "-"+date.getFullYear(),
	  };	
		this.onOtherWorkDocumentsPress = this.onOtherWorkDocumentsPress.bind(this);
		this.doPost = this.doPost.bind(this);
	}
	

	  onDateChange(date) {
			this.setState({
			  date: date
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
		console.log("posting....")
		console.log(formData);		
		fetch(url, {
			method: 'POST',
			timeout: 20*1000,
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

	doNext(){		
		if(this.state.comment == ""){
			alert("Comment is required!");
			return;
		}

		this.setState({isModalVisible: true});

		let userId = this.props.navigation.state.params.userId;
		let truckId = this.props.navigation.state.params.truckId;
		//let logidkey = "@spt:logid"+userId+','+truckId+','+this.state.date;
		/*getSession(logidkey).then((value) => {
			console.log("get from sessioin");
		});*/
	
		var url = api_url+"/updates";
		let formData = new FormData();
		formData.append('user_id', userId);
		formData.append('truck_id', truckId);
		formData.append('log_date', this.state.date);
		formData.append('comment', this.state.comment);
		console.log(formData);

		fetch(url, {
				method: 'POST',
				timeout: 20*1000,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data'
				},
				body: formData
			}).then(res => res.json())
			.catch(error => {this.setState({isModalVisible: false});console.log('Error: ', error)})
			.then(response => {
				var resData = response;
				this.setState({isModalVisible: false});	
				if (resData != null && resData.status == 1000) {
					this.setState({logId : resData.data});
					this.setState({action : "Submit"});					
					//setSession(logidkey, resData.data);
				}
				else{
					alert(resData['message']);
					this.props.navigation.navigate("Trucks");
				}
				
		});
		
	}
	doSave(){
		var x = this.state.otherWorkDocuments.length;
		if(x == 0 || this.state.otherWorkDocuments == undefined){			
			alert("Select file to upload!"); 			
			return;
		}
		this.setState({isModalVisible: true});
		var self = this;
		var logId = this.state.logId;
		var message = "";
		
		var y =1;
		for(var i = 0; i <= this.state.otherWorkDocuments.length -1; i++){
			var url = api_url+"/updatefile";
			let formData = new FormData();
			formData.append('update_id', logId);
			formData.append('file', this.state.otherWorkDocuments[i]);		
			
			console.log("posting....")
			console.log(formData);		
			fetch(url, {
				method: 'POST',
				timeout: 20*1000,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data'
				},
				body: formData
			}).then(res => {return res.json()})
			.catch(error => {				
				console.log('Error: ', error);
				self.setState({isModalVisible: false});
				alert(error.message);
			})
			.then(response => {							
				self.setState({isModalVisible: false});	
				var resData = response;					
				if(resData != null && resData != undefined && message == "") {
					message = resData['message'];
				}
				
				if(response !== undefined && response.status === 1001) {
					alert(resData['message']);
					return;
				}

				if(x === y) alert(message);
				y++;
			});	
		};
	}

	onOtherWorkDocumentsPress() {			
		ImagePicker.openPicker({
		  multiple: true,
		  includeBase64: false,
		  includeExif: true
		}).then(images => {
		  console.log(images);
		  let files = [];
		  var fileNames=[];
		  images.map((image, idx) => {
			let pathParts = image.path.split('/');
			files[idx] = {
			  data: 'data:'+image.mime+";base64,"+ image.data,
			  uri: image.path,
			  type: image.mime,
			  name: pathParts[pathParts.length - 1]
			}
			fileNames.push(image.path.substring(image.path.lastIndexOf("/")+1, image.path.length));			
		});
		
		this.setState({fileNames: fileNames});
	  
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

					<Card title="Report an Incident">		      		

			      		{this.state.action == "Submit" ? 						
						<View>
						<FormLabel style={{ marginBottom: 10 }}>Upload Incident pictures</FormLabel>
						{this.state.fileNames.map((fileSelected, i) =>
							<FormLabel style={{ marginBottom: 10 }}>{fileSelected}</FormLabel>
						)}
						
						<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton} onPress={this.onOtherWorkDocumentsPress}s>
							<Text>Upload a file</Text>
						</Ionicons.Button>
						</View>
						:null}
						{this.state.action == "Submit" ? 
							<Button
			        			buttonStyle={{ marginTop: 20 }}
			        			backgroundColor="#000000"
			        			title="Save"
			        			onPress={() => this.doSave()}
							/>
							: 
							<View>
							<FormInput 
								onChangeText={(text) => this.setState({ comment: text })}
								placeholder="Describe the Incident in detail" 
								value={this.state.comment}
							/>
							<Button
			        			buttonStyle={{ marginTop: 20 }}
			        			backgroundColor="#000000"
			        			title="Next"
			        			onPress={() => this.doNext()}
							/>
							</View>
						}						
						
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