import axios from "axios";

const baseURL = "/api"

function logIn(user) {
  const url = "api/token"
  return axios.post(url, user)
}

function coreObjectList(coreObject) {
  const url = `${baseURL}/${coreObject}/`
  return {
    get: () => axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
    post: (toCreate) => axios.post(url, toCreate, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}

function coreObjectDetail(coreObject, id) {
  const url = `${baseURL}/${coreObject}/${id}`
  return {
    get: () => axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
    put: (toUpdate) => axios.put(url, toUpdate, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
    delete: () => axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}

function coreObjectNotebook(coreObject) {
  const url = `${baseURL}/${coreObject}/notebook/`
  return {
    get: () => axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
    put: (toUpdate) => axios.put(url, toUpdate, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
    post: (toCreate) => axios.post(url, toCreate, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
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

export { coreObjectList, coreObjectDetail, getRandomSubset, logIn, coreObjectNotebook }
