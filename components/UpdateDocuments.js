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

export default class FileUploadAfterSignUp extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	id: 0,
		isLoaded: true,
		userId:'',
		files: [],
		fileNames: [],
	  };
	  this.fileUpload = this.fileUpload.bind(this);
	  this.uploadCallback = this.uploadCallback.bind(this);
	  this.doSave = this.doSave(this);
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
	
	doSave(){
		if(this.state.files.length == 0){
			alert("Select a file!");
			return;
		}
		
		this.setState({isModalVisible: true});
		var self = this;
		var logId = this.state.logId;
		var message = "";
		
		var y =1;
		for(var i = 0; i <= this.state.files.length -1; i++){
			var url = api_url+"/updatefile";
			let formData = new FormData();
			formData.append('update_id', logId);
			formData.append('file', this.state.files[i]);		
			
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
				self.setState({isModalVisible: false});	
				var resData = response;					
				if(resData != null && resData != undefined && message == "") {
					message = resData['message'];
				}
				
				if(response !== undefined && response.status === 1001) {
					alert(resData['message']);
					return;
				}

				if(x === y) alert(message);
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

	render() {
		
			return(
				<View style={styles.container}>
					<Card 
						containerStyle={styles.uploadFileCard}
						title="Upload your documents"
					>
	
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
							
	
						<FormLabel style={{ marginBottom: 10 }}>Upload license documents</FormLabel>
						<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton}>
							<Text onPress={this.fileUpload}>Upload documents</Text>
						</Ionicons.Button>
						
						<Button
							buttonStyle={{ marginTop: 20 }}
							backgroundColor="#000000"
							title="Finish Signing Up"
							onPress={this.doSave}
						/>
						{
							!this.state.isLoaded ? <ActivityIndicator size="large" style={styles.loader}/>
								: null
						}
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
  	}
});