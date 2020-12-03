import {CalendarList} from 'react-native-calendars';
import moment from 'moment';
import {View} from 'react-native';
import React,{Component} from 'react';


export default class calendarList extends Component{

  //用constructor初始化
  constructor(props){
    super(props)
    this.state = {
      markedDay:this.getMarkedDates(),
    }
  }
  /*
  select(day) {
    console.log(this.props.route.params.selected)
    const markedDay = {[day.dayString]:{selected: true}}
    this.setState({markedDay: markedDay})
  }
  */

  getMarkedDates = () => { 
    const marked = {}; 
    this.props.route.params.markedDate.forEach(item => { marked[item] = {marked: true}; }); 
    return JSON.parse(JSON.stringify(marked)); 
  };
  
  render(){
    //const { navigation } = this.props;
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

          
          //selected={this.state.markedDay}
          markedDates={this.state.markedDay}
          
          onDayPress={(date) => {
            //console.log('you click this', date);
            //this.select.bind(this)
            const selectedDate = date.dateString;
            console.log("你在calendarList 選擇了: ",selectedDate);
            this.props.route.params.onGoBack(selectedDate);
            this.props.navigation.navigate('mainCal');
          }}
          
          //onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}//往下滾動會console.log
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
}

