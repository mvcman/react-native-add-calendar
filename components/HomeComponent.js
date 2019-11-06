import React, { Component } from 'react';
import { Text, View, TouchableOpacity,StyleSheet } from 'react-native';
import Moment from 'moment';

export default class HomeComponent extends Component {

    static navigationOptions = {
        title: 'Home',
    }
    // sendDate = () => {
    //     Moment.locale('en');
    //     var dt = new Date();
    //     console.log(Moment.toDate());
    // }
    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('MyForm')}>
                    <Text style={styles.text}>
                        Go To Form
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: '90%',
        height: 50,
        margin: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    }
});