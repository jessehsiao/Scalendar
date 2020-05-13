import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View,Text} from 'react-native';
import { SplashScreen } from 'expo';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as Calendar from 'expo-calendar';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState] = React.useState();
  const containerRef = React.useRef();
  // Load any resources or data that we need prior to rendering the app 載入所有這個app需要的data
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

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
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    }
    loadResourcesAndDataAsync();
    calendarPerrmission()
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null
  } else {
    console.log("hihi")
    return (
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD9EC',

  },
});