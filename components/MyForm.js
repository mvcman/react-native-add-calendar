import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import Constants from 'expo-constants';

function Separator(){
    return (
        <View style={styles.separator}/>
    );
}

export default class MyForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: '',
            startDate: null,
            endDate: null,
            allDay: true,
            show: false,
            calendarId: null,
            eventId: null
        }
    }

    static navigationOptions = {
        title: 'My Form'
    }

    addEvent = async () => {
        let sd = this.state.startDate;
        let ed = this.state.endDate;
        let startdate = sd.split(' ');
        let enddate = ed.split(' ');
        const title=this.state.title;
        const startDate=startdate[0]+'T'+startdate[1];
        const endDate=enddate[0]+'T'+enddate[1];
        console.log(title, startDate, endDate);
        await this.createCalendar();
        await this.createEvent(title, new Date(Date.parse(startDate) - (5.5*60*60*1000)), new Date(Date.parse(endDate) - (5.5*60*60*1000)));
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
                    title: 'MeetoCalendar',
                    accessLevel: 'read',
                    ownerAccount: 'mandar',
                    color: 'black',
                    sourceId:'Apple',
                    name:'myaskjf',
                    allowedReminders:[Calendar.AlarmMethod.ALARM, Calendar.AlarmMethod.ALERT],
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
    
    createEvent = async (title, startDate, endDate) => {
        await this.getPermissions();
        const details = {
            title,
            startDate,
            endDate,
            alarms: [{ relativeOffset: -10, method:Calendar.AlarmMethod.ALERT }],
            notes: "mandar birthday",
            organizerEmail: 'mandar@gmail.com',
            guestCanModify: true,
        }
        const res = await Calendar.createEventAsync(this.state.calendarId, details);
        console.log(JSON.stringify(res));
        Alert.alert('Event created succesfully!');
        this.setState({
            eventId: res
        })
    }
    
    editEventAsync = async (title, startDate, endDate, allDay) => {
        await this.getPermissions();
        const mydetails = {
            title,
            startDate,
            endDate,
            allDay
        }
        const myres = Calendar.updateEventAsync(this.state.eventId, mydetails, {futureEvents: false, instanceStartDate: new Date(Date.parse('2019-11-10T03:45:00'))});
        console.log("After update event ", myres);
        Alert.alert('Event updated successfully!');
    }
    
    render(){
        if (!this.state.show){
            return (
                <View style={StyleSheet.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter title of event"
                        onChangeText={(text) => this.setState({title: text})}
                    />
                    <Separator />
                    <Text style={styles.text}>Select Start Date:- </Text>
                    <DatePicker
                        style={{ margin: 20, width: '90%', height: 50 }}
                        date={this.state.startDate}
                        mode="datetime"
                        placeholder="select date and time"
                        minDate="2017-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        },
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {this.setState({ startDate: date })}}
                    />
                    <Separator />
                    <Text style={styles.text}>Select End Date:- </Text>
                    <DatePicker
                        style={{ margin: 20, width: '90%', height: 50 }}
                        date={this.state.endDate}
                        mode="datetime"
                        placeholder="select date and time"
                        minDate="2017-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        },
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {this.setState({ endDate: date })}}
                    />
                    <Separator />
                    <View style={{ padding: 20 }}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={this.addEvent}>
                            <Text style={styles.text2}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else {
            return(
                <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{this.state.title}</Text>
                    <Text style={styles.text}>{this.state.startDate}</Text>
                    <Text style={styles.text}>{this.state.endDate}</Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        margin: 10,
    },
    text: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 15,
        marginHorizontal: 20
    },
    text2: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginHorizontal: 20
    },
    separator: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderBottomColor: 'red',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: 'red',
        alignItems:'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 10
    }
});