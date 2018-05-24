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

export default class WorksheetEntry extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
		userId: '',
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
		doc: ''		
	  };
	  
	  this.fileUpload = this.fileUpload.bind(this);
	  this.uploadCallback = this.uploadCallback.bind(this);
	  this.onApplyChangesPressed = this.onApplyChangesPressed.bind(this);
	}
	
	onSelect(index, value){
	  this.setState({
		shiftDuration: value
	  })
	}
	
	uploadCallback(){}
	
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
			if (response.error) {
			  alert(response.error);
			}
			else if (response != null && response.uri != undefined && response.uri != '') {
				console.log(response);
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
		  	doc: this.state.doc
		}
		
		var url = api_url+"/worksheet"
		let formData = new FormData();
			formData.append('name', payload.name);
			formData.append('email', payload.email);
			formData.append('password', payload.password);
			formData.append('mobile', payload.mobile);
			formData.append('address', payload.address);
			formData.append('license_number', payload.license_number);
			formData.append('license_expiry', payload.license_expiry);
			formData.append('commence_date', payload.commence_date);
			
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
						
					}
				}
				else{
					alert("An error occured while post data. Please try again later.");
				}			
		  	});
	}

	render() {
		var workSites = ['Polar', 'Linfox Coles', 'Hume DC', 'Hulgrave', 'Don', 'Local', 'other'];
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