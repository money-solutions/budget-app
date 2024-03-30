export default async function budgetGetTest(agent, expect) {
    describe("Get Budget Endpoint Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.get("/api/budget").send({ budgetYear: 2020 });

            expect(res).to.have.status(200);
            console.log(JSON.stringify(res.body.data, null, 4));
            expect(res.body).to.have.property("message").to.equal("Budget returned successfully");
        });

        it("should return status 400 and a error message", async () => {
            const res = await agent.get("/api/budget").send({ budgetYear: 2028 });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message").to.equal("Budget year does not exist.");
        });
    });
}
