import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getExploreData = async () => {
  try {
    const response = await api.get('/pp/explore');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getPostData = async () => {
  try {
    const response = await api.get('/pp/post');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserEditData = async () => {
  try {
    const response = await api.get('/pp/user_edit');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get('/pp/user');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserPattern = async () => {
  try {
    const response = await api.get('/pp/user_pattern');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSearchUserData = async () => {
  try {
    const response = await api.get('/pp/search_user');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSearchTagsData = async () => {
  try {
    const response = await api.get('/pp/search_tags');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

