import React, { Component } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.029;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = ""
//0.0922
export default class mainCalendar extends Component{
    state={
        LATITUDE: this.props.route.params.selectedTask.placeCoordinate.lat,
        LONGITUDE: this.props.route.params.selectedTask.placeCoordinate.lng,
        title:this.props.route.params.selectedTask.title,
        todoLists:this.props.route.params.todoList.filter(task => {
                if(task.placeCoordinate!=""){
                    return task;
                }
            }
        ),
        deslatitude:this.props.route.params.selectedTask.placeCoordinate.lat,
        deslongitude:this.props.route.params.selectedTask.placeCoordinate.lng,

    }

    render(){

        return(
            <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#E0E0E0', height: 70, justifyContent: 'center', alignItems: 'center'}}>
              <Text>檢視您當日行程的地點</Text>
            </View>
            <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: this.state.LATITUDE,
                  longitude: this.state.LONGITUDE,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
              >    


                {this.state.todoLists.map((marker,index) => (
                    <Marker key={index}
                    coordinate={{latitude:marker.placeCoordinate.lat,longitude:marker.placeCoordinate.lng}}
                    title={marker.title}
                    description={moment(marker.startDateTime).format('YYYY-MM-DD, H:mm')+" ~ "+moment(marker.endDateTime).format('YYYY-MM-DD, H:mm')}
                    onPress={e => {
                      this.setState({deslatitude:e.nativeEvent.coordinate.latitude,deslongitude:e.nativeEvent.coordinate.longitude})
                    }}
                    />
                ))}

                  <MapViewDirections
                      origin={{latitude:this.state.LATITUDE,longitude:this.state.LONGITUDE}}
                      destination={{latitude:this.state.deslatitude,longitude:this.state.deslongitude}}
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={3}
                      strokeColor="blue"
                    />
                </MapView>
            </View>
          </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      top: 70,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    map: {
       ...StyleSheet.absoluteFillObject,
    },
  });