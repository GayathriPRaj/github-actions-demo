class apiutils {

    constructor(apiContext, loginPayLoad, apiReqLogin, apiReqUsrProfile) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
        this.apiReqLogin = apiReqLogin;
        this.apiReqUsrProfile = apiReqUsrProfile;
    }

    async getLoginTokenAndData() {
        const response = {};
        // Login API
        const loginResponse = await this.apiContext.post(this.apiReqLogin,
            {
                data: this.loginPayLoad
            });

        //expect (loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        //response.loginToken = loginResponseJson.data.token;
        response.loginToken = JSON.parse(loginResponseJson.data).token;

        // current_user API
        const bearer = "Bearer ";
        const authorization = bearer.concat(response.loginToken);
        const currentUserResponse = await this.apiContext.get(this.apiReqUsrProfile,
            {
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json'
                },
            }
        );
        const currentUserResponseJson = await currentUserResponse.json();

        const oid = currentUserResponseJson.id.$oid;
        const role = currentUserResponseJson.role;
        const clients = currentUserResponseJson.clients;
        const userEmail = currentUserResponseJson.email;
        const name = currentUserResponseJson.name;

        const loginData = {
            "id": oid,
            "role": role,
            "clients": clients,
            "email": userEmail,
            "name": name
        };

        response.loginDataString = JSON.stringify(loginData);
        
        //console.log("--------------------", response);

        return response;
    }

}

module.exports = { apiutils };