# Uniswap Analysis Dashboard

This is the frontend dashboard for the Uniswap Analysis System. It's responsible for displaying the analysis results in an interactive and user-friendly manner.

## Adding New Analysis to the Dashboard

To add a new analysis to the dashboard, follow these steps:

1. **Define the Response Type**
   Navigate to the types directory in the query folder and create or update the appropriate type file:
   Example:
```typescript
export interface SwapTrendAnalysis {
  date: string;
  volume: number;
  count: number;
}
```

2. **Create an API Query Hook**
Go to the API directory and create a new React Query hook

3. **Create a new component**
Develop a new component to display the analysis results in the pages/components directory

4. **Add the Component to the Page**
Finally, add your new component to the main page called uniswap.tsx located in the pages directory

This README provides a step-by-step guide for frontend developers on how to add new analyses to the Uniswap dashboard. It covers the entire process from defining types, creating API hooks, building components, to integrating them into the main page.