import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeMieV3Pool } from '../../typechain-types/contracts/test/MockTimeMieV3Pool'
import { TestERC20 } from '../../typechain-types/contracts/test/TestERC20'
import { MieV3Factory } from '../../typechain-types/contracts/MieV3Factory'
import { MieV3PoolDeployer } from '../../typechain-types/contracts/MieV3PoolDeployer'
import { TestMieV3Callee } from '../../typechain-types/contracts/test/TestMieV3Callee'
import { TestMieV3Router } from '../../typechain-types/contracts/test/TestMieV3Router'
import { MockTimeMieV3PoolDeployer } from '../../typechain-types/contracts/test/MockTimeMieV3PoolDeployer'
import MieV3LmPoolArtifact from '@Mieswap/v3-lm-pool/artifacts/contracts/MieV3LmPool.sol/MieV3LmPool.json'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: MieV3Factory
}

interface DeployerFixture {
  deployer: MieV3PoolDeployer
}

async function factoryFixture(): Promise<FactoryFixture> {
  const { deployer } = await deployerFixture()
  const factoryFactory = await ethers.getContractFactory('MieV3Factory')
  const factory = (await factoryFactory.deploy(deployer.address)) as MieV3Factory
  return { factory }
}
async function deployerFixture(): Promise<DeployerFixture> {
  const deployerFactory = await ethers.getContractFactory('MieV3PoolDeployer')
  const deployer = (await deployerFactory.deploy()) as MieV3PoolDeployer
  return { deployer }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestMieV3Callee
  swapTargetRouter: TestMieV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeMieV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeMieV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeMieV3PoolDeployer')
  const MockTimeMieV3PoolFactory = await ethers.getContractFactory('MockTimeMieV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestMieV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestMieV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestMieV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestMieV3Router

  const MieV3LmPoolFactory = await ethers.getContractFactoryFromArtifact(MieV3LmPoolArtifact)

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimeMieV3PoolDeployerFactory.deploy()) as MockTimeMieV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string

      const mockTimeMieV3Pool = MockTimeMieV3PoolFactory.attach(poolAddress) as MockTimeMieV3Pool

      await (
        await factory.setLmPool(
          poolAddress,
          (
            await MieV3LmPoolFactory.deploy(poolAddress, ethers.constants.AddressZero, Math.floor(Date.now() / 1000))
          ).address
        )
      ).wait()

      return mockTimeMieV3Pool
    },
  }
}
