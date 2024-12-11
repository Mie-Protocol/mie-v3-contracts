import { verifyContract } from '@Mieswap/common/verify'
import { sleep } from '@Mieswap/common/sleep'

async function main() {
  const networkName = network.name
  const deployedContracts = await import(`@Mieswap/v3-core/deployments/${networkName}.json`)

  // Verify MieV3PoolDeployer
  console.log('Verify MieV3PoolDeployer')
  await verifyContract(deployedContracts.MieV3PoolDeployer)
  await sleep(10000)

  // Verify MieV3Factory
  console.log('Verify MieV3Factory')
  await verifyContract(deployedContracts.MieV3Factory, [deployedContracts.MieV3PoolDeployer])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
