import { expect, use } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js"; // Assuming your server file is named 'server.js'

// Tests to import
import userSignupTest from "./endpoints/user/userSignup.test.mjs";
import userLoginTest from "./endpoints/user/userLogin.test.mjs";
import userLogoutTest from "./endpoints/user/userLogout.test.mjs";
import userDeleteTest from "./endpoints/user/userDelete.test.mjs";

const chai = use(chaiHttp);
const agent = chai.request.agent(app);

describe("Tests Before User Session:", async () => {
    await userSignupTest(chai, app, expect);

    // Using agent stores the session for the calls after it
    await userLoginTest(agent, expect);

    // All other tests should go here

    // Delete the test user and all its entities and end the session
    await userDeleteTest(agent, expect);
    await userLogoutTest(agent, expect);
    
});
