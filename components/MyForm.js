import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import Constants from 'expo-constants';
import { fetchEvents1, addEvent1, updateEvent1, deleteEvent1 } from '../MyFunctions/functions';

function Separator(){
    return (
        <View style={styles.separator}/>
    );
}

// const RenderEvents = ({ id, event, getEventId}) => {
//     return(
//         <View key={id}>
//             <TouchableOpacity onPress={() => getEventId(event)}>
//                 <Text>
//                     {id}
//                 </Text>
//                 <Text>
//                     {event.title}
//                 </Text>
//                 <Text>
//                     Start Date:- {event.startDate}
//                 </Text>
//                 <Text>
//                     End date:- {event.endDate}
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     );
// }Create, view or edit events in react native using the standard iOS / Android dialogs

export default class MyForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: '',
            startDate: null,
            endDate: null,
            calendarId: null,
            eventId: null,
            allEvents: [],
            id: null,
            show: false,
            update: false
        }
    }

    static navigationOptions = {
        title: 'My Form'
    }

    componentDidMount = async () => {
        const data = await fetchEvents1();
        console.log(data);
        if (!data.error){
            // this.state.allEvents.push(data);
            // console.log(this.state.allEvents);
           await this.setState({
                allEvents: data
            });
            console.log(this.state.allEvents);
        }else {
            Alert.alert("Something went wrong!");
        }
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

    updateEvent = async () => {
        let sd = this.state.startDate;
        let ed = this.state.endDate;
        let startdate = sd.split(' ');
        let enddate = ed.split(' ');
        const title=this.state.title;
        const startDate=startdate[0]+'T'+startdate[1];
        const endDate=enddate[0]+'T'+enddate[1];
        console.log(title, startDate, endDate);
        await this.editEventAsync(title, new Date(Date.parse(startDate) - (5.5*60*60*1000)), new Date(Date.parse(endDate) - (5.5*60*60*1000)));
    }

    deleteEvent = async () => {
        let id = this.state.id;
        let eventId = this.state.eventId;

        const data = await Calendar.deleteEventAsync(eventId);
        console.log("Event Deleted successfully", data);

        const d = await deleteEvent1(id);
        console.log("Event deleted successfuly! ", d);
        Alert.alert('Event deleted successfuly!');

    }

    getPermissions = async () => {
        const status = await Permissions.askAsync(Permissions.CALENDAR);
        if(status != 'granted'){
          await Permissions.getAsync(Permissions.CALENDAR);
        }
    }
    
    // getAllEventAsync = async () => {
    //     // const data = await Calendar.getEventAsync('335', new Date(Date.parse('2019-10-01T05:00') - (5.5*60*60*1000)), new Date(Date.parse('2019-12-05T05:00') - (5.5*60*60*1000)));
    //     // console.log(data.title);

    //     const data = await Calendar.deleteEventAsync('335');
    //     console.log("Event Deleted successfully", data);
    // }

    createCalendar = async () => {
        await this.getPermissions();
        if(Constants.platform.android){
                let data = {
                    title: 'MeetoCalendar',
                    accessLevel: 'read',
                    ownerAccount: 'mandar',
                    color: 'pink',
                    sourceId:'Apple',
                    name:'meeto',
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
        // const data = addEvent(details)
        const res = await Calendar.createEventAsync(this.state.calendarId, details);
        console.log(JSON.stringify(res));
        Alert.alert('Event Added to local calendar!');
        await this.setState({
            eventId: res
        });

        const detailsToDB = {
            calendarId: this.state.calendarId,
            eventId: this.state.eventId,
            title,
            startDate,
            endDate,
        }
        let response = await addEvent1(detailsToDB);
        console.log(response);
        if (!response.error){
            Alert.alert('Data added to db successfully!');
        }else {
            Alert.alert('Something went wrong!');
        }
    }
    
    editEventAsync = async (title, startDate, endDate) => {
        console.log(title, startDate, endDate);
        await this.getPermissions();
        const mydetails = {
            title,
            startDate,
            endDate,
        }
        const myres = await Calendar.updateEventAsync(this.state.eventId, mydetails, {futureEvents: false, instanceStartDate: new Date(Date.parse(startDate) - (5.5*60*60*1000))});
        console.log("After update event ", myres);
        this.setState({ eventId: myres });
        Alert.alert('Event updated successfully!');

        const d = {
            id: this.state.id,
            title,
            startDate,
            endDate,
            calendarId: this.state.calendarId,
            eventId: this.state.eventId
        }
        const data = await updateEvent1(d);
        console.log(data);
    }
    
    getEventId(details){
        // console.log(JSON.stringify(details.title));
        this.setState({
            id: details.id,
            calendarId: details.calendarId,
            eventId: details.eventId,
            title: details.title,
            startDate: details.startDate,
            endDate: details.endDate,
            update: true,
        })
    }

    render(){
        // const MyEvents = allEvents.map((event, id) => <RenderEvents id={id} eventdata={event} getEventId={this.getEventId(event)} />);
        if (this.state.show){
            return (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ show: false})}>
                        <Text>
                            Back
                        </Text>
                    </TouchableOpacity>
                    <View>
                    <Text>
                        {this.state.startDate}
                    </Text>
                    <Text>
                        Start Date:- {this.state.startDate}
                    </Text>
                    <Text>
                        End date:- {this.state.endDate}
                    </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ show: false, update: true })}>
                        <Text>
                            Update
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }else {
            return (
                <ScrollView style={StyleSheet.container}>
                    <TextInput
                        style={styles.input}
                        value={this.state.title}
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
                        onDateChange={(date) => this.setState({ startDate: date })}
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
                        onDateChange={(date) => this.setState({ endDate: date })}
                    />
                    <Separator />
                    <View style={{ padding: 20 }}>
                        { this.state.update ? 
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={this.updateEvent}>
                                <Text style={styles.text2}>Update</Text>
                            </TouchableOpacity> 
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={this.deleteEvent}>
                                <Text style={styles.text2}>Delete</Text>
                            </TouchableOpacity> 
                        </View>
                        : 
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={this.addEvent}>
                            <Text style={styles.text2}>Submit</Text>
                        </TouchableOpacity>
                    }
                    </View>

                    { 
                        this.state.allEvents.map(event => 
                        <View style={{ margin: 20 }}>
                            <TouchableOpacity style={{flex: 1, height: 30, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'red'}} onPress={this.getEventId.bind(this, event)}>
                                <Text style={styles.text2}>{event.title}</Text>
                                <Text style={styles.text2}>{event.startDate}</Text>
                                <Text style={styles.text2}>{event.endDate}</Text>
                            </TouchableOpacity>
                        </View>
                        )
                    }
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
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