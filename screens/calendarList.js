import {CalendarList} from 'react-native-calendars';
import {View, StyleSheet} from 'react-native';
import * as React from 'react';


export default function mainCalendar ({navigation}){
  return(
    <View>
      <CalendarList
        theme={{
          backgroundColor: '#FFE5E3',
          calendarBackground: '#FFE5E3',
          textSectionTitleColor: '#8B6DBF',
          monthTextColor: '#8B6DBF',
          textMonthFontWeight: 'bold',
          todayBackgroundColor: '#8B6DBF',
          todayTextColor: 'white'
        }}
        // Callback which gets executed when visible months change in scroll view. Default = undefined
        onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={50}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={50}
        // Enable or disable scrolling of calendar list
        scrollEnabled={true}
        // Enable or disable vertical scroll indicator. Default = false
        showScrollIndicator={true}
      />     
    </View>
  );
}

