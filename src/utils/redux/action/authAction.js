import * as actionTypes from '../actionTypes';

export const login = (token, id, level, name , photo , email , birth_date , phone ) => {
  return {
    type: actionTypes.LOGIN,
    payload: {
      token: token,
      id: id,
      level: level,
      nameUser: name,
      email_user: email,
      photo: photo,
      birth_date: birth_date,
      phone: phone ,
    },
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

export const updateName = (nama , phone , birth_date) => {
  return {
    type: actionTypes.SET_PROFILE,
    payload: {
        namaUser: nama,
        phone: phone,
        birthday:birth_date,
    },
  }
}

export const  updatePhoto = (data) => {
  return {
    type: actionTypes.SET_PHOTO,
    payload: data,
  }
}