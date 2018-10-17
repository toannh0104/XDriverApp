import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import DocumentScanner from 'react-native-document-scanner';

const style = StyleSheet.create({
    imageActionButton: {
        paddingVertical: 3, 
		borderRadius: 10 , 
		paddingHorizontal: 5,
		backgroundColor: '#FF7F00', 
		alignItems: 'center', 
		justifyContent: 'center', 
		marginRight: 8
    },
    actionContainer: {
        height: 50, 
        paddingVertical: 5, 
        flexDirection: 'row', 
        justifyContent: 'flex-end'
    }
})

export const ScannedImage = (props) => {
    return (
        <View style={{flex: 1}}>
            <View style={style.actionContainer}> 
                <TouchableOpacity onPress={() => {props.onImageActionPress('done')}} style={style.imageActionButton} >
                    <Text style={{color: '#fff'}}> Done </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {props.onImageActionPress('reScan')}} style={style.imageActionButton} >
                    <Text style={{color: '#fff'}}> Re-Scan </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {props.onImageActionPress('cancel')}} style={style.imageActionButton} >
                    <Text style={{color: '#fff'}}> Cancel </Text>
                </TouchableOpacity>
            </View>
            <Image style={{flex: 1}} source={{ uri: `${props.image}`}} resizeMode="contain" />
        </View>
    )
}

export const DocScanner = (props) => {
    return (
        <DocumentScanner
            style={{flex: 1}}
            
            onPictureTaken={props.onScanPress}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            brightness={0.3}
            saturation={1}
            contrast={1.1}
            quality={0.6}
            detectionCountBeforeCapture={5}
            detectionRefreshRateInMS={50}
        />
    )
}