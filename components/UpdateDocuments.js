import React, { Component } from 'react';

import {
	Card,
	FormLabel,
	FormInput,
	Button
} from 'react-native-elements';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	AsyncStorage,Dimensions,  Alert, Modal
} from 'react-native';

import { clearSession, setSession, getSession } from './HelperFunctions.js';

import ImagePicker from 'react-native-image-crop-picker';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

export default class UpdateDocuments extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	id: 0,
		isLoaded: true,
		userId:'',
		files: [],	    
		isModalVisible: false,
		fileNames: [],
	  };
	  this.fileUpload = this.fileUpload.bind(this);
	  this.uploadCallback = this.uploadCallback.bind(this);
	}
	
	uploadCallback(response)
	{
		var url = api_url+"/signupdocuments";
		let formData = new FormData();
		this.setState({isLoaded: false});
		formData.append('user_id', this.state.userId);
		formData.append('document', { uri: response.uri, name: response.fileName, type: response.type })
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
			}
			else{
				alert("An error occured while uploading your document. Please try again later.");
			}
			
			this.setState({isLoaded: true});
		});
	}
	
	doUploadImages(){
		console.log("saving");
		var x = this.state.files.length;
		if(this.state.files.length == 0){
			alert("Select a file!");
			return;
		}
		
		this.setState({isModalVisible: true});
		var self = this;
		var logId = this.state.userId;
		var message = "";
		
		var y =1;
		for(var i = 0; i <= x -1; i++){
			var url = api_url+"/signupdocuments";
			let formData = new FormData();
			formData.append('user_id', logId);
			formData.append('document', this.state.files[i]);		
			
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
				//this.setState({isModalVisible: false});
				var resData = response;					
				if(resData != null && resData != undefined && message == "") {
					message = resData['message'];
				}
				
				if(response !== undefined && response.status === 1001) {
					//alert(resData['message']);
                  alert("deo dc");
					return;
				}

				if(x === y){
					
					this.setState({files: []});
					this.setState({fileNames: []});
                    Alert.alert(
                      '',
                      message,
                      [
                       {text: 'OK', onPress: () => {
                        console.log('OK Pressed');
                        this.props.navigation.navigate("More");
                       }
                       },
                       ],
                      { cancelable: false }
                      )
                  
					
				}
				y++;
				
			});	
		};
		
	}
	
	fileUpload()
	{
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
			this.setState({files : files});				
		});	
		
	}

	componentDidMount() {
		getSession("@spt:userid").then((value) => {
			this.setState({userId: value});
		});	
	}
	onCloseModal(){}
	render() {
		
			return(
				<View style={styles.container}>
					<Card 
						containerStyle={styles.uploadFileCard}
						title="Upload your documents"
					>
                   {this.state.isModalVisible ?
                       <View style={{flex: 1, flexDirection: 'row'}}>
                       <Modal transparent={true} visible = {true} onRequestClose={this.onCloseModal} >
                       <View style={styles.modalBackground}>
                       <View style={styles.activityIndicatorWrapper}>
                       <ActivityIndicator visible={this.state.isModalVisible}
                       animating={this.state.isModalVisible} />
                       </View>
                       </View>
                       </Modal>
                       </View>
                   : null
                   }
						
								
						<FormLabel style={{ marginBottom: 10 }}>Upload license documents</FormLabel>
						{this.state.fileNames.map((fileSelected, i) =>
							<FormLabel key={i} style={{ marginBottom: 10 }}>{fileSelected}</FormLabel>
						)}
						<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton} onPress={() => this.fileUpload()}>
							<Text>Upload documents</Text>
						</Ionicons.Button>
						
						<Button
							buttonStyle={{ marginTop: 20 }}
							backgroundColor="#000000"
							title="Submit"
							onPress={() => this.doUploadImages()}
						/>
					</Card>
					
				</View>
			);
	}
}

const styles = StyleSheet.create({
	container: {
    	backgroundColor: '#FF7F00',
    	flex: 6
  	},
	loader: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		backgroundColor:'rgba(0,0,0,.6)',
		justifyContent: 'center'
	  },
  	uploadFileCard: {
  		marginTop: 30
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
	  }
});
