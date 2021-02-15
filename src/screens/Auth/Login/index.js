import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Text, View , ToastAndroid} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {COLOR_MAIN, FONT_BOLD, FONT_REG} from '../../../utils/constans';
import {API_URL} from '@env';

//redux
import {connect} from 'react-redux';
import {login} from '../../../utils/redux/action/authAction';

const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const Login = ({navigation, login}) => {
  const [email, setEmail] = useState('');
  const [ fail , setFail ] = useState(false);
  const [ errorForm , setErrorForm] = useState('');
  const [password, setPassword] = useState('');
  const [loading , setLoading] = useState(false);
  const successToast = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Login Succesfully',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
      25,
      50,
    );
  };
  const handleSubmit = () => {
    setErrorForm('');
    setFail(false);
    if(email === '' || password === ''){
      return setErrorForm('empty') , setLoading(false);
    } else if (!regexEmail.test(email)) {
      return setErrorForm('errormail') , setLoading(false);
    }
    const data = {
      email: email,
      user_password: password,
    };
    axios
      .post(`${API_URL}/auth/login`, data)
      .then(async (res) => {
        console.log(res.data.data.token);
        console.log(res.data.data.user_id);
        console.log(res.data.data.level);
        console.log(res.data.data.photo_user);
        console.log(res.data.data.email);
        console.log(res.data.data.phone);
        console.log(res.data.data.birth_date)
        console.log('Namanya' + res.data.data.user_name);
        const token = res.data.data.token;
        const id = res.data.data.user_id;
        const level = res.data.data.level;
        const nameUser = res.data.data.user_name;
        const photo = res.data.data.photo_user;
        const email_user = res.data.data.email;
        const phone = res.data.data.phone;
        const birth_date = res.data.data.birth_date;
        login(token, id, level, nameUser , photo , email_user , phone , birth_date);
        successToast();
        console.log('done');
        navigation.navigate('MainApp');
      })
      .catch((err) => {
        console.log(err);
        console.log('error disini');
        setFail(true);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={{color: COLOR_MAIN}}>
        {errorForm == 'empty' ? 'Fill All Form please' : errorForm === 'errormail'
        ? 'Please enter email correctly' : ''}
      </Text>
      <View>
        <View style = {fail ? {...styles.form , bordemBotomColor: '#FF5B37'} : styles.form}>
        <TextInput
          style={styles.form}
          
          placeholder="Email"
          defaultValue={email}
          onChangeText={(email) => setEmail(email)}
        />
        </View>
        <View style = {fail ? {...styles.form , bordemBotomColor: '#FF5B37'} : styles.form}>
        <TextInput
          secureTextEntry
          style={styles.form}
          placeholder="Password"
          defaultValue={password}
          onChangeText={(password) => setPassword(password)}
        />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ForgotPass');
          }}>
          <Text style={styles.forgotPas}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Text style={{
        color: COLOR_MAIN, 
        fontFamily: FONT_BOLD,
        marginBottom: 2,
      }}>
      {fail ? 'Email or Password Invalid' : ''}
      </Text>
{ !loading ? (<TouchableOpacity onPress={()=> {setLoading(true) , handleSubmit()}}>
        <View style={styles.button}>
          <Text style={styles.textBtn}>Login</Text>
        </View>
      </TouchableOpacity>) : 
      (
        <View style={styles.button}>
          <ActivityIndicator size='large' color='white' />
        </View>
      )}
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Text>Don't have an account?</Text>
        <Text
          style={{marginLeft: 5, color: COLOR_MAIN}}
          onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (token, id, level, nameUser , photo , email_user , phone , birth_date) =>
      dispatch(login(token, id, level, nameUser , photo , email_user , phone , birth_date)),
  };
};

export default connect(null, mapDispatchToProps)(Login);

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
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_MAIN,
    width: windowWidth * 0.85,
    marginTop: 30,
  },
});
