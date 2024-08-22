# Uniswap Analysis App

This app is part of the larger Uniswap Analysis System monorepo. It's responsible for conducting in-depth analyses of Uniswap data and serving the results to the dashboard.

## Adding New Analyses

To add a new analysis to the Uniswap app, follow these steps:

1. **Identify the Domain**
   Determine which domain your analysis belongs to (e.g., Swaps, Liquidity, Pools).

2. **Locate the Read Service**
   Navigate to the core layer and find the appropriate read service for your domain. For example: src/core/application/services/read/SwapReadService.ts

3. **Implement Analysis Logic**
Add your new analysis method in the read service. This is where the main computation and logic should occur.

Example:
```typescript
async analyzeSwapTrends(startDate: Date, endDate: Date): Promise<SwapTrendAnalysis> {
  // Implement your analysis logic here
}
```

4. **Database Interactions**
If your analysis requires data from the database, use the infrastructure layer by calling the appropriate repository method from your read service

5. **Smart Contract Interactions**
If you need to interact with smart contracts, Implement the logic in the read service by calling the necessary method from the external services layer

6. **Return Analysis Results**
Once your analysis is complete, return the results from your read service method.

7. **Update Presentation Layer**
Create or update a controller in the presentation layer to expose your new analysis

This README provides a step-by-step guide for developers on how to add new analyses to the Uniswap app within the monorepo structure. It emphasizes the correct use of the layered architecture, separating concerns between core logic, data access, external interactions, and presentation.