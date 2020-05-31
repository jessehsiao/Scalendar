
import React,{Component} from 'react';
import {View, Image, TouchableOpacity, AsyncStorage, ScrollView, Text, Dimensions, TextInput, Switch, StyleSheet, Alert, Platform,} from 'react-native';
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import CalendarStrip from 'react-native-calendar-strip';
//import Constants from 'expo-constants';
import { OptionInCreate } from '../calendarComponent/OptionInCreate';
//import { Context } from '../data/Context';
//import { Task } from '../components/Task';

export default class mainCalendar extends Component{//class 一定要render()
    //定義狀態
    state = {
      datesWhitelist: [//上方calendarstrip所有日期的list 最多可對一年後的日期做操作 也不能對以前的日期做存取
        {
          start: moment(),
          end: moment().add(365, 'days'), // total one year enabled 
        },
      ],
      currentDate: `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`,
      selectedDate: `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`,
      //todoList: [],
      //markedDate: [], 
      //isModelVisible: false,
      isCreateModalVisible: false,
      //selectedTask: null,
      //isDateTimePickerVisible: false,
    };
    returnData=(data)=>{ 
      console.log('mainCalendar端: 剛剛從哪回來? ',data)
      this.setState({selectedDate: data}, ()=>{
        console.log('加了測試之後:',this.state.selectedDate)
        this.calendarRef.setSelectedDate(this.state.selectedDate);
        //this.calendarRef.updateWeekView(this.state.selectedDate);
      }) 

      //console.log('Hello:',this.state.selectedDate)
      //this.calendarRef.setSelectedDate(data);//改變標記的日子
      //this.calendarRef.updateWeekView(data);
      
    }
    
     


  render(){
    const {
      state: {
        datesWhitelist,
        selectedDate,
        //todoList,
        //markedDate,
        //currentDate,
        isCreateModalVisible,
        //selectedTask,
        //isDateTimePickerVisible,
      },
      props: { navigation },
    } = this;

    //const { navigation } = this.props;


    return(
    <>



      <View style={{flex: 1,backgroundColor: '#DDD6F3'}}>
        <CalendarStrip
                ref={ref => {this.calendarRef = ref;}}/////////////////////////////////////////////Home頁面上方的calendar bar
                //scrollable={true}
                calendarAnimation={{ type: 'parallel', duration: 30 ,}}///////////////////////////////////////////////////載入calendar strip的動畫
                daySelectionAnimation={{//calendarstrip上日期被點擊的動畫 以及其樣式 highlight的色彩  被定義在reactNativeCalendarStrip這個套件中
                  type: 'background',
                  duration: 100,
                  highlightColor: '#DDD6F3',//選到的日期的hightligt顏色
                }}
                style={{
                  height: 150,
                  paddingTop: 30,//距離螢幕畫面最頂端的距離
                  paddingBottom: 20,//與這個區塊下方的距離
                }}
                //calendarColor={''}
                calendarHeaderStyle={{ color: '#000000' }}//顯示上方月分與年份的文字顏色
                dateNumberStyle={{ color: '#000000', paddingTop: 10 }}//顯示日期的文字顏色
                dateNameStyle={{ color: '#EE1289' }}//顯示星期的文字顏色
                
                //設定被select到時變化 與樣式
                highlightDateNumberStyle={{
                  color: '#fff',
                  backgroundColor: '#2E66E7',
                  marginTop: 10,
                  height: 35,
                  width: 35,
                  textAlign: 'center',
                  borderRadius: 17.5,
                  overflow: 'hidden',
                  paddingTop: 6,
                  fontWeight: '400',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                highlightDateNameStyle={{ color: '#2E66E7' }}//被select到的日期的星期的變化

                selectedDate={selectedDate}//初始時標註今日日期

                disabledDateNameStyle={{ color: 'grey' }}//設定過去日期的星期的文字顏色
                disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}//設定過去日期的文字顏色

                //datesWhitelist={datesWhitelist}//可以顯示與操作的所有dateslist 瑞昕想拿掉

                //iconLeft={require('../assets/left-arrow.png')}//左箭頭的圖片
                //iconRight={require('../assets/right-arrow.png')}//右箭頭的圖片
                iconContainer={{ flex: 0.1 }}//整個container 的flex 設太大calendarstrip會擠在一起
                //markedDates={markedDate}//有task的日期加上藍色點點

                onDateSelected={date => {
                  const selected = `${moment(date).format('YYYY')}-${moment(date).format('MM')}-${moment(date).format('DD')}`;
                  //this.calendarRef.updateWeekView(selectedDate);
                  console.log('你在mainCalendar選了: ',selected)
        
                  this.setState({selectedDate:selected}, function(){
                    console.log('In onDateSelected: ',this.state.selectedDate)
                    this.calendarRef.updateWeekView(this.state.selectedDate);
                  }) 
                }}
              />
              <TouchableOpacity onPress={()=>{
                navigation.navigate('Calendar List',{
                  selected: this.state.selectedDate,
                  onGoBack: this.returnData,})}} style={styles.button1Style}>     
                  <Text></Text>  
              </TouchableOpacity>  

              <TouchableOpacity 
                  onPress={() => {
                    this.setState({isCreateModalVisible: true,}, () => {
                      console.log(isCreateModalVisible)}
                    );
                }}
                style={styles.viewCreateOption}
              >
              </TouchableOpacity>
        </View>

      
      <OptionInCreate  isCreateModalVisible={ isCreateModalVisible } >
        <View style={styles.createOptionContainer}>
          <TouchableOpacity style={styles.updateButton}  onPress={() => {
                    this.setState({isCreateModalVisible: false,}, () => {
                      console.log(isCreateModalVisible)},
                    );
                }}>
            <Text style={{fontSize: 18,
                          textAlign: 'center',
                          color: '#fff',
                        }}>手動輸入</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => {
                    this.setState({isCreateModalVisible: false,}, () => {
                      console.log(isCreateModalVisible)}
                    );
                }}>
            <Text style={{fontSize: 18,
                          textAlign: 'center',
                          color: '#fff',
                        }}>照片匯入</Text>
          </TouchableOpacity>
        </View>
      </OptionInCreate>
      </>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAACA8',
  },
  button1Style:{
      //padding: 150,
      //borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      bottom : 119,
      //marginLeft:100,
      width : 400,
  },
  button1TextStyle: {
      fontSize: 20,
      color: '#A6A7A7',
      justifyContent: 'center',
      alignItems: 'center',
  },
  viewCreateOption: {
    position: 'absolute',
    bottom: 40,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: '#FF34B3',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF34B3',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginTop: 3,
    borderRadius: 10,
    justifyContent: 'center',
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#2E66E7',
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 10,
    justifyContent: 'center',
    marginRight: 10,
  },
  createOptionContainer: {
    height: 150,
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

});


