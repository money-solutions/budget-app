export default async function signupTest(chai, app, expect) {
    describe("Signup Endpoint Test:", () => {
        it("should return status 200 and a success message with valid signup", async () => {
            const res = await chai.request(app).post("/api/user/signup").send({
                username: "test_user",
                password: "test_pass",
                firstname: "test_fname",
                lastname: "test_lname",
            });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Signup successful!");
        });

        it("should return status 401 with invalid credentials", async () => {
            const res = await chai.request(app).post("/api/user/signup").send({
                username: "test_user",
                password: "test_pass",
                firstname: "test_fname",
                lastname: "test_lname",
            });

            expect(res).to.have.status(401);
            expect(res.body).to.have.property("message").to.equal("Invalid credentials. Username already in use.");
        });
    });
}
