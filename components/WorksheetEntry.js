import React, { Component } from 'react';

import {View, StyleSheet, ScrollView, Text, Modal, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import {Card, Button, FormInput, FormLabel} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
var ImagePicker = require('react-native-image-picker');
import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { setSession, getSession} from './HelperFunctions';

export default class WorksheetEntry extends Component {
	constructor(props) {
	  super(props);
	  var date = new Date();
	  this.state = {
		userId: 0,
		trunkId: '',
	  	name: '',
	  	licenseNumber: '',
	  	registrationNumber: '',
	  	date: date.getDate() + "-"+(date.getMonth()+ 1) + "-"+date.getFullYear(),
	  	worksheetDate: 'select date',
	  	shift_start_time: date.getHours() + ':'+ date.getMinutes(),
		showShifStartTime: false,
		shift_end_time: date.getHours() + ':'+ date.getMinutes(),
	  	workSite: '',
	  	otherWorkSite: '',
		loadDone: 1,
		comment: '',
		file: null,
		fileName: [],
		worksites:[],
		isModalVisible: false,
		startKm:0,
		endKm:0,
	  };
	  
	  this.fileUpload = this.fileUpload.bind(this);
	  this.onChange = this.onChange.bind(this)	  
	  this.onApplyChangesPressed = this.onApplyChangesPressed.bind(this);
	}
	
	onCloseModal(){}
	componentWillMount() {
		getSession("@spt:userid").then((value) => {
			this.setState({userId: value});
		});
		
		getSession("@spt:truckid").then((value) => {
			this.setState({trunkId: value});
		});
		
		// Get worksites
		var url = api_url+"/worksite";
		fetch(url, {
				method: 'POST',
				timeout: 20
			}).then(res => res.json())
			.catch(error => {console.log('Error: ', error)})
			.then(response => {
				var resData = response;
				if (resData != null && resData.status == 1000) {
					this.setState({worksites : resData.data.worksite});
					//setSession("@spt:worksites", resData.data.worksite);
				}
				else{
					alert(resData['message']);
				}
		});	
	}	

	onChange(){
		this.setState({file:e.target.files[0]})
	}	
		
	fileUpload()
	{
        var options = {
            title: 'Select Document',
            allowsEditing: false,
            cameraType: 'back',
            quality: 0.5,
            storageOptions: {
                skipBackup: true,
                path: 'images',
                waitUntilSaved: true,
                cameraRoll: true
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
				
            type = "image/"+response.fileName.substring(response.fileName.lastIndexOf(".") + 1, response.fileName.length);
                				
            this.setState({file : { uri: response.uri, name: response.fileName, type: type }});
            this.setState({fileName: response.fileName});
			}
		  });
		  
	}

	onApplyChangesPressed() {
	console.log("checking");
		var startKm = this.state.startKm;
		var endKm = this.state.endKm;
		console.log("end shift");
		if(eval(startKm) >= eval(endKm)){
			alert("Start and End Km are not valid!");
			return;
		}
		
		if(this.state.workSite == "" || this.state.workSite == null){
			alert("Select work site!"); 
			return;
		}
		
		if(this.state.comment == ''){
			alert("Update comment!");
			return;
		}
		
		if(this.state.file == null){
			alert("Select a file!");
			return;
		}
		this.setState({isModalVisible: true});
		
		var payload = {
			userId: this.state.userId,
		  	trunkId: this.state.trunkId,
		  	date: this.state.date,
			shift_start_time : this.state.shift_start_time,
			shift_end_time : this.state.shift_end_time,
		  	workSite: this.state.workSite,
		  	otherWorkSite: this.state.otherWorkSite,
		  	loadDone: this.state.loadDone,
		  	comment: this.state.comment,
		  	file: this.state.file,
			startKm: startKm,
			endKm: endKm
		}
		
		var url = api_url+"/worksheet"
		let formData = new FormData();
			formData.append('user_id', payload.userId);
			formData.append('truck_id', payload.trunkId);
			formData.append('log_date', payload.date);
			formData.append('shift_start_time', payload.shift_start_time);
			formData.append('shift_end_time', payload.shift_end_time);
			formData.append('start_km', payload.startKm);
			formData.append('end_km', payload.endKm);			
			formData.append('worksite_id', this.state.worksites.filter(function(el){return el.worksite == payload.workSite})[0].id);
			formData.append('worksite_others', payload.otherWorkSite);
			formData.append('loads_done', payload.loadDone);
			formData.append('loads_comment', payload.comment);
			formData.append('document', payload.file);
			console.log(formData);
			fetch(url, {
	  		method: 'POST',
	  		headers: {
              'Accept': 'application/json',
			  'Content-Type': 'multipart/form-data'
            },
	  		body: formData
		  	}).then(res => {
				return res.json();				
				})
		  	.catch(error => {
				console.log('Error: ', error); 
				})
		  	.then(response => {
				
		  		var resData = response;
				if (resData != null) {
					
                  Alert.alert(
                              '',
                              resData['message'],
                              [
                               {text: 'OK', onPress: () => {
                               console.log('OK Pressed');
                                this.props.navigation.navigate("Trucks");
                               }
                               },
                               ],
                              { cancelable: false }
                              )
				}
				else{
                  this.setState({isModalVisible: false});
					alert("An error occured while post data. Please try again later.");
				}		
				
		  	});
	}

	onWorksiteSelected(site){
		var workSites = this.state.worksites.map(a => a.worksite); 	
		this.setState({ workSite: workSites[site] })
		if(site == 5){
			this.setState({isDisplayOtherWorksite: true});
		}else{
			this.setState({isDisplayOtherWorksite: false});
		}		
	}
	render() {
		var workSites = this.state.worksites.map(a => a.worksite);
		workSites = workSites.map(value => {return {"value": value} })
		var loadDones = [{label: 'Local', value: 1}, {label: 'Country', value: 2}];
		var screenWidth = Dimensions.get('window').width; 
		return(
			<View style={styles.container}>
				<ScrollView>
					<Card containerStyle={styles.formCard}>


				<View style={{flex: 1, flexDirection: 'row'}}>						
				<Modal transparent={true} visible = {this.state.isModalVisible} onRequestClose={this.onCloseModal} >
					<View style={styles.modalBackground}>
							<View style={styles.activityIndicatorWrapper}>
							<ActivityIndicator visible={this.state.isModalVisible}
								animating={this.state.isModalVisible} />
							</View>
						</View>
					</Modal>						
				</View>
						<FormLabel>Date</FormLabel>
			      		<DatePicker
					        style={{  }}
					        date={this.state.date}
					        mode="date"
					        placeholder={this.state.worksheetDate}
					        format="DD-MM-YYYY"
					        minDate="01-04-2017"
					        maxDate="01-12-2030"
					        confirmBtnText="Confirm"
					        cancelBtnText="Cancel"
					        customStyles={{
							  dateIcon: {
								position: 'absolute',
								left: 10,
								top: 4,
								marginLeft: 0
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

						  
	<View style={{flex: 1, flexDirection: 'row'}}>
		<View>
			<FormLabel>Shift start time</FormLabel>
			
			<DatePicker customStyles={{
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
				}} mode={'time'} confirmBtnText="Confirm"
		cancelBtnText="Cancel"
		 date={this.state.shift_start_time}
		  onDateChange={(date) => {this.setState({shift_start_time: date})}} />
		</View>					
						  
		<View>
			  <FormLabel>Shift end time</FormLabel>
			
			<DatePicker customStyles={{
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
				}} mode={'time'} confirmBtnText="Confirm"
        cancelBtnText="Cancel" date={this.state.shift_end_time} onDateChange={(date) => {this.setState({shift_end_time: date})}} />
		</View>				  
	</View>
	
	<View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
		<View  style={{width:screenWidth/2, paddingLeft:25}} >
			<FormLabel style={styles.formLabelStyle}>Start Km</FormLabel>
			<FormInput 
				onChangeText={(text) => this.setState({ startKm: text })}
				placeholder="Start km" keyboardType='numeric' maxLength={10}
				value={this.state.startKm}
			/>
		</View>
		<View  style={{width:screenWidth/2, marginLeft: -10}} >
			<FormLabel>End Km  </FormLabel>
			<FormInput 
			onChangeText={(text) => this.setState({ endKm: text })}
			placeholder="End km" keyboardType='numeric' maxLength={10}
			value={this.state.endKm}
			/>
		</View>
	</View>
	
	
						  <FormLabel>Work Site</FormLabel>
					<View style={{paddingLeft:20, paddingTop: 0}} >					      
						  <Dropdown
								label='Select worksite'
								data={workSites} 
								//onChangeText={this.onChangeText}
								onChangeText={(idx, value) => this.onWorksiteSelected(value)}
							/>
					</View>
						  {						    
							this.state.isDisplayOtherWorksite ? 
							<FormInput 
							onChangeText={(text) => this.setState({ otherWorkSite: text })}
							placeholder="Enter work site name"
							value={this.state.otherWorkSite} 
							visible={false}
							/>
							: null
						}		
							
							<FormLabel style={styles.formLabelStyle}>Loads Done</FormLabel>
						<View style={{paddingLeft:0, paddingTop: 0}} >
							<RadioForm
								radio_props={loadDones}
								initial={0}
								borderWidth={1}
								initial={0}
								formHorizontal={true}
								labelHorizontal={true}
								buttonInnerColor={'#e74c3c'}
								buttonOuterColor='#2196f3'
								buttonSize={6}
								buttonOuterSize={14}
								labelStyle={{paddingRight:20}}
								buttonWrapStyle={{marginLeft: 10}}
								style={{paddingLeft: 20, paddingTop: 10,  marginBottom : 0}}
								onPress={(value) => {this.setState({loadDone:value})}}
								/>
							{/* <Dropdown
								label='Loads Done'
								data={loadDones} 
								style={{color:'red'}}
								onSelect={(loadDone) => this.setState({loadDone: loadDone})}	
							/> */}
						</View>
						{/* <ModalDropdown
						textStyle={{ marginLeft: 20, fontSize: 16, color: '#FF7F00' }}
						options={loadDones}
							onSelect={(loadDone) => this.setState({loadDone: loadDone})}			  
							adjustFrame={(style) => {
								style.height = 70;
								return style;
							  }}
						/>							 */}
							<FormLabel style={styles.formLabelStyle}>Loads Comment</FormLabel>
							<FormInput 
								onChangeText={(text) => this.setState({ comment: text })}
								placeholder="Comment"
								value={this.state.comment}
							/>
							
							<FormLabel style={{ marginBottom: 10 }}>Attach RunSheet</FormLabel>
							
							<FormLabel style={styles.formLabelStyle}>{this.state.fileName}</FormLabel>
							
							
							<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton} onPress={this.fileUpload}>
								<Text>Upload Runsheet</Text>
							</Ionicons.Button>

			      			<Button
			        			buttonStyle={{ marginTop: 20 }}
			        			backgroundColor="#000000"
			        			title="Submit Worksheet"
			        			onPress={this.onApplyChangesPressed}
							/>
					</Card>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FF7F00'
	},
	formCard: {
		marginTop: 30,
		marginBottom: 50
	},	
  	uploadFileButton: {
  		width: 200
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
		},
		formLabelStyle: {			
			paddingLeft: 20,
			marginLeft: 20
		}
});
