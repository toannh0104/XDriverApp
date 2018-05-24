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

import {
	RadioGroup,
	RadioButton
} from 'react-native-flexi-radio-button';

import ModalDropdown from 'react-native-modal-dropdown';

export default class WorksheetEntry extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	name: '',
	  	licenseNumber: '',
	  	registrationNumber: '',
	  	date: '',
	  	worksheetDate: 'select date',
	  	shiftDuration: '',
	  	workSite: '',
	  	otherWorkSite: ''
	  };

	  this.onApplyChangesPressed = this.onApplyChangesPressed.bind(this);
	}

	onApplyChangesPressed() {
		
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

						<FormLabel style={styles.formLabelStyle}>Name</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ name: text })}
			      			placeholder="John Doe"
			      			value={this.state.name}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>License Number</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ licenseNumber: text })}
			      			placeholder="license number"
			      			value={this.state.licenseNumber}
			      		/>

			      		<FormLabel style={styles.formLabelStyle}>Registration Number</FormLabel>
			      		<FormInput 
			      			onChangeText={(text) => this.setState({ registrationNumber: text })}
			      			placeholder="license number"
			      			value={this.state.registrationNumber}
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
	}
});