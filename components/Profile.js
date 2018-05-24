import React, { Component } from "react";
import { 
  View,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";

import {
  GetItemfromAsyncStorage
} from './HelperFunctions';

import {
	clearSession, setSession, getSession,
} from './HelperFunctions';

export default class Profile extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      id: '',
      name: '',
      email: '',
      license_number: '',
      commence_date: ''
    };

    this.signOutPressed = this.signOutPressed.bind(this);
  }

  signOutPressed() {
    onSignOut()
    clearSession()
    this.props.navigation.navigate("SignedOut")
  }

  componentWillMount() {
    getSession("@spt:userid").then((value) => {
        this.setState({"id": value})
    });
    getSession("@spt:name").then((value) => {
        this.setState({"name": value});
    });
    getSession("@spt:license_number").then((value) => {
        this.setState({"license_number": value});
    });
    getSession("@spt:commence_date").then((value) => {
        this.setState({"commence_date": value});
    });
    getSession("@spt:email").then((value) => {
        this.setState({"email": value});
    });
  }

  render() {

    var { navigation } = this.props.navigation;

    return(
      <View style={styles.container}>
        <Card title={this.state.name} containerStyle={styles.profileCard}>
          <View
            style={{
              backgroundColor: "#bcbec1",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            <Text style={{ color: "white", fontSize: 28 }}>JD</Text> 
          </View>
          <Button
            backgroundColor="#000000"
            title="SIGN OUT"
            onPress={this.signOutPressed}
          />
        </Card>

        <Card title="User Details">
          <View>
            <Text style={{ marginBottom: 5 }}>License Number: {this.state.license_number}</Text>
            <Text style={{ marginBottom: 5 }}>Email: {this.state.email}</Text>
            <Text style={{ marginBottom: 5 }}>Commencement Date: {this.state.commence_date}</Text>
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    paddingVertical: 20,
    backgroundColor: '#FF7F00'
  },
  profileCard: {
    marginBottom: 10
  },
  userDetailsCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});