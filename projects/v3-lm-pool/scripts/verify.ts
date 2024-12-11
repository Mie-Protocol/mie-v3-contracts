import { verifyContract } from '@Mieswap/common/verify'
import { sleep } from '@Mieswap/common/sleep'
import { configs } from '@Mieswap/common/config'

async function main() {
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]

  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }
  const deployedContracts_masterchef_v3 = await import(`@Mieswap/masterchef-v3/deployments/${networkName}.json`)
  const deployedContracts_v3_lm_pool = await import(`@Mieswap/v3-lm-pool/deployments/${networkName}.json`)

  // Verify MieV3LmPoolDeployer
  console.log('Verify MieV3LmPoolDeployer')
  await verifyContract(deployedContracts_v3_lm_pool.MieV3LmPoolDeployer, [deployedContracts_masterchef_v3.MasterChefV3])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
