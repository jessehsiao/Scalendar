import React,{Component} from 'react';
import {View,Text,ScrollView,Dimensions,Keyboard,StyleSheet,TouchableOpacity,Image,TextInput,Switch,Picker} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import moment from 'moment';
import uuid from 'uuid';
import { Context } from '../data/Context';
import { LinearGradient } from 'expo-linear-gradient';
import { PlaceInput } from '../calendarComponent/PlaceInput';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class editScanTask extends Component{
    state = {
        currentDay: moment().format(),
        selectedDay_start: this.props.route.params.taskData.map(task => {
            if(!("startTime" in task)){
                return task.startDate + " " + "00:00"
            }
            return task.startDate + " " + task.startTime
        }),
        selectedDay_end: this.props.route.params.taskData.map(task => {
            if(!("endTime" in task)){
                return task.endDate + " " + "23:59"
            }
            return task.endDate + " " + task.endTime
        }),
        isDateTimePickerVisible_start: false,
        isDateTimePickerVisible_end: false,
        isDatePickerVisible_start: false,
        isDatePickerVisible_end: false,
        taskText: this.props.route.params.taskData.map(task => {
            return task.title
        }),
        inputOrnot: this.props.route.params.taskData.map(task => {//用來判斷是否要加入至行事曆
            return "加入"
        }),
        placeText: this.props.route.params.taskData.map(task => {
            return ""
        }),
        notesText: this.props.route.params.taskData.map(task => {
            return ""
        }),
        //createTodo: {},
        alarm: this.props.route.params.taskData.map(task => {
            return "No"
        }),
        // keyboardHeight: 0,

        isHoleDaySet: this.props.route.params.taskData.map(task => {
            return false
        }),
        placeCoordinate: this.props.route.params.taskData.map(task => {
            return ""
        }),
        task: this.props.route.params.taskData,
        isPlaceModalVisible:false,
        currentIndex: 0,
        deleteTask: this.props.route.params.taskData.map(task => {//用來判斷是否要加入至行事曆
            return "刪除"
        }),
    };    


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        ///Keyboard.removeListener(eventName, callback)
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
    
    _keyboardDidShow = e => {
        this.setState({
          keyboardHeight: e.endCoordinates.height,
          visibleHeight:
            Dimensions.get('window').height - e.endCoordinates.height - 30,
        });
    };

    _keyboardDidHide = () => {
    this.setState({
      visibleHeight: Dimensions.get('window').height,
    });
    };

    _showDateTimePicker_start = (index) => this.setState({ isDateTimePickerVisible_start: true,currentIndex:index});

    _hideDateTimePicker_start = () => this.setState({ isDateTimePickerVisible_start: false });

    _showDateTimePicker_end = (index) => this.setState({ isDateTimePickerVisible_end: true,currentIndex:index});

    _hideDateTimePicker_end = () => this.setState({ isDateTimePickerVisible_end: false });

////////////////////////////////////////////////////////很大的問題 要怎麼知道這次條日期是條哪個行程
    _handleDateTimePicked_start = date_start => {
        const { selectedDay_start } = this.state;
        const selectedDatePicked_start = selectedDay_start[this.state.currentIndex];
        const year = moment(date_start).year();
        const month = moment(date_start).month();
        const day = moment(date_start).date();
        const hour = moment(date_start).hour();
        const minute = moment(date_start).minute();
        const selectday_start = moment(selectedDatePicked_start)
          .year(year)
          .month(month)
          .date(day)
          .hour(hour)
          .minute(minute);  
        
        this.setState({
          selectedDay_start:[
            ...this.state.selectedDay_start.slice(0, this.state.currentIndex),
            selectday_start,
            ...this.state.selectedDay_start.slice(this.state.currentIndex+1, this.state.task.length)
            ]
        });
    
        this._hideDateTimePicker_start();
        console.log('A date_start has been picked: ', date_start);
    };

    _handleDateTimePicked_end = date_end => {
        const { selectedDay_end } = this.state;
        const selectedDatePicked_end = selectedDay_end[this.state.currentIndex];
        const year_end = moment(date_end).year();
        const month_end = moment(date_end).month();
        const day_end = moment(date_end).date();
        const hour_end = moment(date_end).hour();
        const minute_end = moment(date_end).minute();
        const selectday_end = moment(selectedDatePicked_end)
          .year(year_end)
          .month(month_end)
          .date(day_end)
          .hour(hour_end)
          .minute(minute_end);  
        
        this.setState({
        //   alarmTime: newModifiedDay,
          selectedDay_end:[
            ...this.state.selectedDay_end.slice(0, this.state.currentIndex),
            selectday_end,
            ...this.state.selectedDay_end.slice(this.state.currentIndex+1, this.state.task.length)
            ]
        //   selectedDay_end:newModifiedDay,
        });
    
        this._hideDateTimePicker_end();
        console.log('A date_end has been picked: ', date_end);
    };

    //主要更新function
    _handleUpdateEventData = async value =>{
        const {
            state: {
                selectedDay_start,
                selectedDay_end,
                isHoleDaySet,
                taskText,
                placeText,
                alarm,
                notesText,
                placeCoordinate,
            },
            props: { navigation },
          } = this;
        /*const finaltaskText = taskText.filter((item,index)=>{
            if(this.state.inputOrnot[index]==="加入"){
                return taskText[index]
            }
        })*/
        const createTodo=taskText.map((item,index) => {
            if(this.state.inputOrnot[index]==="加入"){
                const task={
                    key: uuid(),
                    //useremail:useremail,
                    startDate: `${moment(selectedDay_start[index]).format('YYYY')}-${moment(selectedDay_start[index]).format('MM')}-${moment(selectedDay_start[index]).format('DD')}`,
                    endDate: `${moment(selectedDay_end[index]).format('YYYY')}-${moment(selectedDay_end[index]).format('MM')}-${moment(selectedDay_end[index]).format('DD')}`,////新加的
                    title:taskText[index],
                    place: placeText[index],
                    placeCoordinate: placeCoordinate[index],
                    holeDay:isHoleDaySet[index],
                    startDateTime:moment(selectedDay_start[index]).format(),
                    endDateTime: moment(selectedDay_end[index]).format(),
                    alarm: alarm[index],
                    notes: notesText[index], 
                    color: `rgb(${Math.floor(Math.random() * Math.floor(256))},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(Math.random() * Math.floor(256))})`,
                    markedDot: 
                    {
                        date: moment(selectedDay_start[index]).format(),////新加的
                        dots: [
                        {
                            key: uuid(),
                            color: '#2E66E7',
                            selectedDotColor: '#2E66E7',
                        },
                        ],
                    },
                }
                return task;
            }
            //value.updateTodo(task);//////////////////////////////////////有問題 why?
        })
        const finalcreate = createTodo.filter((item,index)=>{
            if(item!=undefined){
                return item
            }
        })
        console.log(finalcreate)
        await value.updateTodo(finalcreate);//////////////////////////////////////有問題 why?
        navigation.navigate('mainCal');//跳轉回mainCal頁面
    }
    onFocus = (index) => {
        this.setState({isPlaceModalVisible: true, currentIndex:index})
    }

    handleDeleteTask = (index)=>{
        if(this.state.deleteTask[index]==="刪除")
        {
            this.setState({
                deleteTask:[
                    ...this.state.deleteTask.slice(0, index),
                    "復原",
                    ...this.state.deleteTask.slice(index+1, this.state.task.length)
                ],
                inputOrnot:[
                    ...this.state.inputOrnot.slice(0, index),
                    "刪除",
                    ...this.state.inputOrnot.slice(index+1, this.state.task.length)
                ],
            })
        }
        else{
            this.setState({
                deleteTask:[
                    ...this.state.deleteTask.slice(0, index),
                    "刪除",
                    ...this.state.deleteTask.slice(index+1, this.state.task.length)
                ],
                inputOrnot:[
                    ...this.state.inputOrnot.slice(0, index),
                    "加入",
                    ...this.state.inputOrnot.slice(index+1, this.state.task.length)
                ],
            })
        }
    }
    changeStyle=(index)=>{
        if(this.state.inputOrnot[index]==="加入"){
            return{
                height: 800,
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
                opacity: 0.8,
                bottom: -100,
                marginBottom: 30,
            }
        }
        else{
            return{
                height: 800,
                width: 327,
                alignSelf: 'center',
                borderRadius: 20,
                shadowColor: '#2E66E7',
                backgroundColor: '#7B7B7B',
                shadowOffset: {
                  width: 3,
                  height: 3,
                },
                shadowRadius: 20,
                shadowOpacity: 0.2,
                elevation: 5,
                padding: 22,
                opacity: 0.8,
                bottom: -100,
                marginBottom: 30,
            }
        }
    }
    
    render(){
        const {
            state: {
                selectedDay_start,
                selectedDay_end,
                taskText,
                notesText,
                placeText,
                task,
                alarm,
                currentIndex,
                deleteTask,
                //currentTask
                //placeFocusIndex,
                isPlaceModalVisible,
                placeCoordinate,
              },
            props: { navigation },
        } = this;


        return(
        <Context.Consumer>
            {value => (
            <>
            <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible_start}
                onConfirm={this._handleDateTimePicked_start}
                onCancel={this._hideDateTimePicker_start}
                mode = 'datetime'               
            />
            <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible_end}
                onConfirm={this._handleDateTimePicked_end}
                onCancel={this._hideDateTimePicker_end}
                mode = 'datetime'               
            />
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
            <PlaceInput  isModalVisible={isPlaceModalVisible}>
                <View style={styles.placeContainer}>
                    <Text>輸入地點</Text>
                    <GooglePlacesAutocomplete
                            placeholder='Search'
                            fetchDetails={true}
                            styles={{
                                textInputContainer: {
                                  backgroundColor: 'rgba(0,0,0,0)',
                                  borderTopWidth: 0,
                                  borderBottomWidth: 0,
                                },
                                textInput: {
                                  marginLeft: 0,
                                  marginRight: 0,
                                  height: 38,
                                  color: '#5d5d5d',
                                  fontSize: 16,
                                },
                                predefinedPlacesDescription: {
                                  color: '#1faadb',
                                },
                              }}
                            onPress={(data, details) => {
                                // 'details' is provided when fetchDetails = true
                                console.log(details.geometry.location);
                                console.log(this.state.currentIndex)
                                {this.setState({
                                    placeText:[
                                        ...placeText.slice(0, currentIndex),
                                        data.terms[0].value,
                                        ...placeText.slice(this.state.currentIndex+1, this.state.task.length)
                                    ],
                                    placeCoordinate:[
                                        ...placeCoordinate.slice(0, currentIndex),
                                        details.geometry.location,
                                        ...placeCoordinate.slice(this.state.currentIndex+1, this.state.task.length)
                                    ],
                                })}
                            }}
                            query={{
                                key: 'AIzaSyB2Zgbe-G468syp7Rxabj9A938U-KlljmE',
                                language: 'en',
                            }}
                        />
                    <TouchableOpacity style={styles.placeButton } onPress={() => {this.setState({isPlaceModalVisible: false})}}>
                        <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                            確定
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.placeCancelButton } onPress={() => this.setState({isPlaceModalVisible: false, placeText:[
                                        ...placeText.slice(0, currentIndex),
                                        "",
                                        ...placeText.slice(this.state.currentIndex+1, this.state.task.length)
                                        ],
                                        placeCoordinate:[
                                            ...placeCoordinate.slice(0, currentIndex),
                                            "",
                                            ...placeCoordinate.slice(this.state.currentIndex+1, this.state.task.length)
                                        ],
                                    })} >
                        <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                            取消
                        </Text>
                    </TouchableOpacity>
                </View>
            </PlaceInput> 
                <ScrollView contentContainerStyle={{paddingBottom: 100,}}>
                    <View>
                        <Text style = {styles.newTask}>
                            編輯辨識結果
                        </Text>
                    </View>
                    {task.map((item,index) => (
                        <View style={this.changeStyle(index)} key={index}>
                            <Text style={styles.notes}>
                                行程名稱
                            </Text>
                            
                            <TextInput
                                style={styles.title}
                                onChangeText={text => {this.setState({
                                    taskText:[
                                        ...taskText.slice(0, index),
                                        text,
                                        ...taskText.slice(index+1, this.state.task.length)
                                    ]
                                })}}
                                value={taskText[index]}
                                placeholder="請輸入行程名稱"
                                onSubmitEditing={Keyboard.dismiss}
                            />     
                        
                            <View style={styles.seperator} />
                            
                            
                        
                            <Text style={styles.notes}>標註地點</Text>

                            <TextInput
                            style={styles.title}
                            /*onChangeText={text => {this.setState({
                                placeText:[
                                    ...placeText.slice(0, index),
                                    text,
                                    ...placeText.slice(index+1, this.state.task.length)
                                ]
                            })}}*/
                            onFocus={()=>this.onFocus(index)}
                            value={placeText[index]}
                            placeholder="請輸入地點"
                            />
                            
                            <View style={styles.seperator} />

                            <View>
                                <Text style={styles.notes}>
                                    行程日期
                                </Text>
                                <TouchableOpacity 
                                    //key={item.行程}
                                    onPress={()=>
                                        this._showDateTimePicker_start(index)
                                        //console.log(index)
                                    } 
                                    style={styles.start_datetimepickButton}> 
                                    <Text style={{fontSize: 20,textAlign: 'center', color: '#fff',}}>
                                        start
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 19 }}>
                                {moment(selectedDay_start[index]).format('YYYY-MM-DD, H:mm')}
                            </Text>

                            <View style={styles.seperator} />

                            <TouchableOpacity 
                                //key={item.行程}
                                onPress={()=>
                                    this._showDateTimePicker_end(index)
                                    //console.log(index)
                                } 
                                style={styles.end_datetimepickButton }>
                                    <Text style={{fontSize: 20,textAlign: 'center', color: '#fff',}}>end</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 19 }}>
                                {moment(selectedDay_end[index]).format('YYYY-MM-DD, H:mm')}
                            </Text>
                            
                            <View style={styles.seperator} />

                            <Text style={styles.notes}>提醒時間</Text>
                            <View style={{height: 25,marginTop: 3,}}>
                            </View>
                            <Picker
                                selectedValue={alarm[index]}
                                mode="dialog"
                                style={{ height: 50, width: 200 }}
                                onValueChange={itemValue => {this.setState({
                                    alarm:[
                                        ...alarm.slice(0, index),
                                        itemValue,
                                        ...alarm.slice(index+1, this.state.task.length)
                                    ]
                                })}}>

                                {<Picker.Item label="無" value="no" />}
                                {<Picker.Item label="10min" value="10min" />}
                                {<Picker.Item label="30min" value="30min" />}
                                {<Picker.Item label="1hr" value="1hr" />}
                                {<Picker.Item label="2hr" value="2hr" />}

                            </Picker>

                                <View style={styles.seperator} />

                                <Text style={styles.notes}>
                                    備註
                                </Text>
                                <TextInput
                                style={styles.title}
                                onChangeText={text => {this.setState({
                                    notesText:[
                                        ...notesText.slice(0, index),
                                        text,
                                        ...notesText.slice(index+1, this.state.task.length)
                                    ]
                                })}}
                                value={notesText[index]}
                                placeholder="請輸入備註"/> 
                                <TouchableOpacity style={styles.createTaskButton } onPress={() => {this.handleDeleteTask(index)}}>
                                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                                        {deleteTask[index]}
                                    </Text>
                                </TouchableOpacity>


                            </View>
                    ))}

                    <TouchableOpacity style={styles.createTaskButton } onPress={async () => await this._handleUpdateEventData(value)}>
                        <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                            確定
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backButton } onPress={() => navigation.navigate('mainCal')} >
                        <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                            取消
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            </>
            )}
            </Context.Consumer>
        );
    }
}
const styles = StyleSheet.create({
    deleteButton:{
        width: 70,
        height: 100,
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10,
        marginRight:-100,
        marginLeft:-100,
        bottom:-100,
    },

    newTask:{
        alignSelf: 'center',
        fontSize: 20,
        width: 120,
        height: 25,
        textAlign: 'center',
        bottom:-70,
    },
    title: {
        height: 30,
        borderColor: 'green',
        borderLeftWidth: 1,
        paddingLeft: 8,
        fontSize: 25,
    },
    notes: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
    // notesContent: {
    //     height: 0.5,
    //     width: '100%',
    //     backgroundColor: '#979797',
    //     alignSelf: 'center',
    //     marginVertical: 20,
    // },
    seperator: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'black',
        alignSelf: 'center',
        marginVertical: 20,
    },
    createTaskButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#8B6DBF',
    },
    backButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'grey',
    },
    start_datetimepickButton: {
        width: 70,
        height: 30,
        marginTop: 3,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#8B6DBF',
    },
    end_datetimepickButton: {
        width: 70,
        height: 30,
        marginTop: 5,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#8B6DBF',
    },
    switchContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    placeContainer: {
        height: 550,
        width: 327,
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
        elevation: 5,
        padding: 22,
      },
    placeButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        //marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#8B6DBF',
    },
    placeCancelButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'gray',
    },
});