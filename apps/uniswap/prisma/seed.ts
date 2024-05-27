import { PrismaClient } from '@prisma/client-uniswap';
import * as dotenv from 'dotenv'
dotenv.config();

const prisma = new PrismaClient();

let chainId: number;
let factoryV2Address: string;
let factoryV3Address: string;

switch (process.env.CHAIN_ID) {
    case 'eth':
        chainId = 1;
        factoryV2Address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
        factoryV3Address = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
        break;
    case 'bsc':
        chainId = 61;
        factoryV2Address = "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6";
        factoryV3Address = "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7";
        break;
    default:
        chainId = 1;
        factoryV2Address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
        factoryV3Address = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
}

async function seed(chainId: number, factoryV2Address: string, factoryV3Address: string) {
    const factoryV2 = await prisma.factory.upsert({
        where: {
            unique_chain_id_version: {
                chainId: chainId,
                version: 'V2'
            },
        },
        update: {},
        create: {
            address: factoryV2Address.toLowerCase(),
            version: "V2",
            chainId: chainId,
            swapSignature: "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
            poolCreatedSignature: "0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9",
        }
    });

    const factoryV3 = await prisma.factory.upsert({
        where: {
            unique_chain_id_version: {
                chainId: chainId,
                version: 'V3'
            },
        },
        update: {},
        create: {
            address: factoryV3Address.toLowerCase(),
            version: "V3",
            chainId: chainId,
            swapSignature: "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
            poolCreatedSignature: "0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118",
        }
    });

}

seed(chainId, factoryV2Address, factoryV3Address)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });