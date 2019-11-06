import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import Constants from 'expo-constants';

export default class FormComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      calendarId: '',
      eventId: ''
    }
  }

  static navigationOptions = {
    title: 'Form'
  }

  getPermissions = async () => {
    const status = await Permissions.askAsync(Permissions.CALENDAR);
    if(status != 'granted'){
      await Permissions.getAsync(Permissions.CALENDAR);
    }
  }

  createCalendar = async () => {
    await this.getPermissions();
    if(Constants.platform.android){
      let data = {
        title: 'MyCalendar12324',
        accessLevel: 'read',
        ownerAccount: 'mandar',
        color: 'red',
        sourceId:'Apple',
        name:'myaskjf',
        source: {
            isLocalAccount: true,
            name: 'Android',
            type: 'Android'
        }
      }
      const response = await Calendar.createCalendarAsync(data);
      if(response){
        this.setState({
          calendarId: response
        });
        Alert.alert('Calendar Created successfuly! with id: ', response);
      }else {
        Alert.alert('Error: Fail to create calendar!');
      }
    }else {
      const respo = await Calendar.getDefaultCalendarAsync(Calendar.EntityTypes.EVENT);
      console.log("IOS default Calendar! ", respo);
      Alert.alert('Calendar fetched! ', respo);
      
      let data1 = {
        id: "9C69BF4F-34AC-4CB6-8794-40A2A724088D",
        allowsModifications: true,
        entityType: Calendar.EntityTypes.EVENT,
        source: {
          id: "9C69BF4F-34AC-4CB6-8794-40A2A724088D",
          name : "Default",
          type: "local"
        }
      }

      // let data1 = {
      //   title: 'MyCalendar1232456557',
      //   accessLevel: 'read',
      //   allowsModifications: true,
      //   color: 'black',
      //   entityType:Calendar.EntityTypes.EVENT,
      //   source: {
      //     id:'DD86081B-FD86-401A-9A43-36708346A0DD',
      //     name:'iCloud',
      //     type: 'caldav'
      //   }
      // }
      const response = await Calendar.createCalendarAsync(data1);
      if(response){
        this.setState({
          calendarId: response
        });
        Alert.alert('Calendar Created successfuly! with id: ', response);
      }else {
        Alert.alert('Error: Fail to create calendar!');
      }
    }
  }

  createEvent = async () => {
    await this.getPermissions();
    const details = {
      title: 'My original meeto',
      startDate: new Date(Date.parse('2019-11-07T05:45:00')),
      endDate: new Date(Date.parse('2019-11-08T05:45:00')),
      allDay: true
    }
    const res = await Calendar.createEventAsync(this.state.calendarId, details);
    console.log(JSON.stringify(res));
    Alert.alert('Event created succesfully!');
    this.setState({
      eventId: res
    })
  }

  editEventAsync = async () => {
    await this.getPermissions();
    const mydetails = {
      title: 'My meetto edited',
      startDate: new Date(Date.parse('2019-11-07T06:00:00')),
      endDate: new Date(Date.parse('2019-11-08T06:45:00')),
      allDay: true
    }
    const myres = Calendar.updateEventAsync(this.state.eventId, mydetails, {futureEvents: false, instanceStartDate: new Date(Date.parse('2019-11-10T03:45:00'))});
    console.log("After update event ", myres);
    Alert.alert('Event updated successfully!');
  }

  render(){
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this.createCalendar}>
          <Text style={styles.text}>Create Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.createEvent}>
          <Text style={styles.text}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.editEventAsync}>
          <Text style={styles.text}>Edit Event</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  btn: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    alignItems:'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  }
});
