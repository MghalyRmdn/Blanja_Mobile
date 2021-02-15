import * as actionTypes from '../actionTypes';

const INITIAL_STATE = {
  isLogin: false,
  token: null,
  id: null,
  level: null,
  name_user: null,
  photo_user: [],
  birth_date: null,
  phone: null,
  email_user: null,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isLogin: true,
        token: action.payload.token,
        id: action.payload.id,
        level: action.payload.level,
        name_user: action.payload.nameUser,
        photo_user: action.payload.photo,
        email_user: action.payload.email_user,
        phone: action.payload.phone_user,
        birth_date: action.payload.birth_date,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLogin: false,
        token: null,
        id: null,
        level: null,
        name_user: null,
        photo_user: null,
        email_user: null,
        birth_date: null,
        phone: null,
      };
    case actionTypes.SET_PHOTO:
      return{
        ...state,
        photo_user: action.payload,
      }
      case actionTypes.SET_PROFILE:
        return{
          ...state,
          name_user: action.payload.namaUser,
          phone:action.payload.phone,
          birth_date:action.payload.birth,
        }
    default:
      return state;
  }
};

export default authReducer;
