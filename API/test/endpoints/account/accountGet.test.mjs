export default async function accountGetTest(agent, expect) {
    describe("Get Account Endpoint Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.get("/api/account").send();

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Retrieved Accounts Successfully!");
            console.log(res.body);
            expect(res.body).to.have.property("accounts").to.be.an("array");
            expect(res.body.accounts[0].nickname).to.equal("account test name");
        });
    });
}
