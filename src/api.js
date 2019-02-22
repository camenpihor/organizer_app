import axios from "axios";

const baseURL = "/api"

function logIn(user) {
  const url = "api/token"
  return axios.post(url, user)
}

function objectList(object_type) {
  const url = `${baseURL}/${object_type}/`
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

function objectDetail(object_type, id) {
  const url = `${baseURL}/${object_type}/${id}`
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
  var newInputArray = inputArray.slice()  // so that we don't mutate the inputArray outside of this function
  var outputArray = [];
  for (var i = 0; i < numItems; i++) {
    let randomIdx = Math.floor(Math.random() * newInputArray.length);
    outputArray.push(newInputArray.splice(randomIdx, 1)[0]);
  }
  return outputArray;
}

export {
  objectList,
  objectDetail,
  coreObjectNotebook,
  getRandomSubset,
  logIn
}
