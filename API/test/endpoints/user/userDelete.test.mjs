export default async function userDeleteTest(agent, expect) {
    describe("Delete User Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.delete("/api/user").send();

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("User deleted.");
        });
    });
}
