import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//import { MonoText } from '../components/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import * as Calendar from 'expo-calendar';

export default function WelcomeScreen() {
    return(
        <View style={styles.container}>
            <LinearGradient 
                colors={['#87CEFF','#FFBBFF']}
                style={{position: 'absolute',left: 0,right: 0,top: 0,height: 700}}
            />
            <TouchableOpacity onPress={getCalendarUser} style={styles.button1Style}>
                <Text style={styles.button1TextStyle}>start to use</Text>
            </TouchableOpacity>
        </View>
    );
} 
async function getCalendarUser(){
    const calendars = await Calendar.getCalendarsAsync();
    console.log(calendars[0].source.name);     
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button1Style:{
        backgroundColor: '#008CBA',
        padding: 20,
        borderRadius: 5,
    },
    button1TextStyle: {
        fontSize: 20,
        color: '#fff'
    },
  });