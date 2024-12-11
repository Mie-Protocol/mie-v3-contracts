import { ethers } from 'hardhat'
import MieV3PoolArtifact from '../artifacts/contracts/MieV3Pool.sol/MieV3Pool.json'

const hash = ethers.utils.keccak256(MieV3PoolArtifact.bytecode)
console.log(hash)
