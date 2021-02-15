import axios from 'axios';
import React from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {useState} from 'react/cjs/react.development';
import {
  COLOR_DISABLE,
  COLOR_MAIN,
  FONT_BOLD,
  FONT_REG,
} from '../../../utils/constans';
import {Picker} from '@react-native-picker/picker';
import {API_URL} from '@env';
const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const regexPwd = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [store, setStore] = useState('');
  const [role, setRole] = useState(1);
  const [errorForm, setErrorForm] = useState('');
  const handleSubmit = () => {
    setErrorForm('');
    if (name === '' || email === '' || password === '') {
      return setErrorForm('empty');
    } else if (name.length < 3 || name.length > 15) {
      return setErrorForm('errorname');
    } else if (!regexEmail.test(email)) {
      return setErrorForm('errormail');
    } else if (password.length < 4 || password.length > 12) {
      return setErrorForm('errorpass');
    } else if (!regexPwd.test(password)) {
      return setErrorForm('strongpass');
    }
    const data = {
      user_name: name,
      email: email,
      user_password: password,
      level_id: role,
      store_name: store,
    };
    axios
      .post(`${API_URL}/auth/signup`, data)
      .then(async (res) => {
        console.log(res);
        Alert.alert(
          'Register',
          'Register Berhasil',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
        navigation.navigate('Login');
      })
      .catch((err) => {
        console.log(err);
        console.log('erro disini');
      });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>
        <Text
          style={{color: COLOR_MAIN, textAlign: 'center', marginHorizontal: 5}}>
          {errorForm == 'empty'
            ? 'Please Fill All Form Input '
            : errorForm == 'errorname'
            ? 'Name Only Min 3 and Max 10 Character'
            : errorForm == 'errormail'
            ? 'Please enter email correctly'
            : errorForm == 'errorpass'
            ? 'Enter Password Min 4 and Max 15'
            : errorForm == 'strongpass'
            ? 'Password should at least 1 LowCase (a-z) , 1 UpperCase (A-Z), 1 Number (0-9)'
            : ''}
        </Text>
        <View>
          <View style={{backgroundColor: '#fff', marginBottom: 10}}>
            <Text style={{fontSize: 14, color: COLOR_DISABLE}}>Pick Role</Text>
            {/* DROPDOWN */}
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => {
                setRole(itemValue);
              }}>
              <Picker.Item label="Seller" value={1} />
              <Picker.Item label="Customer" value={2} />
            </Picker>
          </View>
          <TextInput
            style={styles.form}
            placeholder="Name"
            defaultValue={name}
            onChangeText={(name) => setName(name)}
          />
          <TextInput
            style={styles.form}
            placeholder="Email"
            defaultValue={email}
            onChangeText={(email) => setEmail(email)}
          />
          {role == 1 && (
            <TextInput
              style={styles.form}
              placeholder="Store Name"
              defaultValue={store}
              onChangeText={(store) => setStore(store)}
            />
          )}
          <TextInput
            secureTextEntry
            style={styles.form}
            placeholder="Password"
            defaultValue={password}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity>
            <Text
              style={styles.forgotPas}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.containerKeyboard}>
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}>
            <View style={styles.button}>
              <Text style={styles.textBtn}>SIGN UP</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default Register;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
  },
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
    width: windowWidth * 0.85,
    borderBottomColor: COLOR_MAIN,
    borderBottomWidth: 1,
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
