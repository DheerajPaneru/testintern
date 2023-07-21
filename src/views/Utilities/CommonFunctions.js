var Axios = require('axios');
var Constant = require('../Constant');

function getTokenDetails(token) {
        if(!token) {
            	return '';
        }

        else {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
        }            
}

function convertDate(str) {
        if(!str) {
            return '';
        }

        else {
             var date = new Date(str),
             mnth = ("0" + (date.getMonth() + 1)).slice(-2),
             day = ("0" + date.getDate()).slice(-2);
             return [date.getFullYear(), mnth, day].join("/");
        }
}

function convertDateAndTime(str) {
        if(!str) {
            return '';
        }

        else {
             var date = new Date(str),
             mnth = ("0" + (date.getMonth() + 1)).slice(-2),
             day = ("0" + date.getDate()).slice(-2),
             hours = ("0" + date.getHours()).slice(-2),
             minutes = ("0" + date.getMinutes()).slice(-2),
             seconds = ("0" + date.getSeconds()).slice(-2);
             return [[date.getFullYear(), mnth, day].join("/"),
                    ["  "],
                    [hours, minutes, seconds].join(":")];
        }
}

function secondsToTime(secs){
        if(!secs) {
            return '';
        }

        else {
         let seconds = Number(secs);
         var h = Math.floor(seconds / (3600) % 24);
         var d = Math.floor(h / 24);
         var m = Math.floor(seconds % 3600 / 60);
         let s = Math.ceil(seconds % 60);

         
        let obj = {
          "d":d,
          "h": h,
          "m": m,
          "s": s
        };
        console.log(obj)
        return obj;
        }
}



module.exports = {
	'getTokenDetails': getTokenDetails,
    'convertDate': convertDate,
    'convertDateAndTime': convertDateAndTime,
    'secondsToTime': secondsToTime
};        