import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Text, TouchableOpacity, View,StyleSheet} from 'react-native';
import * as React from 'react';


export default function mainCalendar ({navigation}){
  return(
    <View style={styles.container}>
      <Calendar
  // Specify style for calendar container element. Default = {}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350,
    backgroundColor:'#ffffff'
    
  }}
  // Specify theme properties to override specific styles for calendar parts. Default = {}
  theme={{
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: 'yellow',
    selectedDayTextColor: 'yellow',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}
/>      
    <TouchableOpacity onPress={() => navigation.navigate('CalList')} style={styles.button1Style} >    
          <Text style={styles.button1TextStyle}>Calendar list</Text>   
    </TouchableOpacity>  
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button1Style:{
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      bottom : -60,
      backgroundColor : 'yellow',
      width : 200,
  },
  button1TextStyle: {
      fontSize: 20,
      color: 'black',
      justifyContent: 'center',
      alignItems: 'center',
  },
});

    
