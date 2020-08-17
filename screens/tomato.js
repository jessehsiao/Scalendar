import React,{Component} from 'react';
import {StyleSheet,Animated, View,TouchableOpacity,Text} from 'react-native';
import CountDown from 'react-native-countdown-component';
// import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
export default class tomato extends Component{
    constructor(props) {
        super(props);
        this.state = {
            running : false,
            until : 1500,
            title : '番茄時鐘法',
        };
    }

    render(){
        const {
            state: {
              running,
              until,
              title,
            },
        } = this;

        return(
            <View style = {styles.container}>
                <Text style = {styles.Title}>
                    {title}
                </Text>
                <CountDown
                    style={styles.CountDowntimer}
                    size={30}
                    timeToShow={['H', 'M', 'S']}
                    timeLabels={{h:'Hour', m: 'Minute', s: 'Second'}}
                    until={until}
                    running={running}
                    onFinish={() => alert('Finished')}
                    digitStyle={{backgroundColor: '#FFF', borderWidth: 5, borderColor: 'red'}}
                    digitTxtStyle={{color: 'red'}}
                    timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                    separatorStyle={{color: 'red'}}            
                    showSeparator={true}
                />
             
                <TouchableOpacity 
                    style={styles.Start }
                    onPress={() => {this.setState({running: true}),this.setState({title: '任務進行中'}),console.log('start')
                    }}
                >
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        開始
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.Pause }
                    onPress={() => {this.setState({running: false}),this.setState({title: '任務暫停中'}),console.log('pause')
                    }}
                >
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        暫停
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.Restart }
                    onPress={() => {this.setState({running: false}),
                                    this.setState({until: until}),
                                    console.log(until);
                                   }
                            }
                >
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        時間重製
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.Add }
                onPress={() => {this.setState({until: this.state.until+300}),
                                console.log('add')
                                }
                        }
                >
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        +
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.Minus }
                onPress={() => {this.setState({until: this.state.until-300}),
                                console.log('minus')
                                }
                        }
                >
                    <Text style={{fontSize: 18,textAlign: 'center', color: '#fff',}}>
                        -
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#EECDCD',
    },
    Title:{
        fontSize: 30,
        fontWeight:'bold',
        color:'red',
        top:120,
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
        width: 252,
        height: 48,
        top:250,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'red',
    },
    Pause: {
        width: 252,
        height: 48,
        top:150,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'red',
    },
    Restart: {
        width: 252,
        height: 48,
        top:50,
        alignSelf: 'center',
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'red',
    },
    Add: {
        width: 30,
        height: 30,
        top:-370,
        left:150,
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'red',
    },
    Minus: {
        width: 30,
        height: 30,
        top:-520,
        right:150,
        marginTop: 120,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor:'red',
    },
    
});