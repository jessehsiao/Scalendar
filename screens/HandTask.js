import React,{Component} from 'react';
import {View,Text,ScrollView,Dimensions,Keyboard,StyleSheet,TouchableOpacity,Image,TextInput,Switch,Picker} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
//import { useState } from "react";
//const { width: vw } = Dimensions.get('window');
import moment from 'moment';
import uuid from 'uuid';
import { Context } from '../data/Context';

export default class HandTasks extends Component{
    state = {
        // selectedDay_start: {
        //     [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}-${moment().format('hh')}-${moment().format('mm')}`]:
        //     {
        //       selected: true,
        //     },
        //   },
        // selectedDay_end: {
        //     [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}-${moment().format('hh')}-${moment().format('mm')}`]:
        //     {
        //       selected: true,
        //     },
        // },
        currentDay: moment().format(),
        alarmTime: moment().format(),
        selectedDay_start: moment().format(),
        selectedDay_end: moment().format(),
        isDateTimePickerVisible_start: false,
        isDateTimePickerVisible_end: false,
        isDatePickerVisible_start: false,
        isDatePickerVisible_end: false,
        taskText: '',
        placeText: '',
        notesText: '',
        createTodo: {},
        alarm: 'No',
        // keyboardHeight: 0,
        isHoleDaySet: false,

        
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

    handleHoleDaySet = () => {
        //設定整日的初始日期
        const { selectedDay_end } = this.state;
        const selectedDatePicked_end = selectedDay_end;
        const year_end = moment().year();
        const month_end = moment().month();
        const day_end = moment().date();
        const hour_end = moment().endOf('day').hour();
        const minute_end = moment().endOf('day').minute();
        const selectday_end = moment(selectedDatePicked_end)
          .year(year_end)
          .month(month_end)
          .date(day_end)
          .hour(hour_end)
          .minute(minute_end)
        const { selectedDay_start } = this.state;
        const selectedDatePicked_start = selectedDay_start;
        const year = moment().year();
        const month = moment().month();
        const day = moment().date();
        const hour = moment().startOf('day').hour()
        const minute = moment().startOf('day').minute();
        const selectday_start = moment(selectedDatePicked_start)
          .year(year)
          .month(month)
          .date(day)
          .hour(hour)
          .minute(minute)
        
        const { isHoleDaySet } = this.state;
        this.setState({
          isHoleDaySet: !isHoleDaySet,
        });
        this.setState({
            //   alarmTime: newModifiedDay,
            selectedDay_start:selectday_start,
            //   selectedDay_end:newModifiedDay,
        });
        this.setState({
            //   alarmTime: newModifiedDay,
            selectedDay_end:selectday_end,
            //   selectedDay_end:newModifiedDay,
        });
        if(isHoleDaySet===true)//why?
        {
            this.setState({
                selectedDay_start:moment().format(),
            });
            this.setState({
                selectedDay_end:moment().format(),
            });
        }
    };
    _showDatePicker_start = () => this.setState({ isDatePickerVisible_start: true });

    _hideDatePicker_start = () => this.setState({ isDatePickerVisible_start: false });

    _showDatePicker_end = () => this.setState({ isDatePickerVisible_end: true });

    _hideDatePicker_end = () => this.setState({ isDatePickerVisible_end: false });

    _showDateTimePicker_start = () => this.setState({ isDateTimePickerVisible_start: true });

    _hideDateTimePicker_start = () => this.setState({ isDateTimePickerVisible_start: false });

    _showDateTimePicker_end = () => this.setState({ isDateTimePickerVisible_end: true });

    _hideDateTimePicker_end = () => this.setState({ isDateTimePickerVisible_end: false });

    _handleDateTimePicked_start = date_start => {
        const { selectedDay_start } = this.state;
        const selectedDatePicked_start = selectedDay_start;
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
        //   alarmTime: newModifiedDay,
          selectedDay_start:selectday_start,
        //   selectedDay_end:newModifiedDay,
        });
    
        this._hideDateTimePicker_start();
        console.log('A date_start has been picked: ', date_start);
    };

    _handleDateTimePicked_end = date_end => {
        const { selectedDay_end } = this.state;
        const selectedDatePicked_end = selectedDay_end;
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
          selectedDay_end:selectday_end,
        //   selectedDay_end:newModifiedDay,
        });
    
        this._hideDateTimePicker_end();
        console.log('A date_end has been picked: ', date_end);
    };

    _handleDatePicked_start = date_start => {
        const { selectedDay_start } = this.state;
        const selectedDatePicked_start = selectedDay_start;
        const year = moment(date_start).year();
        const month = moment(date_start).month();
        const day = moment(date_start).date();
        const hour = moment(date_start).startOf('day').hour()
        const minute = moment(date_start).startOf('day').minute();
        const selectday_start = moment(selectedDatePicked_start)
          .year(year)
          .month(month)
          .date(day)
          .hour(hour)
          .minute(minute)
        
        this.setState({
        //   alarmTime: newModifiedDay,
          selectedDay_start:selectday_start,
        //   selectedDay_end:newModifiedDay,
        });
    
        this._hideDatePicker_start();
        console.log('A date_start has been picked: ', date_start);
    };

    _handleDatePicked_end = date_end => {
        const { selectedDay_end } = this.state;
        const selectedDatePicked_end = selectedDay_end;
        const year_end = moment(date_end).year();
        const month_end = moment(date_end).month();
        const day_end = moment(date_end).date();
        const hour_end = moment(date_end).endOf('day').hour();
        const minute_end = moment(date_end).endOf('day').minute();
        const selectday_end = moment(selectedDatePicked_end)
          .year(year_end)
          .month(month_end)
          .date(day_end)
          .hour(hour_end)
          .minute(minute_end)
          
        this.setState({
        //   alarmTime: newModifiedDay,
          selectedDay_end:selectday_end,
        //   selectedDay_end:newModifiedDay,
        });
    
        this._hideDatePicker_end();
        console.log('A date_end has been picked: ', date_end);
    };
    // const [pickerMode, setPickerMode] = useState(null);
    // // showDatePicker = () => {
    //     setPickerMode("date");
    // };
    
    // showTimePicker = () => {
    //     setPickerMode("time");
    // };

    _handleCreateEventData = async value =>{
        const {
            state: {
                selectedDay_start,
                selectedDay_end,
                isHoleDaySet,
                taskText,
                placeText,
                alarm,
                notesText,
            },
            props: { navigation },
          } = this;
        const createTodo={
            key: uuid(),
            startDate: `${moment(selectedDay_start).format('YYYY')}-${moment(selectedDay_start).format('MM')}-${moment(selectedDay_start).format('DD')}`,
            endDate: `${moment(selectedDay_end).format('YYYY')}-${moment(selectedDay_end).format('MM')}-${moment(selectedDay_end).format('DD')}`,////新加的
            title:taskText,
            place: placeText,
            holeDay:isHoleDaySet,
            startDateTime:moment(selectedDay_start).format('YYYY-MM-DD, h:mm a'),
            endDateTime: moment(selectedDay_end).format('YYYY-MM-DD, h:mm a'),
            startTime: moment(selectedDay_start).format('h:mm a'),
            endTime: moment(selectedDay_end).format('h:mm a'),
            alarm: alarm,
            notes: notesText,
            color: `rgb(${Math.floor(Math.random() * Math.floor(256))},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(Math.random() * Math.floor(256))})`,
            markedDot: 
            {
                date: selectedDay_start,////新加的
                dots: [
                  {
                    key: uuid(),
                    color: '#2E66E7',
                    selectedDotColor: '#2E66E7',
                  },
                ],
            },
        };
        await value.updateTodo(createTodo);//////////////////////////////////////有問題 why?
        this.props.route.params.onGoBack2(createTodo.startDate);
        navigation.navigate('mainCal');//跳轉回mainCal頁面
    }
    
    render(){
        const {
            state: {
                selectedDay_start,
                selectedDay_end,
                // currentDay,
                taskText,
                // visibleHeight,
                notesText,
                placeText,
                isHoleDaySet,
                //isDateTimePickerVisible_start,
                //isDateTimePickerVisible_end,
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
            <DateTimePicker
                isVisible={this.state.isDatePickerVisible_start}
                onConfirm={this._handleDatePicked_start}
                onCancel={this._hideDatePicker_start}
                mode = 'date'               
            />
            <DateTimePicker
                isVisible={this.state.isDatePickerVisible_end}
                onConfirm={this._handleDatePicked_end}
                onCancel={this._hideDatePicker_end}
                mode = 'date'               
            />          
            <View style={{flex: 1,backgroundColor: '#DDD6F3'}}>
                <ScrollView contentContainerStyle={{paddingBottom: 100,}}>
                    <View>
                        <Text style = {styles.newTask}>
                            新增行程
                        </Text>
                    </View>

                    <View style={styles.taskContainer}>
                        <Text style={styles.notes}>
                            行程名稱
                        </Text>
                        <TextInput
                            style={styles.title}
                            onChangeText={text => this.setState({ taskText: text })}
                            value={taskText}
                            placeholder="請輸入行程名稱"
                            onSubmitEditing={Keyboard.dismiss}
                        />     
                    
                        <View style={styles.seperator} />
                        
                        
                    
                        <Text style={styles.notes}>標註地點</Text>

                        <TextInput
                        style={styles.title}
                        onChangeText={text => this.setState({ placeText: text })}
                        value={placeText}
                        placeholder="請輸入地點"
                        /> 
                        
                        <View style={styles.seperator} />
                        <View style={{flexDirection: 'row',alignItems: 'center',}}>
                            <Text style={styles.notes}>整日</Text>
                            <Switch
                                value={isHoleDaySet}
                                onValueChange={this.handleHoleDaySet}
                                disabled={false}
                            />
                        </View>
                        <View style={styles.seperator} />
                        <View>
                            <Text style={styles.notes}>
                                行程日期
                            </Text>
                            <TouchableOpacity 
                                onPress={isHoleDaySet===false? (this._showDateTimePicker_start):(this._showDatePicker_start)} 
                                style={styles.start_datetimepickButton }> 
                                <Text style={{fontSize: 20,textAlign: 'center', color: '#fff',}}>
                                    start
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 19 }}>
                            {moment(selectedDay_start).format('YYYY-MM-DD, h:mm a')}
                        </Text>

                        <View style={styles.seperator} />

                        <TouchableOpacity 
                            onPress={isHoleDaySet===false? (this._showDateTimePicker_end):(this._showDatePicker_end)} 
                            style={styles.end_datetimepickButton }>
                                <Text style={{fontSize: 20,textAlign: 'center', color: '#fff',}}>end</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 19 }}>
                            {moment(selectedDay_end).format('YYYY-MM-DD, h:mm a')}
                        </Text>
                        
                        <View style={styles.seperator} />

                        <Text style={styles.notes}>提醒時間</Text>
                        <View style={{height: 25,marginTop: 3,}}>
                        </View>
                        <Picker
                            selectedValue={this.state.alarm}
                            mode="dropdown"
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue) => this.setState({ alarm: itemValue })}>

                            <Picker.Item label="無" value="no" />
                            {isHoleDaySet === false ? (<Picker.Item label="10min" value="10min" />) :(<Picker.Item label="當日(8:00)" value="當日(8:00)" />)}
                            {isHoleDaySet === false ? (<Picker.Item label="30min" value="30min" />) :(<Picker.Item label="前一天(20:00)" value="前一天(20:00)" />)}
                            {isHoleDaySet === false ? (<Picker.Item label="1hr" value="1hr" />) :(<Picker.Item label="前兩天(20:00)" value="前兩天(20:00)" />)}
                            {isHoleDaySet === false ? (<Picker.Item label="2hr" value="2hr" />) :null}

                          </Picker>

                            <View style={styles.seperator} />

                            <Text style={styles.notes}>
                                備註
                            </Text>
                            <TextInput
                            style={styles.title}
                            onChangeText={text =>this.setState({ notesText: text })}
                            value={notesText}
                            placeholder="請輸入備註"/> 

                    </View>
                    <TouchableOpacity style={styles.createTaskButton } onPress={async () => await this._handleCreateEventData(value)}>
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
    // finishButton:{
    //     width: 70,
    //     height: 100,
    //     alignSelf: 'center',
    //     marginTop: 5,
    //     borderRadius: 10,
    //     justifyContent: 'center',
    //     marginRight: -100,
    //     marginLeft:100,
    //     bottom:0,
    // },
    newTask:{
        alignSelf: 'center',
        fontSize: 20,
        width: 120,
        height: 25,
        textAlign: 'center',
        bottom:-70,
    },
    taskContainer:{
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
        backgroundColor:'#2E66E7',
    },
    backButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'red',
    },
    start_datetimepickButton: {
        width: 70,
        height: 30,
        marginTop: 3,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'green',
    },
    end_datetimepickButton: {
        width: 70,
        height: 30,
        marginTop: 5,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'pink',
    },
    switchContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
});