import axios from 'axios';
import React, {useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {COLOR_MAIN, FONT_BOLD, FONT_REG} from '../../../utils/constans';
import {API_URL} from '@env';
const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const ForgotPass = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errorForm , setErrorForm ] = useState('');
  const handleSubmit = () => {
    setErrorForm('');
    if(email === '' ) {
      return setErrorForm('empty');
    } else if( !regexEmail.test(email)){
      return setErrorForm('errormail')
    }
    const data = {
      email: email,
    };
    axios
      .post(`${API_URL}/auth/sendemailuser`, data)
      .then(async (res) => {
        Alert.alert(
          'Forgot Password',
          'Kode OTP Berhasil Dikirim',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );

        console.log(res.data.data);
        const user_id = res.data.data;
        navigation.navigate('otp', {user_id});
      })
      .catch((err) => {
        console.log(err);
        console.log('error disini');
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={{color: COLOR_MAIN}}>
        {errorForm == 'empty' ? 'Please Enter Your Email' :
        errorForm == 'errormail' ? 'Enter Email with Correct' : ''}
      </Text>
      <Text>
        Please, enter your email address. You will receive a otp code to create
        a new password via email.
      </Text>
      <TextInput
        style={styles.form}
        placeholder="Email"
        defaultValue={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TouchableOpacity onPress={()=> {
        handleSubmit()}}>
        <View style={styles.button}>
          <Text style={styles.textBtn}>SEND</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPass;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: windowWidth * 0.04,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: 34,
    marginTop: windowHeight * 0.08,
    marginBottom: windowHeight * 0.08,
  },
  form: {
    backgroundColor: '#fff',
    marginBottom: 8,
    marginTop: 16,
    borderRadius: 4,
    borderBottomColor: COLOR_MAIN,
    borderBottomWidth : 1,
    width: windowWidth * 0.85,
  },
  button: {
    backgroundColor: COLOR_MAIN,
    alignItems: 'center',
    height: 48,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: windowHeight * 0.08,
  },
  textBtn: {
    color: '#fff',
    fontFamily: FONT_REG,
    fontSize: 14,
  },
});
