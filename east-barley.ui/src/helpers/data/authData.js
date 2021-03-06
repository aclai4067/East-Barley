import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';

/*
const baseUrl = 'https://localhost:44319/api/';
*/

axios.interceptors.request.use((request) => {
  const token = sessionStorage.getItem('token');
  if (token != null) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
}, (err) => Promise.reject(err));

const getUid = () => firebase.auth().currentUser.uid;

export default {
  getUid,
};
