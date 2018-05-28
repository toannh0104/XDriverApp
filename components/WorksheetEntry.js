import React, { Component } from 'react';

import {View, StyleSheet, ScrollView, Text, Modal, ActivityIndicator} from 'react-native';
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
	
	  this.state = {
		userId: 0,
		trunkId: '',
	  	name: '',
	  	licenseNumber: '',
	  	registrationNumber: '',
	  	date: '',
	  	worksheetDate: 'select date',
	  	shiftDuration: 'am',
	  	workSite: '',
	  	otherWorkSite: '',
		loadDone: '',
		comment: '',
		file: null,
		worksites:[],
		isModalVisible: false
		
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
			}).then(res => res.json())
			.catch(error => {console.log('Error: ', error)})
			.then(response => {
				var resData = response;
				if (resData != null && resData.status == 1000) {
					this.setState({worksites : resData.data.worksite});
					setSession("@spt:worksites", resData.data.worksite);
				}
				else{
					alert(resData['message']);
				}
		});	
	}
	
	onSelect(index, value){
	  this.setState({
		shiftDuration: value
	  })
	}	
	onChange(){
		this.setState({file:e.target.files[0]})
	}	
		
	fileUpload()
	{
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
				this.state.file = { uri: response.uri, name: response.fileName, type: response.type };
			}
		  });
		  
	}

	onApplyChangesPressed() {
		this.setState({isModalVisible: true});
		
		var payload = {
			userId: this.state.userId,
		  	trunkId: this.state.trunkId,
		  	date: this.state.date,
			shiftDuration : this.state.shiftDuration,
		  	workSite: this.state.workSite,
		  	otherWorkSite: this.state.otherWorkSite,
		  	loadDone: this.state.loadDone,
		  	comment: this.state.comment,
		  	file: this.state.file
		}
		
		var url = api_url+"/worksheet"
		let formData = new FormData();
			formData.append('user_id', payload.userId);
			formData.append('truck_id', payload.trunkId);
			formData.append('log_date', payload.date);
			formData.append('shift_duration', payload.shiftDuration);
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
		  	}).then(res => res.json())
		  	.catch(error => {console.log('Error: ', error)})
		  	.then(response => {
				this.setState({isModalVisible: false});
				
		  		var resData = response;
				if (resData != null) {
					alert(resData['message']);					
				}
				else{
					alert("An error occured while post data. Please try again later.");
				}		
				this.props.navigation.navigate("Trucks");	
		  	});
	}

	onWorksiteSelected(site){
		console.log("site: "+site);
		var workSites = this.state.worksites.map(a => a.worksite); 	
		this.setState({ workSite: workSites[site] })
		console.log(site);
		if(site == 5){
			this.setState({isDisplayOtherWorksite: true});
		}else{
			this.setState({isDisplayOtherWorksite: false});
		}
		
	}

	render() {
		var workSites = this.state.worksites.map(a => a.worksite);
		workSites = workSites.map(value => {return {"value": value} })
		console.log(workSites);
		var loadDones = [{label: 'Local', value: 1}, {label: 'Country', value: 2}];
		var radio_props = [{label: 'AM', value: 'am'}, {label: 'PM', value: 'pm'}];
		
		 
var radio_props1 = [
  {label: 'param1', value: 0 },
  {label: 'param2', value: 1 }
];


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

			      		<FormLabel>Shift Duration</FormLabel>

						<RadioForm
								radio_props={radio_props}
								initial={0}
								borderWidth={1}
								initial={0}
								formHorizontal={true}
								labelHorizontal={true}
								buttonInnerColor={'#e74c3c'}
								buttonOuterColor='#2196f3'
								buttonSize={6}
								buttonOuterSize={14}
								buttonStyle={{}}
								labelStyle={{paddingRight:20}}
								buttonWrapStyle={{marginLeft: 10}}
								style={{paddingLeft: 20, paddingTop: 10,  marginBottom : 0}}
								onPress={(value) => {this.setState({shiftDuration:value})}}
						/>
								

			      		{/* <RadioGroup
					        onSelect = {(index, value) => this.onSelect(index, value)}
				     	>
					        <RadioButton 
					        	style={{ marginLeft: 20 }}
					        	value={'am'} >
					          <Text>AM</Text>
					        </RadioButton>

					        <RadioButton 
					        	style={{ marginLeft: 20 }}
					        	value={'pm'}>
					          <Text>PM</Text>
					        </RadioButton>
						  </RadioGroup> */}
						  <FormLabel>Work Site</FormLabel>
					<View style={{paddingLeft:20, paddingTop: 0}} >					      
						  <Dropdown
								label='Select worksite'
								data={workSites} 
								//onChangeText={this.onChangeText}
								onChangeText={(idx, value) => this.onWorksiteSelected(value)}
							/>
					</View>
					      {/* <ModalDropdown
					      	textStyle={{ marginLeft: 20, fontSize: 16, color: '#FF7F00' }}
					      	options={workSites}
							  onSelect={(site) => this.onWorksiteSelected(site)}					  
							  
					      /> */}
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
							<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton}>
								<Text onPress={this.fileUpload}>Upload Runsheet</Text>
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