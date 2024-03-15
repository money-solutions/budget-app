export default async function userLoginTest(agent, expect) {
    describe("Login Endpoint Test:", () => {
        it("should return status 200 and a success message with valid credentials", async () => {
            const res = await agent.post("/api/user/login").send({ username: "test_user", password: "test_pass" });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Login successful!");
        });

        it("should return status 401 with invalid credentials", async () => {
            const res = await agent.post("/api/user/login").send({
                username: "invalid_username",
                password: "invalid_password",
            });

            expect(res).to.have.status(401);
            expect(res.body).to.have.property("message").to.equal("Invalid credentials.");
        });
    });
}
