var Axios = require('axios');
var Constant = require('../views/Constant');


    function getCountry() {
        return new Promise((resolve, reject) => {
            Axios.get(Constant.apiBasePath + 'location/country/getAll').then(response => {
                let data = [];
                if(response.data.status === Constant.statusSuccess) {
                    data = response.data.data;
                }
                resolve(data);
            });
        })
    }

    function getState() {
        return new Promise((resolve, reject) => {
            Axios.post(Constant.apiBasePath + 'location/state/getAll').then(response => {
                let data = [];
                if(response.data.status === Constant.statusSuccess) {
                    data = response.data.data;
                }
                resolve(data);
            });
        })
    }

    function getCityByStateId(countryCode, stateCode) {
        return new Promise((resolve, reject) => {
            Axios.get(Constant.apiBasePath + 'location/city/getAll?countryCode=' + countryCode + "&stateCode=" + stateCode).then(response => {
                let data = [];
                if(response.data.status === Constant.statusSuccess) {
                    data = response.data.data;
                }
                resolve(data);
            });
        })
    }

    function getStateByCountryId(countryCode) {
        return new Promise((resolve, reject) => {
            Axios.get(Constant.apiBasePath + 'location/state/getAll?countryCode=' + countryCode).then(response => {
                let data = [];
                if(response.data.status === Constant.statusSuccess) {
                    data = response.data.data;
                }
                resolve(data);
            });
        })
    }

    function getCategory() {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem('loginDetails');
            Axios.get(Constant.apiBasePath + 'category/getDataForApp', { headers: { token: token }}).then(response => {
                let data = [];
                if(response.data.status === Constant.statusSuccess) {
                    data = response.data.data;
                }
                resolve(data);
            });
        })
    }

    function getContest() {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem('loginDetails');
            Axios.get(Constant.apiBasePath + 'contest/getDataForApp', { headers: { token: token }}).then(response => {
                let data = [];
                if(response.data.status === Constant.statusSuccess) {
                    data = response.data.data;
                }
                resolve(data);
            });
        })
    }

module.exports = {
    'getCountry': getCountry,
    'getState': getState,
    'getCityByStateId': getCityByStateId,
    'getStateByCountryId': getStateByCountryId,
    'getCategory': getCategory,
    'getContest': getContest
};