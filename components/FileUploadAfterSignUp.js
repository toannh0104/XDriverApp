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
	AsyncStorage,
} from 'react-native';

import { clearSession, setSession, getSession } from './HelperFunctions.js';

var ImagePicker = require('react-native-image-picker'); 

import Icon from 'react-native-vector-icons/FontAwesome';

export default class FileUploadAfterSignUp extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	id: 0,
		isLoaded: true,
	  };
	  this.fileUpload = this.fileUpload.bind(this);
	  this.uploadCallback = this.uploadCallback.bind(this);
	}
	
	uploadCallback(response)
	{
        var type = response.type;
        if(type == null || type == undefined){
            type = "image/"+response.fileName.substring(response.fileName.lastIndexOf(".") + 1, response.fileName.length);
        }
        
		var url = api_url+"/signupdocuments";
		let formData = new FormData();
		this.setState({isLoaded: false});
		formData.append('user_id', this.state.id);
		formData.append('document', { uri: response.uri, name: response.fileName, type: type })
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
	
	fileUpload()
	{
		var options = {
			title: 'Select Documents',
            allowsEditing: false,
            cameraType: 'back',
			storageOptions: {
                skipBackup: true,
                path: 'images',
                waitUntilSaved: true,
                cameraRoll: true
			}
		  };
		  
		  ImagePicker.showImagePicker(options, (response, uploadCallback) => {
			if (response.error) {
			  alert(response.error);
			}
			else if (response != null && response.uri != undefined && response.uri != '') {
				this.uploadCallback(response);
			}
		  });
	}

	componentDidMount() {
		getSession('@spt:signupid').then((data) => {
			if (data!=null) {
                this.setState({ id: data, isLoaded: true });
            }
			else{
				this.props.navigation.navigate("SignUpSuccessScreen")
			}
		});
	}

	render() {
		
			return(
				<View style={styles.container}>
					<Card 
						containerStyle={styles.uploadFileCard}
						title="Upload your documents"
					>
	
						<FormLabel style={{ marginBottom: 10 }}>Upload license documents</FormLabel>
						<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton} onPress={this.fileUpload} >
							<Text>Upload documents</Text>
						</Ionicons.Button>
						
						<Button
							buttonStyle={{ marginTop: 20 }}
							backgroundColor="#000000"
							title="Finish Signing Up"
							onPress={() => this.props.navigation.navigate("SignUpSuccessScreen")}
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
