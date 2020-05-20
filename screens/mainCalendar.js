import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Text, TouchableOpacity, View,StyleSheet, Image} from 'react-native';
import * as React from 'react';
import button from '../assets/monthbutton.png';


export default function mainCalendar ({navigation}){
  return(
    <View style={styles.container}>
      <Calendar
  // Specify style for calendar container element. Default = {}
  style={{
    borderWidth:1,
    borderColor: '#DDD6F3',
    height: 400,
    backgroundColor:'#DDD6F3'

  }}
  // Specify theme properties to override specific styles for calendar parts. Default = {}
  theme={{
    backgroundColor: '#C9D6FF',
    calendarBackground: '#DDD6F3',
    textSectionTitleColor: '#5E5E5E',
    selectedDayBackgroundColor: 'yellow',
    selectedDayTextColor: 'yellow',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'white',
    indicatorColor: 'blue',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
    
    
  }}
/>  
  
    <TouchableOpacity onPress={() => navigation.navigate('CalList')} style={styles.button1Style} >       
          
          
    </TouchableOpacity>  
  
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAACA8',
  },
  button1Style:{
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      bottom : 418,
      marginLeft:100,
      width : 200,
  },
  button1TextStyle: {
      fontSize: 20,
      color: '#A6A7A7',
      justifyContent: 'center',
      alignItems: 'center',
  },
});


