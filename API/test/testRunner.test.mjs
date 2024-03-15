import { expect, use } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js"; // Assuming your server file is named 'server.js'

// Tests to import
import signupTest from "./endpoints/signup.test.mjs";
import loginTest from "./endpoints/login.test.mjs";
import logoutTest from "./endpoints/logout.test.mjs";
import deleteUserTest from "./endpoints/deleteUser.test.mjs";

const chai = use(chaiHttp);
const agent = chai.request.agent(app);

describe("Tests Before User Session:", async () => {
    await signupTest(chai, app, expect);

    // Using agent stores the session for the calls after it
    await loginTest(agent, expect);

    // All other tests should go here

    // Delete the test user and all its entities and end the session
    await deleteUserTest(agent, expect);
    await logoutTest(agent, expect);
    
});
