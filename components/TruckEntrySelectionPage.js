import React, { Component } from 'react'

import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Image
} from 'react-native';

import {
	Card,
	Button
} from 'react-native-elements';

import defaultTruck from '../truckAssets/default_truck.jpg';

export default class TruckEntrySelectionPage extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};

	  this.onMaintainenceRecordPress = this.onMaintainenceRecordPress.bind(this);
	  this.onWorksheetEntryPress = this.onWorksheetEntryPress.bind(this);
	}

	onMaintainenceRecordPress() {
		this.props.navigation.navigate("MaintainenceRecord");
	}

	onWorksheetEntryPress() {
		this.props.navigation.navigate("Worksheet");
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView>

					<Card title="Truck Details">
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Image
								style={{ width: 80, height: 70 }}
								source={defaultTruck}
							/>
							<Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold' }}>Name: Volvo</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text>Number: wegvewjkbg</Text>
						</View>
					</Card>

					<Card
						containerStyle={styles.card}
						title="Make entry"
					>
						<Button
							buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
							title="Maintainence Record"
							onPress={this.onMaintainenceRecordPress}
						/>

						<Button
							buttonStyle={{ marginTop: 20 }}
			        		backgroundColor="#FF7F00"
							title="Worksheet"
							onPress={this.onWorksheetEntryPress}
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
	card: {
		marginTop: 20,
		marginBottom: 30
	}
});