import React, {useRef, useEffect, createRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ToastAndroid,
} from 'react-native';
import {Button} from 'native-base';
import {NotifSetting} from '../../components';
import {
  COLOR_DISABLE,
  FONT_BOLD,
  FONT_LIGHT,
  FONT_MED,
  FONT_REG,
  COLOR_MAIN,
  COLOR_BACKGROUND,
  COLOR_WHITE,
  COLOR_INPUT,
  COLOR_DARK,
  COLOR_ERROR,
} from '../../utils/constans';
// import {ChangePassword} from '../../components'
import {useSelector} from 'react-redux';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/AntDesign';
import {useForm, Controller} from 'react-hook-form';
// import {useSelector} from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';
import {API_URL} from '@env';
import axios from 'axios';

const SettingProfile = ({navigation}) => {
  const actionSheetRef = createRef();
  const [securePassword1, setSecurePassword1] = useState(true);
  const [securePassword2, setSecurePassword2] = useState(true);
  const [securePassword3, setSecurePassword3] = useState(true);
  const [profile, setProfile] = useState({});
  const [ phone , setPhoneNo ]  = useState(0);
  const [ userName , setName ] = useState('');
  const [ birthday , setBirthday ] = useState(0);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [fail, setFail] = useState(false);
  const user_id = useSelector((state) => state.auth.id);
  const emailUser = useSelector((state) => state.auth.email_user);
  
  const handleShowPassword1 = () => {
    setSecurePassword1(!securePassword1);
  };
  const handleShowPassword2 = () => {
    setSecurePassword2(!securePassword2);
  };
  const handleShowPassword3 = () => {
    setSecurePassword3(!securePassword3);
  };
  const getProfile = () => {
    axios
      .get(`${API_URL}/user/${user_id}`)
      .then((res) => {
        console.log(res.data.data[0]);
        setProfile(res.data.data[0]);
        const nameUser = res.data.data[0].user_name;
        const phoneNo = res.data.data[0].phone_num;
        const birthdate = res.data.data[0].birth_date
        setBirthday(birthdate.substr(0,10));
        setName(nameUser);
        setPhoneNo(phoneNo);
        console.log(nameUser);
        console.log(phoneNo);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const birthDay = profile.birth_date
  useEffect(() => {
    getProfile();
  }, [navigation]);
  console.log(emailUser);
  console.log('testing', oldPassword);
  console.log('trykids', newPassword);
  const changePass = () => {
    const regexPwd = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
    if (oldPassword == '') {
      setErrMsg('Old Password not be null');
    } else if (newPassword1 == '') {
      setErrMsg('New Password not be null');
    } else if (newPassword == '') {
      setErrMsg('Repeat Password not be null');
    } else if (newPassword1 !== newPassword) {
      setErrMsg('Password is not match');
    } else if (!regexPwd.test(newPassword1) && !regexPwd.test(newPassword)) {
      setErrMsg(
        `Password must contain at least 1 lowercase and 1 uppercase alphabetical, 1 numerical`,
      );
    } else {
      const data = {
        email: emailUser,
        old_password: oldPassword,
        new_password: newPassword,
      };
      axios
        .patch(API_URL + '/auth/changepass', data)
        .then((res) => {
          const changePassMsg = res.data.message;
          navigation.navigate('Profile');
          console.log(changePassMsg);
        })
        .catch((err) => {
          console.log(err);
          setFail(true);
        });
    }
  };
  const {control, handleSubmit, errors, getValues} = useForm();
  return (
    <View style={styles.container}>
      <Text style={{fontFamily: FONT_BOLD, fontSize: 34, marginVertical: 15}}>
        Settings
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontFamily: FONT_MED, fontSize: 16}}>
          Personal Information
        </Text>
        <TouchableOpacity>
          <Text
            onPress={() => navigation.navigate('ChangePersonal',{user_name: userName ,phone,birthday })}
            style={{
              fontFamily: FONT_LIGHT,
              fontSize: 14,
              color: COLOR_DISABLE,
            }}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fullname}>
        <Text style={{color: COLOR_DARK, fontFamily: FONT_REG}}>
          {userName}
        </Text>
      </View>
      <View style={styles.fullname}>
        <Text style={{color: COLOR_DISABLE, fontFamily: FONT_REG}}>
          Date of Birth
        </Text>
        <Text>{birthday}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 50,
          marginBottom: 5,
        }}>
        <Text style={{fontFamily: FONT_MED, fontSize: 16}}>Password</Text>
        <TouchableOpacity>
          <Text
            onPress={() => {
              actionSheetRef.current?.setModalVisible();
            }}
            style={{
              fontFamily: FONT_LIGHT,
              fontSize: 14,
              color: COLOR_DISABLE,
            }}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fullname}>
        <Text style={{color: COLOR_DISABLE, fontFamily: FONT_REG}}>
          Password
        </Text>
        <Text style={{color: COLOR_DISABLE, fontFamily: FONT_REG}}>
          ****************
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontFamily: FONT_MED,
            fontSize: 16,
            marginTop: 45,
            marginBottom: 20,
          }}>
          Notifications
        </Text>
      </View>
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.containers}>
          <View style={styles.open}>
            <Text
              style={{
                fontFamily: FONT_BOLD,
                alignSelf: 'center',
                fontSize: 18,
                marginTop: 20,
              }}>
              Change Password
            </Text>
          </View>
          <View>
            <Text style={{color: 'red', fontSize: 14, marginHorizontal: 10}}>
              {fail ? 'Your old password wrong!' : errMsg}
            </Text>
            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <Input
                  placeholder="Current Password"
                  leftIcon={<Icon name="lock" size={20} color={COLOR_MAIN} />}
                  rightIcon={
                    <Icon
                      onPress={handleShowPassword1}
                      name={securePassword1 ? 'eye-off' : 'eye'}
                      size={18}
                      color={COLOR_DISABLE}
                    />
                  }
                  inputContainerStyle={styles.input}
                  inputStyle={styles.input}
                  placeholderTextColor={COLOR_INPUT}
                  secureTextEntry={securePassword1}
                  onBlur={onBlur}
                  onChangeText={(oldPassword) => setOldPassword(oldPassword)}
                  value={oldPassword}
                />
              )}
              name="password"
              rules={{
                required: true,
                pattern: {
                  value: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/,
                  message:
                    'Password must contain at least 1 number, and be longer than 8 charaters',
                },
              }}
              defaultValue=""
            />
            {errors.password && errors.password.type === 'required' && (
              <Text style={{color: 'red', marginTop: -25, marginLeft: 25}}>
                Required.
              </Text>
            )}
            {errors.password && errors.password.type === 'pattern' && (
              <Text style={{color: 'red', marginTop: -20, marginLeft: 25}}>
                {errors.password.message}
              </Text>
            )}

            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <Input
                  placeholder="New Password"
                  leftIcon={<Icon name="lock" size={20} color={COLOR_INPUT} />}
                  rightIcon={
                    <Icon
                      onPress={handleShowPassword2}
                      name={securePassword2 ? 'eye-off' : 'eye'}
                      size={18}
                      color={COLOR_INPUT}
                    />
                  }
                  inputContainerStyle={styles.input}
                  inputStyle={styles.input}
                  placeholderTextColor={COLOR_INPUT}
                  secureTextEntry={securePassword2}
                  onBlur={onBlur}
                  onChangeText={(newPassword1) => setNewPassword1(newPassword1)}
                  value={newPassword1}
                />
              )}
              name="newPassword"
              rules={{
                required: true,
                pattern: {
                  value: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/,
                  message:
                    'Password must contain at least 1 number, and be longer than 8 charaters',
                },
              }}
              defaultValue=""
            />
            {errors.newPassword && errors.newPassword.type === 'required' && (
              <Text style={{color: 'red', marginTop: -25, marginLeft: 25}}>
                Required.
              </Text>
            )}
            {errors.newPassword && errors.newPassword.type === 'pattern' && (
              <Text style={{color: 'red', marginTop: -20, marginLeft: 25}}>
                {errors.newPassword.message}
              </Text>
            )}

            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <Input
                  placeholder="Repeat Password"
                  leftIcon={<Icon name="lock" size={20} color={COLOR_INPUT} />}
                  rightIcon={
                    <Icon
                      onPress={handleShowPassword3}
                      name={securePassword3 ? 'eye-off' : 'eye'}
                      size={18}
                      color={COLOR_INPUT}
                    />
                  }
                  inputContainerStyle={styles.input}
                  inputStyle={styles.input}
                  placeholderTextColor={COLOR_INPUT}
                  secureTextEntry={securePassword3}
                  onBlur={onBlur}
                  onChangeText={(newPassword) => setNewPassword(newPassword)}
                  value={newPassword}
                />
              )}
              name="newPasswordRepeat"
              rules={{
                required: true,
                pattern: {
                  value: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/,
                  message:
                    'Password must contain at least 1 number, and be longer than 8 charaters',
                },
              }}
              defaultValue=""
            />
            {errors.newPasswordRepeat &&
              errors.newPasswordRepeat.type === 'required' && (
                <Text style={{color: 'red', marginTop: -25, marginLeft: 25}}>
                  Required.
                </Text>
              )}
            {errors.newPasswordRepeat &&
              errors.newPasswordRepeat.type === 'pattern' && (
                <Text style={{color: 'red', marginTop: -20, marginLeft: 25}}>
                  {errors.newPasswordRepeat.message}
                </Text>
              )}

            {getValues('newPassword') !== getValues('newPasswordRepeat') && (
              <Text style={styles.textFormError}>Password didn't match.</Text>
            )}
          </View>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              height: 50,
              width: 343,
              borderRadius: 10,
              backgroundColor: COLOR_MAIN,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}
            onPress={() => setModalVisible(true)}>
            <Text style={{color: 'white'}}>Change Password</Text>
          </TouchableOpacity>
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Are you sure want to change password?
                </Text>
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}>
                  <Button
                    style={{
                      ...styles.closeButton,
                      backgroundColor: 'lightgrey',
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={{...styles.textStyle, color: 'black'}}>
                      No
                    </Text>
                  </Button>
                  <Button
                    style={styles.closeButton}
                    onPress={() => {
                      changePass();
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>Yes</Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ActionSheet>
      <NotifSetting title="Sales" btn={true} />
      <NotifSetting title="New arrivals" btn={false} />
      <NotifSetting title="Delivery status changes" btn={false} />
    </View>
  );
};

export default SettingProfile;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: windowWidth * 0.05,
  },

  fullname: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 5,
  },
  open: {
    height: windowHeight * 0.1,
    marginHorizontal: windowWidth * 0.07,
    backgroundColor: 'white',
    borderTopRightRadius: 15,
  },
  containers: {
    backgroundColor: COLOR_BACKGROUND,
    marginHorizontal: windowWidth * 0.2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },

  input: {
    display: 'flex',
    alignSelf: 'center',
    width: 300,
    fontSize: 16,
    borderColor: COLOR_INPUT,
  },
  buttonSubmit: {
    display: 'flex',
    alignSelf: 'center',
    width: 285,
    backgroundColor: COLOR_MAIN,
    marginHorizontal: '4%',
    marginVertical: '10%',
    borderRadius: 12,
    height: 57,
  },
  buttonSubmitText: {
    fontSize: 18,
    color: COLOR_WHITE,
    // fontWeight: '700',
  },
  textFormError: {
    color: COLOR_ERROR,
    fontSize: 12,
    marginLeft: '4%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height: 'auto',
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#6379F4',
    height: 40,
    width: 100,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 25,
  },
});
