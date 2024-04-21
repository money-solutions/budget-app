export default async function budgetGetTest(agent, expect) {
    describe("Get Budget Endpoint Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.get("/api/budget?budgetYear=2024").send();

            expect(res).to.have.status(200);
            console.log(JSON.stringify(res.body.data, null, 4));
            expect(res.body).to.have.property("message").to.equal("Budget returned successfully");
        });

        it("should return status 400 and a error message", async () => {
            const res = await agent.get("/api/budget?budgetYear=2028").send();

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message").to.equal("Budget year does not exist.");
        });
    });
}
