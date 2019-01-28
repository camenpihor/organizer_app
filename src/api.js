import axios from "axios";

const baseURL = "/api"

function logIn(user) {
  const url = "/api-token-auth/"
  return axios.post(url, user)
}

function checkToken(t) {
  const url = "/api-token-verify/"
  return axios.post(url, { token: t })
}

function coreObjectList(coreObject) {
  const url = `${baseURL}/${coreObject}/`
  return {
    get: () => axios.get(url, {
      headers: {
        Authorization: `JWT ${sessionStorage.getItem('token')}`
      }
    }),
    post: (toCreate) => axios.post(url, toCreate, {
      headers: {
        Authorization: `JWT ${sessionStorage.getItem('token')}`
      }
    })
  }
}

function coreObjectDetail(coreObject, id) {
  const url = `${baseURL}/${coreObject}/${id}`
  return {
    get: () => axios.get(url, {
      headers: {
        Authorization: `JWT ${sessionStorage.getItem('token')}`
      }
    }),
    put: (toUpdate) => axios.put(url, toUpdate, {
      headers: {
        Authorization: `JWT ${sessionStorage.getItem('token')}`
      }
    }),
    delete: () => axios.delete(url, {
      headers: {
        Authorization: `JWT ${sessionStorage.getItem('token')}`
      }
    })
  }
}

function getRandomSubset(inputArray, numItems) {
  if (numItems >= inputArray.length) {
    return inputArray;
  }
  var outputArray = [];
  for (var i = 0; i < numItems; i++) {
    let randomIdx = Math.floor(Math.random() * inputArray.length);
    outputArray.push(inputArray.splice(randomIdx, 1)[0]);
  }
  return outputArray;
}

export { coreObjectList, coreObjectDetail, getRandomSubset, logIn, checkToken }
