import { Injectable } from "@nestjs/common";
import { IUniswapContractExternalService } from "./iuniswap-contract.external.service";
import { ConfigService } from "@nestjs/config";
import { ethers, providers } from "ethers";

@Injectable()
export class UniswapContractExternalService implements IUniswapContractExternalService {
    private provider: providers.JsonRpcProvider;

    private erc20Interface = new ethers.utils.Interface([
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
    ]);

    private poolInterface = new ethers.utils.Interface([
        'function token0() view returns (address)',
        'function token1() view returns (address)',
    ]);

    constructor(
        private readonly config: ConfigService
    ) {
        this.provider = new providers.JsonRpcProvider(this.config.get('NODE_URL'));
    }

    async getSymbol(address: string): Promise<string> {
        const contract = new ethers.Contract(
            address,
            this.erc20Interface,
            this.provider
        );

        const symbol = await contract.symbol();
        return symbol;
    }

    async getPoolTokens(address: string): Promise<{ token0: string; token1: string; }> {
        const contract = new ethers.Contract(
            address,
            this.poolInterface,
            this.provider
        );

        // const token0 = await contract.token0();
        // const token1 = await contract.token1();

        const [token0Address, token1Address] = await Promise.all([
            contract.token0(),
            contract.token1()
        ]);

        const [token0Symbol, token1Symbol] = await Promise.all([
            this.getSymbol(token0Address),
            this.getSymbol(token1Address)
        ]);

        return {
            token0: token0Symbol,
            token1: token1Symbol
        };
    }
}