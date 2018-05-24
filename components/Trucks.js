import React, { Component } from 'react';

import {
	View,
	ScrollView,
	ListView,
	Text,
	StyleSheet,
	FlatList,
	AsyncStorage,
	ActivityIndicator,
	Image,
	TouchableOpacity
} from 'react-native';

import {
	Card,
	List,
	ListItem
} from 'react-native-elements';

import defaultTruck from '../truckAssets/icon.png';

import { GetAllTrucks, setSession } from './HelperFunctions';


//import { NavigationActions } from 'react-navigation';

const Row = (props) => (
	<View style={styles.container}>
		<Text style={styles.text}>
			{props.name.first} {props.name.last}
		</Text>
	</View>
)

export default class Trucks extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	 trucks: [],
	  	 trucksToRender: '',
		 isLoaded: false
	  };
	  this.loadWorksheet = this.loadWorksheet.bind(this);
	  this.loadMaintenance = this.loadMaintenance.bind(this);
	}

	componentWillMount() {
		var url = api_url+"/trucklist"
		this.setState({isLoaded: false});
		fetch(url, {
			method: 'POST',
			headers: {
              'Accept': 'application/json',
			  'Content-Type': 'multipart/form-data'
            },
		}).then(res => res.json())
		.catch(error => { console.log('Error: ', error) })
		.then(response => {
			var resData = response;
			if (resData['status'] == 1000) {
				this.setState({ trucks: resData['data'] });
			}
			else{
				alert("An error occured while processing your request.");
			}
			
			this.setState({isLoaded: true});
		})
	}
	
	loadWorksheet(truckId, truckName, truckModel, truckImage) {
		
		setSession("@spt:truckid", truckId.toString())
		setSession("@spt:truckname", truckName.toString())
		setSession("@spt:truckmodel", truckModel.toString())
		setSession("@spt:truckimage", truckImage.toString())
		console.log('start')
		this.props.navigation.navigate("WorksheetEntry");
		console.log('end')
	}
	
	//
	loadMaintenance(truckId, truckName, truckModel, truckImage) {
		
		setSession("@spt:truckid", truckId.toString())
		setSession("@spt:truckname", truckName.toString())
		setSession("@spt:truckmodel", truckModel.toString())
		setSession("@spt:truckimage", truckImage.toString())
		console.log('start')
		this.props.navigation.navigate("MaintainenceRecordDetailScreen");
		console.log('end')
	}
	
	render() {
		let trucks = this.state.trucks
		return(
			<View style={styles.container}>
			{
				!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
				: 
				<ScrollView>
					{trucks.map((truck, i) =>
						
							<Card
								key={i} 
								style={styles.trucksCard} 
								title={truck.truck_name}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<View>
									{
										!truck.image?
										<Image
											source={truck.image}
											style={{ width: 100, height: 70 }}
										/>
										:
										<Image
											source={defaultTruck}
											style={{ width: 100, height: 70 }}
										/>
									}
									</View>

									<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<Text style={{ marginLeft: 20, fontSize: 16 }}>Model: </Text>
											<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{truck.truck_number}</Text>
										</View>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<TouchableOpacity onPress={() => this.loadWorksheet(truck.id, truck.truck_name, truck.truck_number, truck.image) } style={styles.editButton}>
												<Text style={{ color: 'white' }}>Worksheet</Text>
											</TouchableOpacity>
										</View>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<TouchableOpacity onPress={() => this.loadMaintenance(truck.id, truck.truck_name, truck.truck_number, truck.image) } style={styles.editButton}>
												<Text style={{ color: 'white' }}>Maintenance</Text>
											</TouchableOpacity>
										</View>
									</View>

									
								</View>


							</Card>
						
					)}
				</ScrollView>
			}
			</View>
		);
	}
	
	
}

const styles = StyleSheet.create({
  container: {
  	flex: 6
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  loader: {
		flex: 1,
		justifyContent: 'center',
	},
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  rowStyle: {
  	alignSelf: 'stretch',
  	height: 80,
  	// borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: '#d6d7da', 
  },
  truckRow: {
  	margin: 10,
  	// backgroundColor: '#FF7F00'
  },
  trucksCard: {
  	marginTop: 3,
  	marginBottom: 0
  },
  editButton: {
  	marginLeft: 15,
	marginTop: 10,
	alignItems: 'center',
	backgroundColor: '#FF7F00',
	padding: 5,
	width: 100
	}
});