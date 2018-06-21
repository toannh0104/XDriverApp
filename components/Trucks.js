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
	TouchableOpacity,Alert
} from 'react-native';

import {
	Card,
	List,
	ListItem, SearchBar
} from 'react-native-elements';

import defaultTruck from '../truckAssets/icon.png';

import { GetAllTrucks, setSession, getSession } from './HelperFunctions';


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
		 truckEmpty: '',
	  	 trucksToRender: '',
		 isLoaded: false,
		 userId:'',
		 renderType: 'column',
	  };
	  this.loadWorksheet = this.loadWorksheet.bind(this);
	  this.loadMaintenance = this.loadMaintenance.bind(this);
	  this.doSearch = this.doSearch.bind(this);
	}

	componentWillMount() {
		this.doSearch();

		getSession("@spt:userid").then((value) => {
			this.setState({userId: value});
		});
	}
	
	loadWorksheet(truckId, truckName, truckModel, truckImage) {
		
		setSession("@spt:truckid", truckId.toString())
		setSession("@spt:truckname", truckName.toString())
		setSession("@spt:truckmodel", truckModel.toString())
		setSession("@spt:truckimage", truckImage.toString())
		console.log('start')
		this.props.navigation.navigate("Worksheet");
		console.log('end')
	}
	
	//
	loadMaintenance(truckId, truckName, truckModel,truckRegNo, truckImage) {
		console.log("load sexy");
		setSession("@spt:truckid", truckId.toString())
		setSession("@spt:truckname", truckName.toString())
		setSession("@spt:truckmodel", truckModel.toString())
		setSession("@spt:truckRegNo", truckRegNo.toString())		
		setSession("@spt:truckimage", truckImage.toString())
		console.log('start')
		this.props.navigation.navigate("MaintainenceRecord", {userId: this.state.userId, truckId: truckId});
		console.log('end')
	}
	
	doSearch(keyword){
		
		var url = api_url+"/trucklist"
		this.setState({isLoaded: false});
		var formData = new FormData();
		formData.append('search', keyword !== undefined && keyword.length >= 2 ? keyword: "");
		fetch(url, {
			method: 'POST',
			body: formData,
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
				this.setState({truckEmpty: ''});
			}else if (resData['status'] == 1002) {
				this.setState({ trucks: [] });
				this.setState({truckEmpty: resData['message']});
			}
			else{				
				alert(resData['message']);
			}
			
			this.setState({isLoaded: true});
		})
	}
	
	render() {
		let trucks = this.state.trucks
		console.log("redner");
		return(
			<View style={styles.container}>			
						<SearchBar lightTheme placeholder='Search A Truck' onChangeText={(value) => this.doSearch(value)} />

			{
				!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
				: 
				<ScrollView>
				{this.state.truckEmpty !='' ?
				<Card>
				<Text>{this.state.truckEmpty}</Text>
				</Card>
				:null}
					{trucks.map((truck, i) =>
						
							<Card
								key={i} 
								style={styles.trucksCard} 
								title={truck.truck_name}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<View>
									{
										!!truck.image?
										<Image
											source={{uri: truck.image}}
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
											<Text style={{ marginLeft: 20}}>Model: </Text>
											<Text style={{ fontWeight: 'bold' }}>{truck.truck_number}</Text>
										</View>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<Text style={{ marginLeft: 20}}>Reg No: </Text>
											<Text style={{ fontWeight: 'bold' }}>{truck.registration_number}</Text>
										</View>
										<View style={{ flex: 1, flexDirection: this.state.renderType }} 
										onLayout={(event) => {
										  var {x, y, width, height} = event.nativeEvent.layout;
										  if(width > 300) this.setState({renderType:'row'});
										}}>
											<View style={{ flex: 1, flexDirection: this.state.renderType }} >
												<TouchableOpacity 
												onPress={() => this.loadWorksheet(truck.id, truck.truck_name, truck.truck_number, truck.image) }
												  style={styles.editButton}>
													<Text style={{ color: 'white' }}>Worksheet</Text>
												</TouchableOpacity>
											</View>
											<View>
												<TouchableOpacity onPress={() => this.loadMaintenance(truck.id, truck.truck_name,truck.truck_number, truck.registration_number, truck.image) } style={styles.editButton}>
													<Text style={{ color: 'white' }}>Comments</Text>
												</TouchableOpacity>
											</View>
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
	width: 110
	}
});
