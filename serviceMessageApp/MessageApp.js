const debug = require('debug')('express:log:MessageApp');
const axios = require("axios").create({
  baseURL: `http://${process.env.MESSAGE_APP || "localhost"}:3000/message`,
  timeout: 3000
});
const isString = string => {
  return typeof string == "string";
};
const isEmpty = string => {
  return string === "";
};
const exceedMaxChar = (string,max) => {
  return string.length > max
}
const stringValidation = (field,max) => {
  debug(field)
  if(!isString(field)) return "Must be String"
  if(isEmpty(field)) return "Must not be empty"
  if(exceedMaxChar(field,max)) return `Must have ${max} or less characters`
  return ""
}
class MessageApp {
  send({ destination, message }) {
    let error=stringValidation(destination,50)
    if (error){
      return Promise.resolve({
        ok: false,
        message: error
      })
    }
    error=stringValidation(message,200)
    if(error){
      return Promise.resolve({
        ok: false,
        message: error
      })
    }
  
    return axios
      .post("/", { destination, body:message })
      .then(response => {
        debug("ok",response)
        return {
          ok: true,
          message: response.data
        };
      })
      .catch(error => {
        debug("error",error)
      let data;
      data = error.response == undefined ? error : error.response.data; 
      return {
          ok: false,
          message:error.message
        };
      });
  }
}

module.exports = new MessageApp();
