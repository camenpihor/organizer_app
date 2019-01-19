import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api"

function coreObjectList(coreObject) {
  const url = `${baseURL}/${coreObject}/`
  return {
    get: () => axios.get(url),
    post: (toCreate) => axios.post(url, toCreate)
  }
}

function coreObjectDetail(coreObject, id) {
  const url = `${baseURL}/${coreObject}/${id}`
  return {
    get: () => axios.get(url),
    put: (toUpdate) => axios.put(url, toUpdate),
    delete: () => axios.delete(url)
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

export { coreObjectList, coreObjectDetail, getRandomSubset }
