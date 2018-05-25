import React, { Component } from 'react';

import {
	View,
	StyleSheet,
	ScrollView,
	Text
} from 'react-native';

import {
	Card,
	Button,
	FormInput,
	FormLabel
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';
var ImagePicker = require('react-native-image-picker');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
	RadioGroup,
	RadioButton
} from 'react-native-flexi-radio-button';

import ModalDropdown from 'react-native-modal-dropdown';
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
	  	shiftDuration: '',
	  	workSite: '',
	  	otherWorkSite: '',
		loadDone: '',
		comment: '',
		file: null,
		worksites:[]
	  };
	  
	  this.fileUpload = this.fileUpload.bind(this);
	  this.onChange = this.onChange.bind(this)	  
	  this.onApplyChangesPressed = this.onApplyChangesPressed.bind(this);
	}
	
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
		  		var resData = response;
				if (resData != null) {
					alert(resData['message']);
					if (resData['status'] == 1000) {
						
					}else{
						
					}
				}
				else{
					alert("An error occured while post data. Please try again later.");
				}			
		  	});
	}

	render() {
		var workSites = this.state.worksites.map(a => a.worksite); //['Polar', 'Linfox Coles', 'Hume DC', 'Hulgrave', 'Don', 'Local', 'other'];
		console.log(workSites);
		return(
			<View style={styles.container}>
				<ScrollView>
					<Card containerStyle={styles.formCard}>
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
			      		<RadioGroup
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
					      </RadioGroup>

					      <FormLabel>Work Site</FormLabel>
					      <ModalDropdown
					      	textStyle={{ marginLeft: 20, fontSize: 16, color: '#FF7F00' }}
					      	options={workSites}
					      	onSelect={(site) => this.setState({ workSite: workSites[site] })}
					      />

					      <FormLabel>Other</FormLabel>
					      <FormInput 
			      			onChangeText={(text) => this.setState({ otherWorkSite: text })}
			      			placeholder="Enter work site name"
			      			value={this.state.otherWorkSite}
			      			/>
							
							<FormLabel style={styles.formLabelStyle}>Loads done</FormLabel>
							<FormInput 
								onChangeText={(text) => this.setState({ loadDone: text })}
								placeholder="loads_done"
								value={this.state.loadDone}
							/>
							
							<FormLabel style={styles.formLabelStyle}>Loads comment</FormLabel>
							<FormInput 
								onChangeText={(text) => this.setState({ comment: text })}
								placeholder="comment"
								value={this.state.comment}
							/>
							
							<FormLabel style={{ marginBottom: 10 }}>Upload document</FormLabel>
							<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton}>
								<Text onPress={this.fileUpload}>Upload document</Text>
							</Ionicons.Button>

			      			<Button
			        			buttonStyle={{ marginTop: 20 }}
			        			backgroundColor="#000000"
			        			title="Apply Changes"
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
  	}
});