import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage
} from 'react-native';

import MainComponent from './components/MainComponent';
import {
    SignedOut,
    SignedIn
} from './router';

import { isSignedIn } from './auth';
import { createRootNavigator } from './router';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentDidMount() {
        isSignedIn()
            .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
            .catch(err => alert("An error occured. Please try again."))
    }

    render() {
        const { checkedSignIn, signedIn } = this.state;

        if (!checkedSignIn) {
            return null;
        }

        const Layout = createRootNavigator(signedIn);
        return <Layout />;
    }
}
