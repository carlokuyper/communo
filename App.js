import 'react-native-gesture-handler';
import { LogBox, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { MenuProvider } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage'
import colors from './constants/colors';
import SplashScreen from './screens/SplashScreen'; // Import your SplashScreen component

LogBox.ignoreLogs(['AsyncStorage has been extracted']);
AsyncStorage.clear();

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          "black": require("./assets/fonts/Montserrat-Black.ttf"),
          "blackItalic": require("./assets/fonts/Montserrat-BlackItalic.ttf"),
          "bold": require("./assets/fonts/Montserrat-Bold.ttf"),
          "boldItalic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
          "italic": require("./assets/fonts/Montserrat-Italic.ttf"),
          "light": require("./assets/fonts/Montserrat-Light.ttf"),
          "lightItalic": require("./assets/fonts/Montserrat-LightItalic.ttf"),
          "medium": require("./assets/fonts/Montserrat-Medium.ttf"),
          "mediumItalic": require("./assets/fonts/Montserrat-MediumItalic.ttf"),
          "regular": require("./assets/fonts/Montserrat-Regular.ttf"),
          "semiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
          "semiBoldItalic": require("./assets/fonts/Montserrat-SemiBoldItalic.ttf"),
          "thin": require("./assets/fonts/Montserrat-Thin.ttf"),
          "thinItalic": require("./assets/fonts/Montserrat-ThinItalic.ttf"),
        });
      }
      catch (error) {
        console.log.error();
      }
      finally {
        setTimeout(() => setAppIsLoaded(true), 1500); // Delay the loading by 3 seconds
      }
    };

    prepare();
  }, []);

  if (!appIsLoaded) {
    console.log('!appIsLoaded');
    return <SplashScreen />; // Show the SplashScreen component while the app is loading
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container}>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background,
  },
  label: {
    color: 'black',
    fontSize: 18,
    fontFamily: "regular"
  }
});