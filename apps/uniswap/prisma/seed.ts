import { PrismaClient as PrismaClientAnalysis } from '@prisma/client-uniswap';
import { PrismaClient as PrismaClientCollection } from '@prisma/client-collection';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const analysisPrisma = new PrismaClientAnalysis();
const collectionPrisma = new PrismaClientCollection();

async function seedAnalysisDB(
  chainId: number,
  factoryV2Address: string,
  factoryV3Address: string
) {
  await analysisPrisma.factory.upsert({
    where: {
      unique_chain_id_version: {
        chainId: chainId,
        version: 'V2',
      },
    },
    update: {},
    create: {
      id: uuidv4(),
      address: factoryV2Address,
      version: 'V2',
      chainId: chainId,
      swapSignature:
        '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
      poolCreatedSignature:
        '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9',
    },
  });

  await analysisPrisma.factory.upsert({
    where: {
      unique_chain_id_version: {
        chainId: chainId,
        version: 'V3',
      },
    },
    update: {},
    create: {
      id: uuidv4(),
      address: factoryV3Address,
      version: 'V3',
      chainId: chainId,
      swapSignature:
        '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
      poolCreatedSignature:
        '0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118',
    },
  });
}

async function seedCollectionDB() {
  await collectionPrisma.$queryRaw`CREATE OR REPLACE VIEW eth_transaction_logs_with_timestamp AS
      SELECT
          t.transaction_hash,
          t.block_number,
          l.address,
          l.log_index,
          l.data,
          l.removed,
          l.topic_0,
          l.topics,
          b.timestamp AS block_timestamp
      FROM
          eth_transaction t
      JOIN
          eth_block b ON t.block_number = b.block_number
      JOIN
          eth_transaction_logs l ON t.transaction_hash = l.transaction_hash;
      `;

  await collectionPrisma.$queryRaw`CREATE OR REPLACE VIEW bsc_transaction_logs_with_timestamp AS
  SELECT
      t.transaction_hash,
      t.block_number,
      l.address,
      l.log_index,
      l.data,
      l.removed,
      l.topic_0,
      l.topics,
      b.timestamp AS block_timestamp
  FROM
      bsc_transaction t
  JOIN
      bsc_block b ON t.block_number = b.block_number
  JOIN
      bsc_transaction_logs l ON t.transaction_hash = l.transaction_hash;
  `;
  console.log("Creating indexes")
  await collectionPrisma.$queryRaw`CREATE INDEX IF NOT EXISTS eth_idx_address_topic_0
    ON eth_transaction_logs (address, topic_0);
    `;

  await collectionPrisma.$queryRaw`CREATE INDEX IF NOT EXISTS bsc_idx_address_topic_0
    ON bsc_transaction_logs (address, topic_0);
    `;
  console.log("Indexes created")
}

async function main() {
  let chainId: number;
  let factoryV2Address: string;
  let factoryV3Address: string;

  switch (process.env.CHAIN_ID) {
    case 'eth':
      chainId = 1;
      factoryV2Address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
      factoryV3Address = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
      break;
    case 'bsc':
      chainId = 61;
      factoryV2Address = '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6';
      factoryV3Address = '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7';
      break;
    default:
      chainId = 1;
      factoryV2Address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
      factoryV3Address = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  }

  try {
    await seedAnalysisDB(chainId, factoryV2Address, factoryV3Address);
    await seedCollectionDB();
    await analysisPrisma.$disconnect();
    await collectionPrisma.$disconnect();
  } catch (e) {
    console.error(e);
    await analysisPrisma.$disconnect();
    await collectionPrisma.$disconnect();
    process.exit(1);
  }
}

main();
