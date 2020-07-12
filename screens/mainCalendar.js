
import React,{Component} from 'react';
import {View, Image, TouchableOpacity, AsyncStorage, ScrollView, Text, Dimensions, TextInput, StyleSheet, Alert, Platform,} from 'react-native';
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import CalendarStrip from 'react-native-calendar-strip';
//import Constants from 'expo-constants';
import { OptionInCreate } from '../calendarComponent/OptionInCreate';
import { Context } from '../data/Context';
import { Task } from '../calendarComponent/Task';

import handAdd from '../assets/hand_in.png';
import photoAdd from '../assets/photo_in.png';

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
      todoList: [],
      markedDate: [], 
      markedDateCalendarList: [],
      isTaskModelVisible: false,
      isCreateModalVisible: false,
      selectedTask: null,
      //isDateTimePickerVisible: false,
    };
    async componentDidMount(){
      this._handleTask();
      console.log('this is todoList in compomentDidMount')
      
      console.log(this.state.todoList)
    }

    handleDelete = async (selected,value) => {
      Alert.alert(
        "確定要刪除嗎?",
        "你爽就好",
        [
          {
            text: "取消",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "確定", onPress: async() => {await value.deleteSelectedTask(selected);this._updateCurrentTask(this.state.selectedDate);this.setState({isTaskModalVisible: false});} }
        ],
        { cancelable: false }
      );
    }

    _handleTask = async () =>{
      try{
        const value = await AsyncStorage.getItem('TODO');
        if(value!==null){
          console.log('this is value in handleTask()')
          //console.log(value)
          this._updateCurrentTask(this.state.selectedDate);
        }

      }catch(error){

      }
    };
    handleMarkedDateCalendarList = () =>{
      const markedDatesCalendarList = this.state.markedDate.map(data=>{return moment(data.date).format('YYYY-MM-DD')})
      console.log('這是asedfasdfasdfasdfasdfsadfa',markedDatesCalendarList)

      return markedDatesCalendarList;
    }

    _updateCurrentTask = async selectedDate =>{
      try{
          console.log('有進到updateCurrentTask')
          const value = await AsyncStorage.getItem('TODO');
          if(value!==null){
            const todoList = JSON.parse(value);
            console.log('***************************')
            //console.log(todoList)
            const markDot = todoList.map(item => item.markedDot);
            const todoLists = todoList.filter(item => {
              if (selectedDate === item.startDate || moment(selectedDate).isBetween(item.startDate, item.endDate)===true || selectedDate === item.endDate) {//把當天的行程抓出來
                return true;
              }
              return false;
            });
            if (todoLists.length !== 0) {
              const sortedLists = todoLists.sort((a,b)=>a.startDateTime.localeCompare(b.startDateTime))
              console.log("this is sortedLists: ",sortedLists)
              this.setState({
                markedDate: markDot,
                todoList: sortedLists,
              });
              //console.log(this.state.todoList)
            } else {
              this.setState({
                markedDate: markDot,
                todoList: [],
              });
            }
          }
      }catch(error){
        //error
      }
      console.log("這是markedDate")
      console.log(this.state.markedDate)
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
    returnData2=(data)=>{ 
      console.log('mainCalendar端: 剛剛從哪回來? ',data)
      this.setState({selectedDate: data}, ()=>{
        console.log('加了測試之後:',this.state.selectedDate)
        this.calendarRef.setSelectedDate(this.state.selectedDate);
        this._updateCurrentTask(this.state.selectedDate);
      }) 

      //console.log('Hello:',this.state.selectedDate)
      //this.calendarRef.setSelectedDate(data);//改變標記的日子
      //this.calendarRef.updateWeekView(data);
    }

    setModalfalse=()=>{
      this.setState(
        {isCreateModalVisible: false}, 
        () => {console.log(this.state.isCreateModalVisible)},);
    }


 

  render(){
    const {
      state: {
        datesWhitelist,
        selectedDate,
        todoList,
        markedDate,
        //currentDate,
        markedDateCalendarList,
        isTaskModalVisible,
        isCreateModalVisible,
        selectedTask,
        //isDateTimePickerVisible,
      },
      props: { navigation },
    } = this;

    //const { navigation } = this.props;


    return(
    <Context.Consumer>
    {value => (
      <>
        {selectedTask !== null &&(
            <Task  isModalVisible={isTaskModalVisible}>
              <View style={styles.taskContainer}>
                <Text style={{
                      fontSize: 20,
                      textAlign: 'center',
                      //color: '#fff',
                    }}>{selectedTask.title}</Text>
                <View style={styles.seperator} />
                <Text>開始: {selectedTask.startDateTime}</Text>
                <View style={styles.seperator} />
                <Text>結束: {selectedTask.endDateTime}</Text>
                <View style={styles.seperator} />
                <Text>地點: {selectedTask.place}</Text>
                <View style={styles.seperator} />
                <Text>提醒: {selectedTask.alarm}</Text>
                <View style={styles.seperator} />
                <Text>notes: {selectedTask.notes}</Text>
                <View style={styles.seperator} />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={()=>{this.setState(
                    {isTaskModalVisible: false}, 
                    () => {console.log(this.state.isTaskModalVisible)},), navigation.navigate('updateTask',{selectTask:this.state.selectedTask,onGoBack2: this.returnData2})}}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff',
                    }}
                  >
                    編輯
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={async ()=>{this.handleDelete(selectedTask,value);}}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff',
                    }}
                  >
                    刪除
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={()=>{this.setState(
                    {isTaskModalVisible: false}, 
                    () => {console.log(this.state.isTaskModalVisible)},);}}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff',
                    }}
                  >
                    返回
                  </Text>
                </TouchableOpacity>
              </View>
            </Task>
        )}
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
                  dateNameStyle={{ color: '#ffffff' }}//顯示星期的文字顏色
                  
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
                  highlightDateNameStyle={{ color: '#ffffff' }}//被select到的日期的星期的變化

                  selectedDate={selectedDate}//初始時標註今日日期

                  disabledDateNameStyle={{ color: 'grey' }}//設定過去日期的星期的文字顏色
                  disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}//設定過去日期的文字顏色

                  //datesWhitelist={datesWhitelist}//可以顯示與操作的所有dateslist 瑞昕想拿掉

                  //iconLeft={require('../assets/left-arrow.png')}//左箭頭的圖片
                  //iconRight={require('../assets/right-arrow.png')}//右箭頭的圖片
                  iconContainer={{ flex: 0.1 }}//整個container 的flex 設太大calendarstrip會擠在一起
                  markedDates={markedDate}//有task的日期加上藍色點點

                  onDateSelected={date => {
                    const selected = `${moment(date).format('YYYY')}-${moment(date).format('MM')}-${moment(date).format('DD')}`;
                    this._updateCurrentTask(selected);
                    console.log('你在mainCalendar選了: ',selected)
          
                    this.setState({selectedDate:selected}, function(){
                      console.log('In onDateSelected: ',this.state.selectedDate)
                      this.calendarRef.updateWeekView(this.state.selectedDate);
                    }) 
                  }}
                />
                <TouchableOpacity onPress={()=>{
                  navigation.navigate('Calendar List',{
                    //selected: this.state.selectedDate,
                    markedDate:this.handleMarkedDateCalendarList(),
                    onGoBack: this.returnData,})}} style={styles.button1Style}>     
                    <Text></Text>  
                </TouchableOpacity> 

                <TouchableOpacity 
                  style={styles.floatinBtn}
                  onPress={() => {
                    this.setState({isCreateModalVisible: true,}, () => {
                      console.log(isCreateModalVisible)}
                    );
                }}>  
                </TouchableOpacity>   
      

        
            <OptionInCreate  isCreateModalVisible={ isCreateModalVisible } >
            
                <TouchableOpacity style={styles.handButton}  onPress={() => {
                          this.setState({isCreateModalVisible: false}, () =>
                            navigation.navigate('HandTask',{
                              onGoBack2: this.returnData2
                            }));
                      }}>
                  <View>
                    <Image source={handAdd}></Image>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoButton} onPress={() => {
                            navigation.navigate('Camera',{back: this.setModalfalse})
                        }}>
                  <View>
                    <Image source={photoAdd}></Image>
                  </View>
                </TouchableOpacity>
              
            </OptionInCreate>

            

          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height-150,
            }}
          >

            <ScrollView
                contentContainerStyle={{
                  paddingBottom: 20,
                }}>
                {todoList.map(item => (//將todolist裡面的task map到這裡一個又一個的touchableOpacity task

                    <TouchableOpacity //每個task都是一個 touchableOpacity
                      onPress={() => {this.setState({
                        selectedTask: item,
                        isTaskModalVisible:true
                      },)}}
                      key={item.key}
                      style={styles.taskListContent}
                    >
                      <View //TouchableOpacity的樣式
                        style={{
                          marginLeft: 13,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <View
                            style={{
                              height: 12,
                              width: 12,
                              borderRadius: 6,
                              backgroundColor: item.color,
                              marginRight: 8,
                            }}
                          />
                          <Text
                            style={{
                              color: '#554A4C',
                              fontSize: 20,
                              fontWeight: '700',
                            }}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <View>
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: 20,
                            }}
                          >
                            <Text
                              style={{
                                color: '#BBBBBB',
                                fontSize: 15,
                                //marginRight: 5,
                              }}//小字顯示日期
                            >{item.startDateTime}</Text>
                            <Text
                              style={{
                                color: '#BBBBBB',
                                fontSize: 15,
                                //marginRight: 5,
                              }}//小字顯示日期
                            >{item.endDateTime}</Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 80,
                          width: 5,
                          backgroundColor: item.color,
                          borderRadius: 5,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
            </ScrollView>
          </View>
        </View>
        </>
        )}
      </Context.Consumer>
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
   
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A6A7A7',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  photoButton: {
    marginTop: 3,
    position: 'absolute',
    left:10,
  },
  handButton: {
    position: 'absolute',
    left:10,
    bottom:30,
  },
  /*cancelButton: {
    bottom: 50,
    right: 50,
    width:20,
    height:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },*/
  /*createOptionContainer: {
    height: 150,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    
  },*/
  floatinBtn: {
    //position: 'relative',

    //left: 225, 
    //top: 425,
    position: 'absolute',
    bottom: 40,
    right: 25,
    height: 60,
    width: 60,
    backgroundColor: '#FF359A',
    borderRadius: 30,
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
  taskListContent: {
    height: 100,
    width: 327,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  floatinBtn222: {///暫時忻加
    //position: 'relative',

    //left: 225, 
    //top: 425,
    position: 'relative',
    bottom: 40,
    right: 10,
    height: 60,
    width: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
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

  updateButton: {
    backgroundColor: '#2E66E7',
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    justifyContent: 'center',
    //marginRight: 10,
  },
  deleteButton:{
    backgroundColor: '#2E66E7',
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },

  backButton: {
    backgroundColor: '#2E66E7',
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  seperator: {
    height: 0.5,
    width: '100%',
    backgroundColor: 'black',
    alignSelf: 'center',
    marginVertical: 18,
  },


});


