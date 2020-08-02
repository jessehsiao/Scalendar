import {View,Text,Image,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import React,{Component} from 'react';
//import { TouchableOpacity } from 'react-native-gesture-handler';


export default class photoScreen extends Component{
    postToBackend = async(photo) => {
        await fetch('http://140.115.87.178:8000/ocr/', {
            method: 'POST',
            headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                    },
            body: JSON.stringify({source:photo})
          })
          .then(response => { return response.json();})
          .then(responseData => { 
            console.log(responseData);
            if(Object.keys(responseData[0]).length==1){
                Alert.alert(
                    "您擷取或拍攝的照片有些問題，導致辨識錯誤",
                    "請再重新擷取或拍攝照片",
                    [
                      {
                        text: "取消",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "確定", onPress: () => this.props.navigation.navigate('ScanCamera')}
                    ],
                    { cancelable: false }
                  );
            }
            else{
                this.props.navigation.navigate('editScanTask',{taskData:responseData}); 
            }
            return responseData;
        })
          .catch((err) => { 
              console.log(err);
              Alert.alert(
                "請求伺服器出一點問題",
                "再試一次喔",
                [
                  {
                    text: "取消",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "確定", onPress: () => console.log('ok press')}
                ],
                { cancelable: false }
              );
            });
    }

    render(){
    const photo=this.props.route.params.imageInPicker
    const photoBase64=this.props.route.params.photoB64
        return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor:'#F1E1FF'}}>
            <Image source={{ uri: photo }} style={{ width: 350, height:600 ,resizeMode:'contain'}} />
            <TouchableOpacity style={styles.createTaskButton } onPress={()=>this.postToBackend(photoBase64)}>
                <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                    確定
                </Text>
            </TouchableOpacity>
        </View>
        );
    }
}
const styles = StyleSheet.create({    
    createTaskButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        marginTop: -50,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#2E66E7',
    },


})