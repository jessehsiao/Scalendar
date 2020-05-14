import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Navigator, Image, YellowBox, ImageBackground} from 'react-native';
import background from '../assets/sign.png'; 
import buttonImage from '../assets/signbutton.png'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import mainCalendar from '../screens/mainCalendar.js';

const Stack = createStackNavigator();

import * as Calendar from 'expo-calendar';
            /* <LinearGradient 
                colors={['#87CEFF','#FFBBFF']}
                style={{position: 'absolute',left: 0,right: 0,top: 0,height: 700}}
            /> */

export default function WelcomeScreen({navigation}) {
    return(
        <View style={styles.container}>
            <ImageBackground source = {background} style={{width: '100%', height: '100%'}}>
    
            <TouchableOpacity onPress={() => navigation.navigate('mainCal')} style={styles.button1Style}>    
            <Image source={buttonImage}></Image>        
               </TouchableOpacity> 
            </ImageBackground>
        </View>
    );   
} 

  

// async function getCalendarUser(){
//     const calendars = await Calendar.getCalendarsAsync();
//     console.log(calendars[0].source.name);     
//   }
  
  //class Demo extends React.Component{
    
//} 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button1Style:{
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        bottom : -250,
    },
    button1TextStyle: {
        fontSize: 20,
        color: '#fff'
    },
});