import { tryVerify } from '@Mieswap/common/verify'
import { ContractFactory } from 'ethers'
import { ethers, network } from 'hardhat'
import fs from 'fs'

type ContractJson = { abi: any; bytecode: string }
const artifacts: { [name: string]: ContractJson } = {
  // eslint-disable-next-line global-require
  MieV3PoolDeployer: require('../artifacts/contracts/MieV3PoolDeployer.sol/MieV3PoolDeployer.json'),
  // eslint-disable-next-line global-require
  MieV3Factory: require('../artifacts/contracts/MieV3Factory.sol/MieV3Factory.json'),
  Hash: require('../artifacts/contracts/Hash.sol/Hash.json'),
}

async function main() {
  const [owner] = await ethers.getSigners()
  const networkName = network.name
  console.log('owner', owner.address)

  let MieV3PoolDeployer_address = ''
  let mieV3PoolDeployer
  const MieV3PoolDeployer = new ContractFactory(
    artifacts.MieV3PoolDeployer.abi,
    artifacts.MieV3PoolDeployer.bytecode,
    owner
  )
  if (!MieV3PoolDeployer_address) {
    mieV3PoolDeployer = await MieV3PoolDeployer.deploy()

    MieV3PoolDeployer_address = mieV3PoolDeployer.address
    console.log('MieV3PoolDeployer', MieV3PoolDeployer_address)
  } else {
    mieV3PoolDeployer = new ethers.Contract(MieV3PoolDeployer_address, artifacts.MieV3PoolDeployer.abi, owner)
  }

  let MieV3Factory_address = ''
  let mieV3Factory
  if (!MieV3Factory_address) {
    const MieV3Factory = new ContractFactory(artifacts.MieV3Factory.abi, artifacts.MieV3Factory.bytecode, owner)
    mieV3Factory = await MieV3Factory.deploy(MieV3PoolDeployer_address)

    MieV3Factory_address = mieV3Factory.address
    console.log('MieV3Factory', MieV3Factory_address)
  } else {
    mieV3Factory = new ethers.Contract(MieV3Factory_address, artifacts.MieV3Factory.abi, owner)
  }

  const HashContract = new ContractFactory(artifacts.Hash.abi, artifacts.Hash.bytecode, owner)
  const hashContract = await HashContract.deploy()

  const hash = await hashContract.INIT_CODE_PAIR_HASH()
  console.log('hash', hash)

  // Set FactoryAddress for MieV3PoolDeployer.
  await mieV3PoolDeployer.setFactoryAddress(MieV3Factory_address)

  const contracts = {
    MieV3Factory: MieV3Factory_address,
    MieV3PoolDeployer: MieV3PoolDeployer_address,
  }

  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
