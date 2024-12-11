import { ethers, network } from 'hardhat'
import { configs } from '@Mieswap/common/config'
import { tryVerify } from '@Mieswap/common/verify'
import fs from 'fs'
import { abi } from '@Mieswap/v3-core/artifacts/contracts/MieV3Factory.sol/MieV3Factory.json'

import { parseEther } from 'ethers/lib/utils'
const currentNetwork = network.name

async function main() {
  const [owner] = await ethers.getSigners()
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]
  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }

  const v3DeployedContracts = await import(`@Mieswap/v3-core/deployments/${networkName}.json`)
  const mcV3DeployedContracts = await import(`@Mieswap/masterchef-v3/deployments/${networkName}.json`)

  const MieV3Factory_address = v3DeployedContracts.MieV3Factory

  const MieV3LmPoolDeployer = await ethers.getContractFactory('MieV3LmPoolDeployer')
  const MieV3LmPoolDeployer = await MieV3LmPoolDeployer.deploy(mcV3DeployedContracts.MasterChefV3)

  console.log('MieV3LmPoolDeployer deployed to:', MieV3LmPoolDeployer.address)

  const MieV3Factory = new ethers.Contract(MieV3Factory_address, abi, owner)

  await MieV3Factory.setLmPoolDeployer(MieV3LmPoolDeployer.address)

  const contracts = {
    MieV3LmPoolDeployer: MieV3LmPoolDeployer.address,
  }
  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
