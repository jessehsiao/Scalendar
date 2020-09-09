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

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.029;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
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
        )

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
                    />
                ))}
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