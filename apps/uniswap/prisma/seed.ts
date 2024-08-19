import { PrismaClient as PrismaClientAnalysis } from '@prisma/client-uniswap';
import { PrismaClient as PrismaClientCollection } from '@prisma/client-collection';
import {
  POOL_CREATED_V2,
  POOL_CREATED_V3,
  SWAP_SIGNATURE_V2,
  SWAP_SIGNATURE_V3,
  MINT_SIGNATURE_V2,
  MINT_SIGNATURE_V3,
  BURN_SIGNATURE_V2,
  BURN_SIGNATURE_V3,
} from '../utils/topic0';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import {
  FACTORY_V2_BSC_ADDRESS,
  FACTORY_V2_ETH_ADDRESS,
  FACTORY_V3_BSC_ADDRESS,
  FACTORY_V3_ETH_ADDRESS,
} from '../utils/addresses';
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
      swapSignature: SWAP_SIGNATURE_V2,
      poolCreatedSignature: POOL_CREATED_V2,
      mintSignature: MINT_SIGNATURE_V2,
      burnSignature: BURN_SIGNATURE_V2,
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
      swapSignature: SWAP_SIGNATURE_V3,
      poolCreatedSignature: POOL_CREATED_V3,
      burnSignature: BURN_SIGNATURE_V3,
      mintSignature: MINT_SIGNATURE_V3,
    },
  });
}

async function seedCollectionDB() {
  console.log('Creating views');
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


  // address & topic_0 index in eth_transaction_logs table
  console.log('Creating address & topic_0 index in eth_transaction_logs table');
  const eth_idx_address_topic_0 = `CREATE INDEX IF NOT EXISTS eth_idx_address_topic_0
    ON eth_transaction_logs (address, topic_0, transaction_hash, log_index) where topic_0 IN ('${POOL_CREATED_V2}', '${POOL_CREATED_V3}') AND address IN ('${FACTORY_V2_ETH_ADDRESS}', '${FACTORY_V3_ETH_ADDRESS}');
    `;
  await collectionPrisma.$queryRawUnsafe(eth_idx_address_topic_0);

  const bsc_idx_address_topic_0 = `CREATE INDEX IF NOT EXISTS bsc_idx_address_topic_0
  ON bsc_transaction_logs (address, topic_0, transaction_hash, log_index) where topic_0 IN ('${POOL_CREATED_V2}', '${POOL_CREATED_V3}') AND address IN ('${FACTORY_V2_BSC_ADDRESS}', '${FACTORY_V3_BSC_ADDRESS}');
  `;
  await collectionPrisma.$queryRawUnsafe(bsc_idx_address_topic_0);

  // topic_0 index in eth_transaction_logs table
  console.log('Creating topic_0 index in eth_transaction_logs table');
  const eth_idx_topic_0 = `CREATE INDEX IF NOT EXISTS eth_idx_topic_0
  ON eth_transaction_logs (topic_0, transaction_hash, log_index)
  WHERE topic_0 IN ('${SWAP_SIGNATURE_V2}', '${SWAP_SIGNATURE_V3}', '${MINT_SIGNATURE_V2}', '${MINT_SIGNATURE_V3}', '${BURN_SIGNATURE_V2}', '${BURN_SIGNATURE_V3}');
  `;
  await collectionPrisma.$queryRawUnsafe(eth_idx_topic_0);

  const bsc_idx_topic_0 = `CREATE INDEX IF NOT EXISTS bsc_idx_topic_0
  ON bsc_transaction_logs (topic_0, transaction_hash, log_index)
  WHERE topic_0 IN ('${SWAP_SIGNATURE_V2}', '${SWAP_SIGNATURE_V3}', '${MINT_SIGNATURE_V2}', '${MINT_SIGNATURE_V3}', '${BURN_SIGNATURE_V2}', '${BURN_SIGNATURE_V3}');
  `;
  await collectionPrisma.$queryRawUnsafe(bsc_idx_topic_0);

  // transaction_hash & log_index index in eth_transaction_logs table
  // console.log('Creating transaction_hash & log_index index in eth_transaction_logs table');
  // const eth_idx_transaction_hash_log_index = `CREATE INDEX IF NOT EXISTS eth_idx_transaction_hash_log_index ON eth_transaction_logs (transaction_hash, log_index);`;
  // await collectionPrisma.$queryRawUnsafe(eth_idx_transaction_hash_log_index);
  // const bsc_idx_transaction_hash_log_index = `CREATE INDEX IF NOT EXISTS bsc_idx_transaction_hash_log_index ON bsc_transaction_logs (transaction_hash, log_index);`;
  // await collectionPrisma.$queryRawUnsafe(bsc_idx_transaction_hash_log_index);

  // block_number index in eth_block and eth_transaction table
  console.log('Creating block_number index in eth_block table and eth_transaction table');
  const idx_eth_block_block_number = `CREATE INDEX IF NOT EXISTS idx_eth_block_block_number ON eth_block (block_number);`;
  await collectionPrisma.$queryRawUnsafe(idx_eth_block_block_number);
  const idx_bsc_block_block_number = `CREATE INDEX IF NOT EXISTS idx_bsc_block_block_number ON bsc_block (block_number);`;
  await collectionPrisma.$queryRawUnsafe(idx_bsc_block_block_number);

  const idx_eth_transaction_block_number = `CREATE INDEX IF NOT EXISTS idx_eth_transaction_block_number ON eth_transaction (block_number);`;
  await collectionPrisma.$queryRawUnsafe(idx_eth_transaction_block_number);
  const idx_bsc_transaction_block_number = `CREATE INDEX IF NOT EXISTS idx_bsc_transaction_block_number ON bsc_transaction (block_number);`;
  await collectionPrisma.$queryRawUnsafe(idx_bsc_transaction_block_number);

  // transaction_hash index in eth_transaction_logs and eth_transaction table
  console.log('Creating transaction_hash index in eth_transaction_logs table and eth_transaction table');
  const idx_eth_transaction_transaction_hash = `CREATE INDEX IF NOT EXISTS idx_eth_transaction_transaction_hash ON eth_transaction (transaction_hash);`;
  await collectionPrisma.$queryRawUnsafe(idx_eth_transaction_transaction_hash);
  const idx_bsc_transaction_transaction_hash = `CREATE INDEX IF NOT EXISTS idx_bsc_transaction_transaction_hash ON bsc_transaction (transaction_hash);`;
  await collectionPrisma.$queryRawUnsafe(idx_bsc_transaction_transaction_hash);

  const idx_eth_transaction_logs_transaction_hash = `CREATE INDEX IF NOT EXISTS idx_eth_transaction_logs_transaction_hash ON eth_transaction_logs (transaction_hash);`;
  await collectionPrisma.$queryRawUnsafe(idx_eth_transaction_logs_transaction_hash);
  const idx_bsc_transaction_logs_transaction_hash = `CREATE INDEX IF NOT EXISTS idx_bsc_transaction_logs_transaction_hash ON bsc_transaction_logs (transaction_hash);`;
  await collectionPrisma.$queryRawUnsafe(idx_bsc_transaction_logs_transaction_hash);
}

// Time range for hypertable partition is 1 week by default
async function setupTimeScaleDB() {
  console.log('Creating hypertable for SWAP');
  await analysisPrisma.$executeRaw`SELECT create_hypertable('"Swap"', by_range('swapAt'), if_not_exists => TRUE);`;
  console.log('Creating hypertable for LIQUIDITY');
  await analysisPrisma.$executeRaw`SELECT create_hypertable('"Liquidity"', by_range('timestamp'), if_not_exists => TRUE);`;
}

async function main() {
  let chainId: number;
  let factoryV2Address: string;
  let factoryV3Address: string;

  switch (process.env.CHAIN_ID) {
    case 'eth':
      chainId = 1;
      factoryV2Address = FACTORY_V2_ETH_ADDRESS;
      factoryV3Address = FACTORY_V3_ETH_ADDRESS;
      break;
    case 'bsc':
      chainId = 61;
      factoryV2Address = FACTORY_V2_BSC_ADDRESS;
      factoryV3Address = FACTORY_V3_BSC_ADDRESS;
      break;
    default:
      chainId = 1;
      factoryV2Address = FACTORY_V2_ETH_ADDRESS;
      factoryV3Address = FACTORY_V3_ETH_ADDRESS;
  }

  try {
    await seedAnalysisDB(chainId, factoryV2Address, factoryV3Address);
    await seedCollectionDB();
    await setupTimeScaleDB();
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
