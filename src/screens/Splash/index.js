import React, {useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {SplashLogo} from '../../assets';

import {connect , useSelector} from 'react-redux';
import {logout} from '../../utils/redux/action/authAction'
import {API_URL} from '@env';
import axios from 'axios'

const Splash = ({navigation}) => {
  const token = useSelector(state => state.auth.token);
  useEffect(() => {
    checkToken();
    // setTimeout(() => {
    //   navigation.replace('MainApp');
    // }, 3000);
  }, [navigation]);
  const checkToken = () => {
    const config = {
headers: {
  'x-access-token' : 'Bearer ' + token,
}
    }
    axios.get(`${API_URL}/auth/checktoken`,config)
    .then(res => {
      console.log(res.data);
      navigation.replace('MainApp');
    })
    .catch(error => {
      if(error.response){
        console.log(error.response.data);
        console.log(error.response.status);
      }
      logout();
      navigation.replace('MainApp');
    })
  }
  return (
    <View style={styles.background}>
      <Image source={SplashLogo} />
    </View>
  );
};

const mapDispatchToProps =(dispatch) => {
  return {
    logout : () => dispatch(logout()),
  }
}
export default connect(null,mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222',
  },
});
