import React, { Component } from 'react';

import {
	Card
} from 'react-native-elements';

import {
	View,
	ScrollView,
	StyleSheet,
	Text
} from 'react-native';

export default class MaintainenceRecordDetailScreen extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView>
					<Card title="Truck">
						<Text>Truck name</Text>
					</Card>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 6,
		backgroundColor: "#FF7F00"
	}
});