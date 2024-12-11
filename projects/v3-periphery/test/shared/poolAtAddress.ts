import { abi as POOL_ABI } from '@Mieswap/v3-core/artifacts/contracts/MieV3Pool.sol/MieV3Pool.json'
import { Contract, Wallet } from 'ethers'
import { IMieV3Pool } from '../../typechain-types'

export default function poolAtAddress(address: string, wallet: Wallet): IMieV3Pool {
  return new Contract(address, POOL_ABI, wallet) as IMieV3Pool
}
