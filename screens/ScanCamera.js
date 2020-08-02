import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,Platform, Image} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons,AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
//import { Task } from '../calendarComponent/Task';


export default class ScanCamera extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    photoB64:"",
    takeImageText:"",
    imageInPicker: null
    //isTaskModalVisible: false
  }

  async componentDidMount() {
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' },() => {this.props.route.params.back();});
  }

  Cancel=()=>{
    this.props.navigation.navigate('mainCal');
  }

  takePicture = async() => {
    this.setState({
      takeImageText: "... PROCESSING PICTURE ..."
    });
    this.camera.takePictureAsync({skipProcessing:true ,base64: true}).then((data) => {
        this.setState({
            takeImageText: "PICTURE TAKEN",
            photoB64: data.base64,
            imageInPicker: data.uri
            //isTaskModalVisible: true
        }, () => this.props.navigation.navigate('photoScreen',{
          photoB64: this.state.photoB64,
          imageInPicker:this.state.imageInPicker
        }))
    })
  }
/*
  takePicture() {
    this.setState({
        takeImageText: "... PROCESSING PICTURE ..."
    });
    this.camera.takePictureAsync({ skipProcessing: true ,base64: true}).then((data) => {
        this.setState({
            takeImageText: "PICTURE TAKEN",
            photo: data.base64
        }, console.log(data.base64))
    })
}
*/

  pickImage = async () => {
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          base64:true,
          //quality: 1
        });
        if (!result.cancelled) {
          this.setState({ imageInPicker: result.uri, photoB64:result.base64},() => this.props.navigation.navigate('photoScreen',{
            photoB64: this.state.photoB64,
            imageInPicker:this.state.imageInPicker
          }));
          //console.log(result.base64)
        }  
    }catch (E) {
      console.log(E);
    }
  }
  

  render(){
    const { hasPermission,takeImageText} = this.state
    if (hasPermission === null) {
      return <View/>;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType}  ref={ref => {this.camera = ref}}>
              <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:30}}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent'                 
                  }}
                  onPress={()=>this.pickImage()}>
                  <Ionicons
                      name="ios-photos"
                      style={{ color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
          
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={this.takePicture.bind(this)}
                  >
                  <FontAwesome
                      name="camera"
                      style={{ color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
                
                
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={()=>this.Cancel()}
                  >
                  <AntDesign
                      name="close"
                      style={{ color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
        </View>
      );
    }
  }
  
}


const styles = StyleSheet.create({
  taskContainer: {
    height: 550,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
})