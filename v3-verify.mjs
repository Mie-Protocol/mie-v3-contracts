#!/usr/bin/env zx
// import 'zx/globals'

const networks = {
  eth: 'eth',
  goerli: 'goerli',
  bscMainnet: 'bscMainnet',
  bscTestnet: 'bscTestnet',
  hardhat: 'hardhat',
}

let network = process.env.NETWORK
console.log(network, 'network')
if (!network || !networks[network]) {
  throw new Error(`env NETWORK: ${network}`)
}

await $`yarn workspace @Mieswap/v3-core run hardhat run scripts/verify.ts --network ${network}`

await $`yarn workspace @Mieswap/v3-periphery run hardhat run scripts/verify.ts --network ${network}`

await $`yarn workspace @Mieswap/smart-router run hardhat run scripts/verify.ts --network ${network}`

await $`yarn workspace @Mieswap/masterchef-v3 run hardhat run scripts/verify.ts --network ${network}`

await $`yarn workspace @Mieswap/v3-lm-pool run hardhat run scripts/verify.ts --network ${network}`

console.log(chalk.blue('Done!'))
