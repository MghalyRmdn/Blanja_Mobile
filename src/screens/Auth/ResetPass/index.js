import React, {useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {COLOR_MAIN, COLOR_WARN, FONT_BOLD, FONT_REG} from '../../../utils/constans';
import {API_URL} from '@env';
import axios from 'axios';

const regexPwd = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

const ResetPass = ({navigation, route}) => {
  const {user_id} = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const handleSubmit = () => {
    setErrorForm('');
    if (password == '' || confirmPassword == '') {
      return setErrorForm('empty');
    } else if (password.length < 4 || password.length > 12) {
      return setErrorForm('errorpass');
    } else if (password !== confirmPassword) {
      return setErrorForm('errorconfirm');
    } else if (!regexPwd.test(password));

    const data = {
      user_password: password,
    };
    axios
      .post(`${API_URL}/auth/resetpass/${user_id}`, data)
      .then((res) => {
        console.log(res);
        Alert.alert(
          'Reset Password',
          'Reset Password Berhasil',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
        navigation.navigate('Login');
      })
      .catch((err) => {
        console.log(err);
        console.log('error disini');
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={{color: COLOR_WARN, textAlign: 'center' , fontSize: 16 , marginBottom: 5}}>
          {errorForm == 'empty'
            ? 'Please enter new password'
            : errorForm == 'errorpass'
            ? 'Enter Password Min 4 and Max 12'
            : errorForm == 'errorconfirm'
            ? `Password not match`
            : errorForm == 'fail'
            ? 'Password should at least have 1 LowCase (a-z), 1 UpperCase (A-Z), 1 Number (0-9)'
            : ''}
        </Text>
      <View>
        <Text style={{color: '#F01F0E'}}>
          You need to change your password to activate your account
        </Text>
        <TextInput
          secureTextEntry
          style={styles.form}
          placeholder="New Password"
          defaultValue={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          secureTextEntry
          style={styles.form}
          placeholder="Confirmation New Password"
          defaultValue={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
        />
       
      </View>
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.button}>
          <Text style={styles.textBtn}>Reset Password</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPass;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_BOLD,
    fontSize: 34,
    marginTop: windowHeight * 0.08,
    marginBottom: windowHeight * 0.08,
  },
  container: {
    paddingHorizontal: windowWidth * 0.04,
  },
  form: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 4,
    borderBottomColor: COLOR_MAIN,
    borderBottomWidth: 1,
    width: windowWidth * 0.85,
  },
  button: {
    backgroundColor: COLOR_MAIN,
    alignItems: 'center',
    height: 48,
    paddingVertical: 14,
    borderRadius: 25,
  },
  textBtn: {
    color: '#fff',
    fontFamily: FONT_REG,
    fontSize: 14,
  },
  forgotPas: {
    alignSelf: 'flex-end',
    fontFamily: FONT_REG,
    marginBottom: 32,
    marginTop: 5,
  },
});
