export default async function logoutTest(agent, expect) {
    describe("Logout Endpoint Test:", () => {
        it("should return status 200 and a success message with valid credentials", async () => {
            const res = await agent.post("/api/user/logout").send();

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Session ended.");
        });

        it("should return status 401 with invalid credentials", async () => {
            const res = await agent.post("/api/user/logout").send({
                username: "invalid_username",
                password: "invalid_password",
            });

            expect(res).to.have.status(401);
            expect(res.body).to.have.property("message").to.equal("Unauthorized. Invalid Session Cookie.");
        });
    });
}
