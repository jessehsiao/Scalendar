
import React,{Component} from 'react';
import {View, Image, TouchableOpacity, AsyncStorage, ScrollView, Text, Dimensions, TextInput, StyleSheet, Alert, Platform,} from 'react-native';
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import CalendarStrip from 'react-native-calendar-strip';
//import Constants from 'expo-constants';
import { OptionInCreate } from '../calendarComponent/OptionInCreate';
import { Context } from '../data/Context';
import { Task } from '../calendarComponent/Task';
import {NavigationEvents} from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';

//import { withNavigationFocus } from 'react-navigation';

import handAdd from '../assets/hand_in.png';
import addBtn from '../assets/addButton.png';
import photoAdd from '../assets/photo_in.png';
import back from '../assets/left-arrow.png';

export default class mainCalendar extends Component{//class 一定要render()
  //_isMounted=false
  //定義狀態
    constructor(props) {
      super(props);
      this.state = {
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
        time: Date.now(),
        nowTask:[],
      };
      this._handleTask=this._handleTask.bind(this);
    }



    async componentDidMount(){

        this._handleTask();
        this.interval = setInterval(()=>{this.setState({time: Date.now()})} ,1000)
        console.log('this is todoList in compomentDidMount')
        //console.log(this.state.todoList)
        const value = await AsyncStorage.getItem('TODO');
        if(value!==null){
          const todoList = JSON.parse(value);
          const markDot = todoList.map(item => item.markedDot);
          this.setState({markedDate: markDot})
        }
  
        this.props.navigation.addListener('focus', () => {
          this._handleTask()
          //this._updateCurrentTask(this.state.currentDate);
        });

    }

    componentWillUnmount() {
      clearInterval(this.interval);
      //this._isMounted=false
    }//Re-render
/*
    handleNowTask= async ()=>{
      try{
        const value = await AsyncStorage.getItem('TODO');
        if(value!==null){
          const todoList = JSON.parse(value);
          const nowTask1 = todoList.map((item)=>{
            return moment(time).isBetween(item.startDate, item.endDate)
          })
          this.setState({nowTask:nowTask1})
          console.log('asdf4a5sd6f45as6df78987898789ffffffffffffffffffffffffffff')
          console.log(this.state.nowTask)
        }
      }catch(error){

      }
    }
*/

    handleDelete = async (selected,value) => {
      Alert.alert(
        "確定要刪除嗎?",
        "都可以",
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
      const todo = await AsyncStorage.getItem('TODO');
      if(todo!==null){
        const todoList = JSON.parse(todo);
        this.handleNowTask(todoList)
      }
    }
    handleNowTask = (todoList)=>{
      const nowTask1 = todoList.filter(item=>{
        if(moment(this.state.time).isBetween(item.startDateTime,item.endDateTime))
        {
          return true
        }
        return false
      })
      this.setState({
        nowTask: nowTask1.map(item=>{
          return item.title
        }),
      });
      
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
      //console.log('這是asedfasdfasdfasdfasdfsadfa',markedDatesCalendarList)

      return markedDatesCalendarList;
    }

    _updateCurrentTask = async selectedDate =>{
      try{
          //const selectedDate = moment(selectedDate1).format('YYYY-MM-DD')
          console.log('有進到updateCurrentTask')
          const value = await AsyncStorage.getItem('TODO');
          if(value!==null){
            const todoList = JSON.parse(value);
            console.log('***************************')
            //console.log(todoList)
            this.handleNowTask(todoList)
            const markDot = todoList.map(item => item.markedDot);

            const todoLists = todoList.filter(item => {
              if (selectedDate === item.startDate || moment(selectedDate).isBetween(item.startDate, item.endDate)===true || selectedDate === item.endDate) {//把當天的行程抓出來
                return true;
              }
              return false;
            });

            if (todoLists.length !== 0) {
              const sortedLists = todoLists.sort((a,b)=> {return moment(a.startDateTime).diff(b.startDateTime);})
              //const sortedLists = todoLists.sort((a,b)=>a.startDateTime.localeCompare(b.startDateTime))
              /*
              const nowTask1 = sortedLists.filter(item=>{
                if(moment(this.state.time).isBetween(item.startDateTime,item.endDateTime))
                {
                  return true
                }
                return false
              })
              */

              console.log("this is sortedLists: ",sortedLists)
              this.setState({
                markedDate: markDot,
                todoList: sortedLists,
                //nowTask: nowTask1.map(item=>{
                  //return item.title
                //}),
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
      //console.log("這是markedDate")
      //console.log(this.state.markedDate)
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
    handleTomato=()=>{
      if(this.state.nowTask.length != 0)
      {
        this.props.navigation.navigate('tomato',{nowTask:this.state.nowTask[0]})
      }
      else
      {
        this.props.navigation.navigate('tomato',{nowTask:'目前無行程'})
      }
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
        nowTask,
        //isDateTimePickerVisible,
      },
      props: { navigation },
    } = this;

    //const { navigation } = this.props;
    {/*<NavigationEvents onWillFocus={() => console.log('you trigger me')} />*/}

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
                <Text>開始: {moment(selectedTask.startDateTime).format('YYYY-MM-DD, H:mm')}</Text>
                <View style={styles.seperator} />
                <Text>結束: {moment(selectedTask.endDateTime).format('YYYY-MM-DD, H:mm')}</Text>
                <View style={styles.seperator} />
                <View style={{flexDirection: 'row',alignItems: 'center',}}>
                <Text>地點: </Text>
                <TouchableOpacity
                  onPress={()=>{this.setState(
                    {isTaskModalVisible: false}, 
                    () => {console.log(this.state.isTaskModalVisible)},), navigation.navigate('map',{selectedTask:this.state.selectedTask,todoList:this.state.todoList})}}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'red',
                    }}
                  >
                    {selectedTask.place}
                  </Text>
                </TouchableOpacity>
                </View>
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
        {/*<NavigationEvents onDidFocus={() => console.log('I am triggered')} />*/}
        <View style={{flex: 1,backgroundColor: '#DDD6F3'}}>
        <LinearGradient
              // Background Linear Gradient
              colors={['#DDD6F3', '#C9D6FF', '#FAACAB']}
              style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 800,
              }}
          />
          <CalendarStrip
                  ref={ref => {this.calendarRef = ref;}}/////////////////////////////////////////////Home頁面上方的calendar bar
                  //scrollable={true}
                  calendarAnimation={{ type: 'parallel', duration: 30 ,}}///////////////////////////////////////////////////載入calendar strip的動畫
                  daySelectionAnimation={{//calendarstrip上日期被點擊的動畫 以及其樣式 highlight的色彩  被定義在reactNativeCalendarStrip這個套件中
                    type: 'background',
                    duration: 100,
                    highlightColor: '#DDD6F3',//選到的日期的hightlight顏色
                  }}
                  style={{
                    height: 150,
                    paddingTop: 30,//距離螢幕畫面最頂端的距離
                    paddingBottom: 20,//與這個區塊下方的距離
                  }}
                  //calendarColor={''}
                  calendarHeaderStyle={{ color: '#000000', }}//顯示上方月分與年份的文字顏色
                  dateNumberStyle={{ color: '#000000', paddingTop: 10 ,fontWeight: '300',}}//顯示日期的文字顏色
                  dateNameStyle={{ color: 'black',fontWeight: '300', }}//顯示星期的文字顏色
                  
                  //設定被select到時變化 與樣式
                  highlightDateNumberStyle={{
                    color: '#fff',
                    backgroundColor: '#8B6DBF',
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
                  

                  selectedDate={selectedDate}//初始時標註今日日期

                  //disabledDateNameStyle={{ color: 'grey' }}//設定過去日期的星期的文字顏色
                  //disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}//設定過去日期的文字顏色

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
                  <View style={styles.addBtn}>
                    <Image source={addBtn}></Image>
                  </View>  
                </TouchableOpacity>   


  
            <OptionInCreate  isCreateModalVisible={ isCreateModalVisible } >
              <View style={styles.optionContainer}>
                <TouchableOpacity style={{bottom:16,}} onPress={() => {
                            this.setState({isCreateModalVisible: false});
                        }}>
                    <View>
                      <Image source={back}></Image>
                    </View>
                  </TouchableOpacity>
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
                </View>
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
                
                }}
            >
             
             <TouchableOpacity 
                style={styles.tomatoButton}
                onPress={() => {
                  this.setState({isCreateModalVisible: false}, () =>{this.handleTomato()});
                }}
            >

                <Text style = {{textAlign: 'center',fontSize: 23,marginTop: 30, color:'grey'}}>
                  {moment().format('YYYY-MM-DD, h:mm:ss a')}
                </Text>

                <Text style = {{textAlign: 'center',fontSize: 20,marginTop: 40,color:'grey'}}>
                  ------目前行程------
                </Text>
                <View style={styles.TextforNowTask}>
                  <Text style = {{textAlign: 'center',fontSize: 25, marginTop:10, color:'white'}}>{this.state.nowTask[0]}</Text>
                </View>
                
              </TouchableOpacity>

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
                            >{moment(item.startDateTime).format('YYYY-MM-DD, H:mm')}</Text>
                            <Text
                              style={{
                                color: '#BBBBBB',
                                fontSize: 15,
                                //marginRight: 5,
                              }}//小字顯示日期
                            >{moment(item.endDateTime).format('YYYY-MM-DD, H:mm')}</Text>
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
    left:175,
    bottom:5,
    flexDirection: 'row'
  },
  handButton: {
    position: 'absolute',
    left:10,
    bottom:5,
    flexDirection: 'row'
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
    //backgroundColor: '#FF359A',
    borderRadius: 30,
    //shadowColor: '#FF34B3',
    /*shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,*/
    elevation: 5,
    zIndex: 999,
  },
  addBtn: {
    //position: 'relative',

    //left: 225, 
    //top: 425,
    position: 'absolute',
    bottom: 48,
    right: 55,
    height: 60,
    width: 60,
    //backgroundColor: '#FF359A',
    borderRadius: 30,
    //shadowColor: '#FF34B3',
    /*shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,*/
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
    backgroundColor: '#8B6DBF',
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    justifyContent: 'center',
    //marginRight: 10,
  },
  deleteButton:{
    backgroundColor: '#8B6DBF',
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },

  backButton: {
    backgroundColor: '#8B6DBF',
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
  tomatoButton: {
    width: 300,
    height: 250,
    marginTop: 1,
    marginBottom:20,
    borderWidth: 4,
    borderRadius: 20,
    borderColor:'white',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    backgroundColor:'rgba(255,255,255,0.25)',
  },
  TextforNowTask:{
    width: 200,
    height: 50,
    marginTop: 15,
    //borderWidth: 4,
    borderRadius: 20,
    //borderColor:'#D0D0D0',
    alignSelf: 'center',
    //justifyContent: 'flex-start',
    backgroundColor:'#BBBBBB',
    
  },
  optionContainer:{
    height: 200,
    width: 340,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#F1E1FF',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    //elevation: 5,
    padding: 22,
    bottom: 45
  }

});


