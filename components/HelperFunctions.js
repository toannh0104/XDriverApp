import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

export function ValidateEmail(email) {
	//if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return (true)
    //
     alert("You have entered an invalid email address!")
     return (false)
}

export function MatchPasswords(password1, password2) {
	if (password1 === password2) {
		return true
	}
	else
		return false
}

export function ValidateMobileNumber(mobileNumber) {
	if (mobileNumber.length > 0) {
		return true
	}
	alert("Enter a valid mobile number");
	return false
}

export function getSession(key) {
	return new Promise((resolve,reject) => {
		AsyncStorage.multiGet([
			key  
		])
		.then(result=>{
			resolve(result[0][1])
		})
		.catch(ex=>reject(ex))
	})
}

export function clearSession()
{
	AsyncStorage.clear();
}

export function setSession(key, value) {
  return AsyncStorage.multiSet([
							  [key, value]
							 ])
}

export function checkLogin() {
	return new Promise((resolve,reject) => {
		AsyncStorage.multiGet([
			"@spt:userid"
		])
		.then(result=>{
			resolve(result[0][1])
		})
		.catch(ex=>reject(ex))
	})
}