import axios from 'axios';
import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLOR_MAIN , COLOR_WHITE} from '../../utils/constans';

import {useSelector} from 'react-redux';
import {API_URL} from '@env';

const EditAddress = ({navigation, route}) => {
  const {id, address, city, province, postal_code} = route.params;
  const user_id = useSelector((state) => state.auth.id);
  const token = useSelector((state) => state.auth.token);
  console.log(user_id);
  const [addres, setAddressFull] = useState('');
  const [cities, setCity] = useState('');
  const [provinces, setProvince] = useState('');
  const [zipcode, setZipcode] = useState('');
  // const addressFull = `${address} ${city} ${province} ${zipcode}`;
  const postAddress = () => {
    const config = {
      headers: {
        'x-access-token': 'Bearer ' + token,
      },
    };
    const data = {
      address: addres,
      city: cities,
      province: provinces,
      postal_code: zipcode,
      user_id: user_id,
    };
    axios
      .patch(`${API_URL}/address/${id}`, data, config)
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View >
      <View style={{height: 30}} />
      <View style={styles.wrapper}>
        <TextInput
          style={styles.form}
          placeholder="Address"
          defaultValue={address}
          onChangeText={(address) => setAddressFull(address)}
        />
        <TextInput
          style={styles.form}
          placeholder="City"
          defaultValue={city}
          onChangeText={(city) => setCity(city)}
        />
        <TextInput
          style={styles.form}
          placeholder="State/Province/Regions"
          defaultValue={province}
          onChangeText={(province) => setProvince(province)}
        />
        <TextInput
          style={styles.form}
          placeholder="Zip Code (Postal Code)"
          defaultValue={postal_code}
          onChangeText={(postal_code) => setZipcode(postal_code)}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            console.log('press');
            postAddress();
            navigation.navigate('ShippingAddress');
          }}>
          <Text style={{color: '#fff'}}>SAVE ADDRESS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditAddress;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  
  wrapper: {
    marginHorizontal: windowWidth * 0.04,
  },
  btn: {
    backgroundColor: COLOR_MAIN,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  form: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
