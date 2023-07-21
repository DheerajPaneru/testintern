
    function getAccessToken() {
        let token = localStorage.getItem('loginDetails');
        return token;
    }

    module.exports = {
        'getAccessToken': getAccessToken
    }