import React, { Component } from 'react';
import {
	createStackNavigator,
	createBottomTabNavigator,
	createSwitchNavigator
} from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome';

// import FontAwesome, { Icons } from 'react-native-fontawesome';
//import { Icon } from 'react-native-elements';

import SignUp from './components/SignUp';
import FileUploadAfterSignUp from './components/FileUploadAfterSignUp';
import SignUpSuccessScreen from './components/SignUpSuccessScreen';

import SignIn from './components/SignIn'; 
import ForgotPassword from './components/ForgotPassword';

// import Home from './components/Home';
import Profile from './components/Profile';
import Trucks from './components/Trucks';

import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import Home from './components/Home';

import TruckEntrySelectionPage from './components/TruckEntrySelectionPage';
import WorksheetEntry from './components/WorksheetEntry';
import MaintainenceRecord from './components/MaintainenceRecord';

import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';

export const SignUpStack = createStackNavigator({
	SignUp: {
		screen: SignUp,
		navigationOptions: {
			header: null
		}
	},
	FileUploadAfterSignUp: {
		screen: FileUploadAfterSignUp,
		navigationOptions: {
			header: null
		}
	},
	SignUpSuccessScreen: {
		screen: SignUpSuccessScreen,
		navigationOptions: {
			header: null
		}
	}
})

export const SignedOut = createStackNavigator({
	SignIn: {
		screen: SignIn,
		navigationOptions: {
			header: null
		}
	},
	SignUp: {
		screen: SignUpStack,
		navigationOptions: {
			header: null
		}
	},
	ForgotPassword: {
		screen: ForgotPassword,
		navigationOptions: {
			header: null
			// title: 'Forgot Password',
			// headerStyle: { 
			// 	backgroundColor: '#FF7F00'
			// }
		}
	}
});

export const TrucksStack = createStackNavigator({
	Trucks: {
		screen: Trucks,
		navigationOptions: {
			title: "Trucks"
		}
	},
	TruckOptions: {
		screen: TruckEntrySelectionPage,
		navigationOptions: {
			title: "Worklog"
		}
	},
	Worksheet: {
		screen: WorksheetEntry,
		navigationOptions: {
			title: "Worksheet"
		}
	},
	MaintainenceRecord: {
		screen: MaintainenceRecord,
		navigationOptions: {
			title: "Incident Log"
		},
	}
},
{
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#FF7F00',
			borderBottomWidth: 0
		},
		headerTintColor: '#FFFFFF'
	},
})

export const ProfileStack = createStackNavigator({
	Profile: {
		screen: Profile,
		navigationOptions: {
			title: "Profile"
		}
	}
},
{
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#FF7F00',
			borderBottomWidth: 0
		},
		headerTintColor: '#FFFFFF',
	},
})

export const HomeStack = createStackNavigator({
	More: {
		screen: Home,
		navigationOptions: {
			title: "Home"
		}
	},
	AboutUs: {
		screen: AboutUs,
		navigationOptions: {
			title: "Terms of use"
		}
	},
	ContactUs:{
		screen: ContactUs,
		navigationOptions: {
			title: "Contact Us"
		}
	},
	PrivacyPolicy: {
		screen: PrivacyPolicy,
		navigationOptions: {
			title: "Privacy Policy"
		}
	},
	EditProfile: {
		screen: EditProfile,
		navigationOptions: {
			title: "Edit Profile"
		}
	},
	ChangePassword: {
		screen: ChangePassword,
		navigationOptions: {
			title: "Change Password"
		}
	}
},
{
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#FF7F00',
			borderBottomWidth: 0
		},
		headerTintColor: '#FFFFFF'
	},
})

export const SignedIn = createBottomTabNavigator({
	More: {
		screen: HomeStack,
		navigationOptions: {
			tabBarLabel: "Home"
		}
	},
	Trucks: {
		screen: TrucksStack,
		navigationOptions: {
			tabBarLabel: "Trucks"
		},
	}
},
{
	navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'More') {
          iconName = 'home';
        } else if (routeName === 'Trucks') {
          iconName = 'truck';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (<Icon name={iconName} size={30} color={tintColor} />);
      },
    }),
	tabBarOptions: {
		showIcon: true,
		style: {
			backgroundColor: '#FF7F00'
		},
		activeTintColor: 'white',
      	inactiveTintColor: 'black',
	},
	tabBarPosition: 'bottom'
});

export const createRootNavigator = (signedIn = false) => {
	return createSwitchNavigator(
		{
			SignedIn: {
				screen: SignedIn
			},
			SignedOut: {
				screen: SignedOut
			}
		},
		{
			initialRouteName: signedIn ? "SignedIn" : "SignedOut"
		}
	);
};