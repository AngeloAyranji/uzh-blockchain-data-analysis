# UZH Blockchain Data Analysis
This repository contains the code and resources for the blockchain data analysis project conducted at the University of Zurich. The project currently focuses on analyzing on-chain data related to Uniswap, extracting meaningful insights from transactions, smart contract interactions, and network behavior.

## Table of Contents

- Overview
- Getting Started
- Architecture and Tech Stack
- Future work
- Add new apps

## Overview
This project aims to provide tools and methods for analyzing blockchain data, with a current focus on Uniswap. The analysis includes extracting transaction details, smart contract events, and network metrics, which can be used for research and practical applications. The monorepo architecture contains both the Uniswap analyzer and a dashboard to visualize this analysis. Although the initial implementation centers on Uniswap, the system is designed to allow for the easy addition of new dapps, enabling broader blockchain data analysis.

## Getting Started
To run the system:
1. Clone the repository
```sh
git clone https://github.com/AngeloAyranji/uzh-blockchain-data-analysis.git
cd uzh-blockchain-data-analysis
```
2. Set up environment variables using the provided `.env.example` file in each app
3. Run the following to start all services
```sh
docker compose up
```
4. Access the dashboard to view Uniswap analytics on port 4200

## Architecture and Tech Stack
The project follows the onion architecture, ensuring a clear separation of concerns and maintainability. At its core, the system uses NestJS as the backend framework, PostgreSQL with TimescaleDB extension for efficient time-series data handling, and Prisma as the ORM. The frontend dashboard is built with React, utilizing Material-UI for components and TanStack React Query for state management.

The architecture is divided into several key layers:
- **Domain Layer**: Contains core business logic and entities specific to Uniswap analysis.
- **Application Layer**: Implements use cases and orchestrates data flow, divided into collection, analysis, and migration sections.
- **Presentation Layer**: Handles HTTP requests and presents data via REST API endpoints.
- **Infrastructure Layer**: Manages data persistence and retrieval using Prisma ORM.
- **External Layer**: Interfaces with blockchain nodes to fetch token information.

## Key Features

The system implements an ETL (Extract, Transform, Load) pipeline using a queue-based approach for efficient data processing. It leverages custom libraries for arithmetic operations (crucial for handling token values with high precision) and database interactions. The dashboard provides comprehensive visualizations divided into General, Trades, and Liquidity sections, offering insights into Uniswap's operations, market trends, and user behaviors.

## Setup and Configuration

The project uses Docker for containerization, with services including PostgreSQL databases (for collection and analysis), Redis for caching, and containers for the Uniswap analyzer and dashboard. Environment variables are managed through `.env` files.

## Data Models and Analysis

The system revolves around key domain models including Factory, Pool, Swap, Liquidity, and Log. These models form the foundation for in-depth analysis of Uniswap's ecosystem, enabling the tracking of pool creations, swap events, liquidity changes, and overall protocol usage.

## Optimization and Scalability

Performance optimizations include the use of TimescaleDB for efficient time-series data queries, partial indexing strategies, and caching mechanisms. The system is designed to handle large volumes of blockchain data while maintaining query performance, setting a strong foundation for future enhancements and more complex analytical capabilities.

## Future Work

The Uniswap Analysis System is designed with extensibility in mind, paving the way for several exciting future develo`pments. Plans include expanding the analysis capabilities to cover more aspects of Uniswap's operations, such as impermanent loss calculations, yield farming strategies, and gas optimization insights. The system's architecture also allows for the integration of additional DeFi protocols beyond Uniswap, enabling cross-protocol comparisons and more comprehensive DeFi ecosystem analysis. To enhance the system's versatility, we aim to develop more robust extraction services that can integrate with various blockchain data sources and support non-EVM chains.

## Add New Apps

To add new apps other than uniswap (using Nestjs), just run the following command:
```sh
nx g @nx/nest:app my-app-name
```

Follow the same architecture we have in uniswap (explained above)