class authHelpers {
    createSignUpBody(body) {
        console.log(body);

        let userModel = {};
        userModel['name'] = body['first_name'] + ' ' + body['last_name'];
        userModel['password'] = body['password'];
        userModel['created_on'] = Date();
        userModel['updated_on'] = Date();
        userModel['created_by'] = 'Admin';
        userModel['updated_by'] = 'Admin';
        userModel['email'] = body['email'];
        userModel['gender'] = body['gender'];
        userModel['height'] = body['height'];
        userModel['age'] = body['age'];
        userModel['weight'] = body['weight'];
        userModel['bmi'] = body['bmi'];
        return userModel;
    }
}

module.exports = authHelpers;
