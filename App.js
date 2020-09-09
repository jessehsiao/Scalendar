import * as React from 'react';
//import { Platform, StatusBar, StyleSheet, View,Text} from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as Calendar from 'expo-calendar';
import WelcomeScreen from './screens/WelcomeScreen';
import mainCalendar from './screens/mainCalendar';
import calendarList from './screens/calendarList';
import ScanCamera from './screens/ScanCamera';
import HandTask from './screens/HandTask';
import TodoStore from './data/TodoStore';
import updateTask from './screens/updateTask';
import photoScreen from './screens/photoScreen';
import editScanTask from './screens/editScanTask';
import tomato from './screens/tomato';
import map from './screens/map';
import { AsyncStorage } from 'react-native';
const Stack = createStackNavigator();


export default function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  // Load any resources or data that we need prior to rendering the app 載入所有這個app需要的data
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        //AsyncStorage.clear()
        // Load our initial navigation state

        // Load fonts
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }
    async function calendarPerrmission(){
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync();
      }
    }
    
    loadResourcesAndDataAsync();
    calendarPerrmission()
  }, []);

  /*
    Container /
    -----> Switch /area1
              ------> Switch /area1/hi
    -----> Switch /area2
              ------> Switch /area2/hi       
  */
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null
  } else {
    return (
      <TodoStore>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
              <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />
              <Stack.Screen options={{title:'Home' ,headerShown: false}} name="mainCal" component={mainCalendar} />
              <Stack.Screen name="tomato" component={tomato} options={{
                    title: 'Tomato',
                    headerStyle: {
                      backgroundColor: '#9393FF',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
          }}/>
              <Stack.Screen options={{headerShown: false}} name="Camera" component={ScanCamera} />
              <Stack.Screen name="Calendar List" component={calendarList} options={{
                    title: 'calendar List',
                    headerStyle: {
                      backgroundColor: '#8B6DBF',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
          }}/>
              <Stack.Screen options={{headerShown: false}} name="HandTask" component={HandTask} />
              <Stack.Screen options={{headerShown: false}} name="updateTask" component={updateTask} />
              <Stack.Screen name="photoScreen" component={photoScreen} options={{
                    title: '你選擇的照片',
                    headerStyle: {
                      backgroundColor: '#fff',
                    },
                    headerTintColor: '#8B6DBF',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
          }}/>
              <Stack.Screen options={{headerShown: false}} name="editScanTask" component={editScanTask} />
              <Stack.Screen options={{headerShown: false}} name="map" component={map} />
          </Stack.Navigator>
      </NavigationContainer>
    </TodoStore>
    );
  }
}