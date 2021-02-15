import {Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {ProfilePict, Gallery, Camera} from '../../assets';
// import {createStackNavigator} from '@react-navigation/stack';
import {ProfileMenu} from '../../components';
import {
  COLOR_DISABLE,
  COLOR_MAIN,
  FONT_BOLD,
  FONT_LIGHT,
} from '../../utils/constans';
import axios from 'axios';

//redux
import {connect, useSelector} from 'react-redux';
import {logout} from '../../utils/redux/action/authAction';

import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const Profile = ({navigation, logoutRedux, isLogin, updatePhoto}) => {
  const level = useSelector((state) => state.auth.level);
  const user_id = useSelector((state) => state.auth.id);
  const token = useSelector(state => state.auth.token);
  const [photo, setPhoto] = [];
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [modalVisible, setModalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [profile, setProfile] = useState({});
  const [capture, setCapture] = useState([]);
  const [totalProduct , setTotalProduct] = useState(0);
  const [totalOrder , setTotalOrder] = useState(0);
  const [totalAddress , setTotalAddress] = useState(0);
  console.log(isLogin);
  console.log(level);
  console.log(user_id);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isLogin) {
        navigation.replace('Login');
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus' , () => {
      if(level === 'Seler'){
        getProduct();
        getOrderSeller();
      } else {
        getHistory()
        getAddress();
      }
    })
    return unsubscribe;
  },[navigation])

  const clearAll = async () => {
    try {
        await AsyncStorage.clear();
        console.log('Have Done Clear')
    } catch (e) {
      console.log(e)
    }
    console.log('Ok Clear')
  }

  const chooseFile = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then((images) => {
        console.log(images);
        setPhoto(images);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const takePicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then((images) => {
        console.log(images.length);
        setCapture(images);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadPicture = () => {
    const pictureData = new FormData();
    for (let i = 0; i < photo.length; i++) {
      pictureData.append('image', {
        name: photo[i].path.split('/').pop(),
        type: photo[i].mime,
        uri:
          Platform.OS === 'android'
            ? photo[i].path
            : photo[i].replace('file://', ''),
      });
    }
    if (capture.length > 0) {
      data.append('image', {
        name: capture.path.split('/').pop(),
        type: capture.mime,
        uri:
          Platform.OS === 'android'
            ? capture.path
            : capture.path.replace('file://', ''),
      });
    }
    axios
      .patch(`${API_URL}/user/photo/${user_id},${pictureData}`)
      .then(({data}) => {
        updatePhoto(data.data.image);
        navigation.navigate('Home');
      })
      .catch(({response}) => {
        console.log(response.data);
      });
  };

  // const clearAll = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log('ALL CLEAR');
  //   } catch (e) {
  //     // clear error
  //   }

  //   console.log('Done.');
  // };

  useEffect(() => {
    // code to run on component mount
    getProfile();
    if(level == 'Seller'){
      getProduct();
      getOrderSeller();
    } else {
      getHistory();
      getAddress();
    }
  }, [navigation, user_id]);

  const logout = async () => {
    //logout
    try {
      console.log(`ini token: ${token}`);
      await axios.delete(`${API_URL}/auth/logout`, {
        headers: {
          'x-access-token': 'Bearer ' + token,
        },
      });
      logoutRedux();
      navigation.navigate('Login');
    } catch (e) {
      // remove error
      console.log(e);
    }
  };

  const getProfile = () => {
    axios
      .get(`${API_URL}/user/${user_id}`)
      .then((res) => {
        console.log(res.data.data[0]);
        setProfile(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProduct = async () => {
    const config = {
      headers: {
        'x-access-token' : 'Bearer' + token,
      }
    }
    await axios.get(`${API_URL}/product/user/${user_id}`,config)
    .then(res => {
      const data = res.data.data;
      setTotalProduct(data.length);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const getHistory = async () => {
    axios.get(`${API_URL}/history/${user_id}`)
    .then(res => {
      const history = res.data.data;
      setTotalOrder(history.length);
    })
  }

  const getOrderSeller = () => {
    axios
      .get(API_URL + '/history/seller/' + user_id)
      .then((res) => {
        const data = res.data.data;
        setTotalOrder(data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAddress = () => {
    axios
      .get(`${API_URL}/address/${user_id}`)
      .then((res) => {
        const data = res.data.data;
        setTotalAddress(data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <View style={styles.titlewrap}>
        <Text style={styles.title}>My Profile</Text>
      </View>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => {
            setEditVisible(true);
          }}>
          <Image
            style={styles.img}
            source={
              isLogin && profile && profile.photo_user
                ? {uri: profile.photo_user}
                : ProfilePict
            }
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.main}>
            {isLogin && profile && profile.user_name ? profile.user_name : ''}
          </Text>
          <Text style={styles.second}>
            {isLogin && profile && profile.email ? profile.email : ''}
          </Text>
        </View>
      </View>
      {level === 'Seller' && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MyProduct');
          }}>
          <ProfileMenu
            title={'My products'}
            detail={`Already have ${totalProduct} products`}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MyOrder');
        }}>
        <ProfileMenu
          title={'My orders'}
          detail={`Already have ${totalOrder} orders`}
        />
      </TouchableOpacity>

      {level === 'Customer' && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ShippingAddress');
          }}>
          <ProfileMenu
            title={'Shipping addresses'}
            detail={`${totalAddress} adresses`}
          />
        </TouchableOpacity>
      )}
      {/* CHAT PAGE */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat List');
        }}>
        <ProfileMenu title={'Chats'} detail={`Your Chats`} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SettingsProfile');
        }}>
        <ProfileMenu title={'Settings'} detail={`Notifications, password`} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <ProfileMenu title={'Logout'} />
      </TouchableOpacity>

      {/* <Button onPress={clearAll} title="Learn More" color={COLOR_MAIN} /> */}
      <View style={{height: 20}} />
      <View style={{height: 20}} />
      {/* modal change Picture */}
      <Modal animationType="fade" transparent={true} visible={editVisible}>
        <View style={styles.centeredView}>
          <View
            style={{
              ...styles.modalView,
              height: 230,
              width: '100%',
              marginTop: -100,
              borderRadius: 0,
            }}>
            <Text style={styles.modalText}>Select Picture From</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 250,
              }}>
              <Button
                style={{
                  ...styles.closeButton,
                  backgroundColor: 'white',
                  height: 100,
                  width: 100,
                }}
                onPress={chooseFile}>
                <Image source={Gallery} />
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Gallery</Text>
              </Button>
              <Button
                style={{
                  ...styles.closeButton,
                  backgroundColor: 'white',
                  height: 100,
                  width: 100,
                }}
                onPress={takePicture}>
                <Image source={Camera} />
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Camera</Text>
              </Button>
            </View>
            <View style={styles.editWrapper}>
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  setEditVisible(!editVisible);
                }}>
                <Text style={{fontSize: 18, fontWeight: 'bold' , color: '#fcfcfc'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={uploadPicture}>
                <Text style={{fontSize: 18, fontWeight: 'bold' ,color: '#fcfcfc'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* end modal */}
      {/* modal logout */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure want to logout?</Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                width: 250,
                justifyContent: 'space-evenly',
              }}>
              <Button
                style={styles.closeButton}
                onPress={() => {
                  logout();
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Yes</Text>
              </Button>
              <Button
                style={{...styles.closeButton, backgroundColor: 'lightgrey'}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={{...styles.textStyle, color: 'black'}}>No</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLogin: state.auth.isLogin,
    token: state.auth.token,
    id: state.auth.id,
    level: state.auth.level,
    name: state.auth.nameUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRedux: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  main: {
    fontFamily: FONT_BOLD,
  },
  second: {
    fontFamily: FONT_LIGHT,
    color: COLOR_DISABLE,
  },
  title: {
    fontSize: 34,
    fontFamily: FONT_BOLD,
  },
  titlewrap: {
    marginTop: 74,
    marginHorizontal: 14,
  },
  img: {
    height: 69,
    width: 69,
    borderRadius: 69 / 2,
    marginRight: 17,
  },
  profile: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 14,
  },
  myorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    height: 'auto',
  },
  modalView: {
    height: 200,
    width: 300,
    margin: 20,
    backgroundColor: '#282828'	,
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
    flexDirection: 'column',
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
    color: '#ffffff'
  },
  editWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
