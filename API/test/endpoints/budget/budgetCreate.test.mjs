export default async function budgetCreateTest(agent, expect) {
    describe("Create Budget Endpoint Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.post("/api/budget").send({ budgetYear: 2024 });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Budgets successfully created.");
        });

        it("should return status 400 and a error message", async () => {
            const res = await agent.post("/api/budget").send({ budgetYear: 2024 });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message").to.equal("Budget already exists.");
        });
    });
}