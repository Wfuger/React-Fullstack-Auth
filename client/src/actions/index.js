import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';


const ROOT_URL = 'http://localhost:3000';

export function signinUser({ email, password }) {
  return function (dispatch) {
    // Submit email/pw to the server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // If req is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER }); //  Will proobably want to send back user id in server and save it to LS too
        // - Save the JWT token
        localStorage.setItem( 'token', response.data.token );
        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(err => {
        // If req is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Credentials'))
      })
  }
}

export function signupUser({ email, password }) {
  return function (dispatch) {
    // Submit email and password to server
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER })
        localStorage.setItem('token', response.data.token)
        browserHistory.push('feature')
      })
      .catch(err => dispatch(authError(err.response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}
export function signoutUser() {

  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function (dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
}
