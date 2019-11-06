import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeComponent from './components/HomeComponent';
import FormComponent from './components/FormComponent';
import MyForm from './components/MyForm';

const MainComponent = createStackNavigator({
Home: { screen: HomeComponent },
MyForm: { screen: MyForm },
Form: { screen: FormComponent },
}, {
  initialRouteName: 'Home',
  headerLayoutPreset: 'center',
  headerTransitionPreset:'center',
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'red',
    },
    headerTitleStyle: {
      textAlign: 'center',
      flexGrow: 1,
    }
  }
});

export default class App extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return (
      <MainComponent />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
