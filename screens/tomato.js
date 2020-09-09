import React,{Component} from 'react';
import {StyleSheet,Animated, View,TouchableOpacity,Text,Alert} from 'react-native';
import CountDown from 'react-native-countdown-component';
// import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
export default class tomato extends Component{
    //_isMounted=false;
    constructor(props) {
        super(props);

        this.state = {
            running:false,
            until:1500,
            title:'工作中',
            uniqueValue:1,
            startButton:false,
            pauseButton:true,
            resetButton:false,
            addMinus:false,
            nowTask:this.props.route.params.nowTask,
            status:"休息",
            statusBtn:false,
        };
    }
    reset=()=>{
        this.setState({uniqueValue:this.state.uniqueValue+1})
    }

    addTime=()=>{
        if(this.state.status==="休息"){
            this.setState({until:this.state.until+300},()=>{this.reset(),console.log(this.state.until)})
        }
        else{
            if(this.state.until<1200){
                this.setState({until:this.state.until+300},()=>{this.reset(),console.log(this.state.until)})
            }
        }
    }
    minusTime=()=>{
        if(this.state.status==="休息"){//按鈕顯示休息=>正在工作
            if(this.state.until>1500){
                this.setState({until:this.state.until-300},()=>{this.reset(),console.log(this.state.until)})   
            }
        }
        else{//正在休息            
            if(this.state.until>300){
            this.setState({until:this.state.until-300},()=>{this.reset(),console.log(this.state.until)})   
        }}
    }
    handleStatusButton=()=>{
        if(this.state.status==="休息"){
            this.setState({title:'休息中',status:"工作",until:600},()=>{this.reset(),console.log(this.state.until)})//換成休息   
        }
        else{
            this.setState({title:'工作中',status:"休息",until:1500},()=>{this.reset(),console.log(this.state.until)})
        }
    }
    changeStyle=()=>{
        if(this.state.status==="休息"){
            return{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:'#E6CAFF',
            }
        }
        else{
            return{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:'#000093',
            }
        }
    }
    handleFinish=()=>{
        this.setState({running: false,startButton:false,resetButton:false,addMinus:false,pauseButton:true,statusBtn:false});
        if(this.state.status==="休息"){
            Alert.alert(
                "番茄時鐘法",
                "時間到了，休息一下吧",
                [
                  { text: "確定", onPress: () => {this.handleStatusButton()}}
                ],
                { cancelable: false }
              );
        }
        else{
            Alert.alert(
                "番茄時鐘法",
                "時間到了，該工作了喔",
                [
                  { text: "確定", onPress: () => {this.handleStatusButton()}}
                ],
                { cancelable: false }
              );    
        }

        
    }

    render(){
        const {
            state: {
              running,
              until,
              title,
              uniqueValue,
              startButton,
              pauseButton,
              resetButton,
              addMinus,
              statusBtn,
            },
        } = this;

        return(
            <View key={uniqueValue} style = {this.changeStyle()}>
                <Text style = {styles.Title}>
                    {this.state.nowTask}
                </Text>
                <Text style = {styles.Title2}>
                    {title}
        </Text>
                <CountDown
                    style={styles.CountDowntimer}
                    size={30}
                    timeToShow={['H', 'M', 'S']}
                    timeLabels={{h:'Hour', m: 'Minute', s: 'Second'}}
                    until={until}
                    running={running}
                    onFinish={() => {this.handleFinish()}}
                    digitStyle={{backgroundColor: '#FFF', borderWidth: 5, borderColor: '#AAAAFF'}}
                    digitTxtStyle={{color: '#2894FF'}}
                    timeLabelStyle={{color: '#2894FF', fontWeight: 'bold'}}
                    separatorStyle={{color: '#2894FF'}}            
                    showSeparator={true}
                />
             
                <TouchableOpacity 
                    disabled={startButton}
                    style={styles.Start}
                    onPress={() => {this.setState({running: true,startButton:true,resetButton:true,addMinus:true,pauseButton:false,statusBtn:true}),console.log('start')
                    }}
                >
                    <Text style={{fontSize:18,textAlign:'center',color: '#fff',}}>
                        start
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    disabled={pauseButton}
                    style={styles.Pause }
                    onPress={() => {this.setState({running: false,startButton:false,resetButton:false,addMinus:false,pauseButton:true,statusBtn:false}),console.log('pause')}}>
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        pause
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    disabled={resetButton}
                    style={styles.Restart}
                    onPress={() => {this.reset()}}>
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        reset
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                disabled={addMinus}
                style={styles.Add }
                onPress={() => {this.addTime()}}>
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        +
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                disabled={addMinus}
                style={styles.Minus }
                onPress={() => {this.minusTime()}}>
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        -
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                disabled={statusBtn}
                style={styles.Btn }
                onPress={()=>{this.handleStatusButton()}}
                >
                    <Text style={{fontSize: 18,textAlign: 'center',fontWeight:'bold',color: '#fff',}}>
                        {this.state.status}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    Title2:{
        fontSize: 20,
        fontWeight:'bold',
        color:'#46A3FF',
        top:130,
    },
    Title:{
        fontSize: 30,
        fontWeight:'bold',
        color:'#FF60AF',
        top:140,
        marginVertical: 20,
    },
    CountDowntimer: {
        marginTop: 1,
        top:150,
        marginBottom:-180,
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'flex-start',
    },
    Start: {
        width: 180,
        height: 48,
        top:250,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#FF44FF',
    },
    Pause: {
        width: 180,
        height: 48,
        top:150,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#66B3FF',
    },
    Restart: {
        width: 180,
        height: 48,
        top:50,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#FF44FF',
    },
    Add: {
        width: 30,
        height: 30,
        top:-370,
        left:150,
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#0080FF',
    },
    Minus: {
        width: 30,
        height: 30,
        top:-520,
        right:150,
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'#0080FF',
    },
    Btn: {
        position: 'relative',
    
        //left: 225, 
        //top: 425,
        position: 'absolute',
        bottom: 30,
        right: 35,
        height: 70,
        width: 70,
        backgroundColor: '#FF359A',
        borderRadius: 35,
        shadowColor: '#FF34B3',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowRadius: 30,
        shadowOpacity: 0.5,
        //elevation: 5,
        //zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
      },
});