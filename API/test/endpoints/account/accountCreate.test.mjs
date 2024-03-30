export default async function accountCreateTest(agent, expect) {
    describe("Create Account Endpoint Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.post("/api/account").send({ name: "account test name", bank: "Chase", type: 1 });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("New Associated Account Created Successfully!");
        });

        it("should return status 400 and a error message", async () => {
            const res = await agent.post("/api/account").send({ name: "account test name", bank: "Chase" });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message").to.equal("Missing parameters");
        });
    });
}
