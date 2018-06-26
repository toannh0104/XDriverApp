import React, { Component } from 'react';
import {Card,FormLabel,Button} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View,StyleSheet,Text,ActivityIndicator, Alert, Modal} from 'react-native';
import { getSession } from './HelperFunctions.js';
import ImagePicker from 'react-native-image-crop-picker';
export default class FileUploadAfterSignUp extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	id: 0,
		isLoaded: true,		
		isModalVisible: false,
		files: [],	    
		fileNames: [],
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
		/*
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
		  */
		 ImagePicker.openPicker({
			multiple: true,
			compressImageQuality: 0.8,
			loadingLabelText : 'Processing...'
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
			this.setState({files : files});
			this.setState({fileNames: fileNames});			
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
	doUploadImages(){
		console.log("saving");
		var x = this.state.files.length;
		if(this.state.files.length == 0){
			alert("Select a file!");
			return;
		}
		
		this.setState({isModalVisible: true});
		var self = this;
		var logId = this.state.id;
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
                  Alert.alert(
                              '',
                              resData['message'],
                              [
                               {text: 'OK', onPress: () => {
                               console.log('OK Pressed');
							   this.props.navigation.navigate("SignUpSuccessScreen");
                               }
                               },
                               ],
                              { cancelable: false }
                              )
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
						self.setState({isModalVisible: false})
						this.props.navigation.navigate("SignUpSuccessScreen");
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
						<FormLabel style={{ marginBottom: 10 }}>Upload front and back of your license</FormLabel>
						{this.state.fileNames.map((fileSelected, i) =>
							<FormLabel key={i} style={{ marginBottom: 10 }}>{fileSelected}</FormLabel>
						)}					
						<Ionicons.Button name="md-attach" backgroundColor="#FF7F00" style={styles.uploadFileButton} onPress={this.fileUpload} >
							<Text>Upload documents</Text>
						</Ionicons.Button>
						<Button
							buttonStyle={{ marginTop: 20 }}
							backgroundColor="#000000"
							title="Complete Signup"
							onPress={() => this.doUploadImages()}
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
