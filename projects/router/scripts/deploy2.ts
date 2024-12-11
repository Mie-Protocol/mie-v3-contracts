import { ethers, network } from 'hardhat'
import { configs } from '@Mieswap/common/config'
import { tryVerify } from '@Mieswap/common/verify'
import { writeFileSync } from 'fs'

async function main() {
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]
  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }

  const v3DeployedContracts = await import(`@Mieswap/v3-core/deployments/${networkName}.json`)
  const v3PeripheryDeployedContracts = await import(`@Mieswap/v3-periphery/deployments/${networkName}.json`)

  const MieV3PoolDeployer_address = v3DeployedContracts.MieV3PoolDeployer
  const MieV3Factory_address = v3DeployedContracts.MieV3Factory
  const positionManager_address = v3PeripheryDeployedContracts.NonfungiblePositionManager

  /** SmartRouterHelper */
  console.log('Deploying SmartRouterHelper...')
  const SmartRouterHelper = await ethers.getContractFactory('SmartRouterHelper')
  const smartRouterHelper = await SmartRouterHelper.deploy()
  console.log('SmartRouterHelper deployed to:', smartRouterHelper.address)
  // await tryVerify(smartRouterHelper)

  const MieStableSwapLPFactory = await ethers.getContractFactory('MieStableSwapLPFactory')
  const mieStableSwapLPFactory = await MieStableSwapLPFactory.deploy()
  await mieStableSwapLPFactory.deployed()

  const MieStableSwapTwoPoolDeployer = await ethers.getContractFactory('MieStableSwapTwoPoolDeployer')
  const pancakeStableSwapTwoPoolDeployer = await MieStableSwapTwoPoolDeployer.deploy()
  await pancakeStableSwapTwoPoolDeployer.deployed()

  const MieStableSwapThreePoolDeployer = await ethers.getContractFactory('MieStableSwapThreePoolDeployer')
  const pancakeStableSwapThreePoolDeployer = await MieStableSwapThreePoolDeployer.deploy()
  await pancakeStableSwapThreePoolDeployer.deployed()

  const StableFactory = await ethers.getContractFactory('MieStableSwapFactory')
  const stableFactory = await StableFactory.deploy(
    mieStableSwapLPFactory.address,
    pancakeStableSwapTwoPoolDeployer.address,
    pancakeStableSwapThreePoolDeployer.address
  )
  await stableFactory.deployed()

  const MieStableSwapTwoPoolInfo = await ethers.getContractFactory('MieStableSwapTwoPoolInfo')
  const pancakeStableSwapTwoPoolInfo = await MieStableSwapTwoPoolInfo.deploy()
  await pancakeStableSwapTwoPoolInfo.deployed()

  // await tryVerify(smartRouter, [
  //   config.v2Factory,
  //   MieV3PoolDeployer_address,
  //   MieV3Factory_address,
  //   positionManager_address,
  //   config.stableFactory,
  //   config.stableInfo,
  //   config.WNATIVE,
  // ])

  /** SmartRouter */
  console.log('Deploying SmartRouter...')
  const SmartRouter = await ethers.getContractFactory('SmartRouter', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const smartRouter = await SmartRouter.deploy(
    config.v2Factory,
    MieV3PoolDeployer_address,
    MieV3Factory_address,
    positionManager_address,
    stableFactory.address,
    pancakeStableSwapTwoPoolInfo.address,
    config.WNATIVE
  )
  console.log('SmartRouter deployed to:', smartRouter.address)

  /** MixedRouteQuoterV1 */
  const MixedRouteQuoterV1 = await ethers.getContractFactory('MixedRouteQuoterV1', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const mixedRouteQuoterV1 = await MixedRouteQuoterV1.deploy(
    MieV3PoolDeployer_address,
    MieV3Factory_address,
    config.v2Factory,
    stableFactory.address,
    config.WNATIVE
  )
  console.log('MixedRouteQuoterV1 deployed to:', mixedRouteQuoterV1.address)

  // await tryVerify(mixedRouteQuoterV1, [
  //   MieV3PoolDeployer_address,
  //   MieV3Factory_address,
  //   config.v2Factory,
  //   config.stableFactory,
  //   config.WNATIVE,
  // ])

  /** QuoterV2 */
  const QuoterV2 = await ethers.getContractFactory('QuoterV2', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const quoterV2 = await QuoterV2.deploy(MieV3PoolDeployer_address, MieV3Factory_address, config.WNATIVE)
  console.log('QuoterV2 deployed to:', quoterV2.address)

  // await tryVerify(quoterV2, [MieV3PoolDeployer_address, MieV3Factory_address, config.WNATIVE])

  /** TokenValidator */
  const TokenValidator = await ethers.getContractFactory('TokenValidator', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const tokenValidator = await TokenValidator.deploy(config.v2Factory, positionManager_address)
  console.log('TokenValidator deployed to:', tokenValidator.address)

  // await tryVerify(tokenValidator, [config.v2Factory, positionManager_address])

  const contracts = {
    mieStableSwapLPFactory: mieStableSwapLPFactory.address,
    stableFactory: stableFactory.address,
    stableInfo: pancakeStableSwapTwoPoolInfo.address,
    stableThreeInfo: pancakeStableSwapThreePoolDeployer.address,
    SmartRouter: smartRouter.address,
    positionManager: positionManager_address,
    SmartRouterHelper: smartRouterHelper.address,
    MixedRouteQuoterV1: mixedRouteQuoterV1.address,
    QuoterV2: quoterV2.address,
    TokenValidator: tokenValidator.address,
  }
  console.log(contracts)

  writeFileSync(`./deployments/${network.name}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
