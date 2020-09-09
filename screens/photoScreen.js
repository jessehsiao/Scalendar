import {View,Text,Image,TouchableOpacity,StyleSheet,Alert,ActivityIndicator} from 'react-native';
import React,{Component} from 'react';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export default class photoScreen extends Component{
    state = { animating: false }

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
            this.setState({animating:false})
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
                      { text: "確定", onPress: () => this.props.navigation.navigate('Camera')}
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
                "或是您擷取或拍攝的照片有些問題，導致辨識錯誤，請重新選取或拍攝照片",
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
        <View style={{ flex: 1,justifyContent: 'center',alignItems: 'center'}}>
          <LinearGradient
              // Background Linear Gradient
              colors={['#DDD6F3', '#C9D6FF', '#FAACAB']}
              style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 800,
              }}
          />
            <ActivityIndicator
               animating = {this.state.animating}
               color = '#bc2b78'
               size = "large"
               style = {styles.activityIndicator}/>
            <Image source={{ uri: photo }} style={styles.image} />
            <TouchableOpacity style={styles.createTaskButton } onPress={()=>{this.postToBackend(photoBase64);this.setState({animating:true})}}>
                <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                    確定
                </Text>
            </TouchableOpacity>


        </View>
        );
    }
}
const styles = StyleSheet.create({    
    jcreateTaskButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        bottom: 125,
        //marginTop: -100,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#8B6DBF',
    },
    createTaskButton: {
      position: 'relative',
  
      //left: 225, 
      //top: 425,
      position: 'absolute',
      bottom: 30,
      right: 35,
      height: 70,
      width: 70,
      backgroundColor: '#FF359A',
      borderRadius: 35,
      shadowColor: '#FF34B3',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowRadius: 30,
      shadowOpacity: 0.5,
      //elevation: 5,
      //zIndex: 999,
      justifyContent: 'center',
      alignItems: 'center',
    },

    activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
   },
   image:{ 
     flex:6,
     justifyContent: 'flex-start',
     bottom:50,
     //alignSelf: 'center',
     width: 350, 
     height:600 ,
     resizeMode:'contain',
    }

})