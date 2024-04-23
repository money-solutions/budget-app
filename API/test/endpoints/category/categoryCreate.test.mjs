export default async function categoryCreateTest(agent, expect) {
    describe("Create Category Endpoint Test:", () => {
        it("should return status 200 and a success message", async () => {
            const res = await agent.post("/api/category").send({
                budgetYear: 2024,
                budgetMonths: [1, 2, 3, 4, 5, 6, 7, 8],
                categoryName: "Test Category",
                categoryType: "Income",
                budgetAmount: 5000,
            });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Categories successfully created.");
        });

        it("should return status 400 and a error message", async () => {
            const res = await agent.post("/api/category").send({
                budgetYear: 2021,
                budgetMonths: [1, 2, 3, 4, 5, 6, 7, 8],
                categoryName: "Test Category",
                categoryType: "Income",
                budgetAmount: 5000,
            });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message").to.equal("No Budgets not found.");
        });
    });
}
