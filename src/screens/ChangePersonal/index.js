import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  Image,
} from 'react-native';
// import {} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector, connect} from 'react-redux';
import {updateName} from '../../utils/redux/action/authAction';
import {COLOR_MAIN, COLOR_WHITE} from '../../utils/constans';
import axios from 'axios';
import {API_URL} from '@env';
import {IconLeft} from '../../assets';
import DatePicker from 'react-native-date-picker';

const ChangePersonal = ({navigation, updateName , route}) => {
  const [fullname, setFullName] = useState('');
  // const [email , setEmail] = useState('');
//   const [date, setDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState(new Date());
  const [eMail, setEmail] = useState('');
  const [profile, setProfile] = useState({});
    const [date, setDate] = useState(new Date())

  const {user_name , phone , birthday} = route.params;
  const id = useSelector((state) => state.auth.id);
  const name = useSelector((state) => state.auth.name_user);
  const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.email_user);
  const phone_number = useSelector((state) => state.auth.birth_date);
  // const phone = useSelector((state) => state.auth.phone);

  const getName = () => {
    setFullName(name);
    
    // setPhoneNumber(phone);
  };
  const getEmail = ()=> {
    setEmail(email);
  }
  const getPhone = () => {
    setBirthDay(phone_number);
  }
  useEffect(() => {
    // code to run on component mount
    getName();
    getEmail();
    getPhone();
  }, [navigation, id]);
  const updateProfile = () => {
    const data = {
      user_name: fullname,
      phone_num: phoneNumber,
      birth_date: date,
    };
    const config = {
      headers: {
        'x-access-token': 'Bearer ' + token,
      },
    };

    axios
      .patch(`${API_URL}/user/info/${id}`, data, config)
      .then((res) => {
        const stName = res.data.data.user_name;
        const ndName = res.data.data.phone_num;
        const nadName = res.data.data.email;
        const enDate = res.data.data.birth_date;
        const fullName = `${stName}${nadName}${ndName}${enDate}`;
        console.log(res.data.data[0]);
        updateName(fullName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // dispatch(cancelTransferCreator())
            navigation.navigate('SettingsProfile');
          }}>
          <Image source={IconLeft} style={styles.anda} />
        </TouchableOpacity>
        <Text style={{marginLeft: 15, fontSize: 20}}>Change Personal Info</Text>
      </View>
      <ScrollView style={{marginVertical: 20}}>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.dataInfo}
            placeholder={user_name}
            
            onChangeText={(fullname) => setFullName(fullname)}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.dataInfo}
            placeholder={email}
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Your Phone Number</Text>
          <TextInput
            style={styles.dataInfo}
            placeholder={phone}
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View>
        <DatePicker mode={'date'} value={birthday} date={date} onDateChange={setDate} />
      </ScrollView>
      <TouchableOpacity
        style={styles.btnUpdate}
        onPress={() => updateProfile()}>
        <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateName: (updateFullname) => dispatch(updateName(updateFullname)),
  };
};

export default connect(null, mapDispatchToProps)(ChangePersonal);

const styles = StyleSheet.create({
  anda: {
    width: 20,
    height: 20,
    marginVertical: 2,
  },
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLOR_WHITE,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
  },
  cardPhone: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInfo: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7A7886',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7A7886',
  },
  dataInfo: {
    fontSize: 22,
    fontWeight: '700',
  },
  addPhone: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6379F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
    marginLeft: 8,
  },
  btnUpdate: {
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: COLOR_MAIN,
    borderRadius: 10,
    bottom: 0,
  },
});
