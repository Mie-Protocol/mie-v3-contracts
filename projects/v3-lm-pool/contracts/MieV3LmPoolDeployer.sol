// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;

import '@Mieswap/v3-core/contracts/interfaces/IMieV3Factory.sol';
import '@Mieswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol';

import './MieV3LmPool.sol';

/// @dev This contract is for Master Chef to create a corresponding LmPool when
/// adding a new farming pool. As for why not just create LmPool inside the
/// Master Chef contract is merely due to the imcompatibility of the solidity
/// versions.
contract MieV3LmPoolDeployer {
    address public immutable masterChef;

    modifier onlyMasterChef() {
        require(msg.sender == masterChef, 'Not MC');
        _;
    }

    constructor(address _masterChef) {
        masterChef = _masterChef;
    }

    /// @dev Deploys a LmPool
    /// @param pool The contract address of the MieSwap V3 pool
    function deploy(IMieV3Pool pool) external onlyMasterChef returns (IMieV3LmPool lmPool) {
        lmPool = new MieV3LmPool(address(pool), masterChef, uint32(block.timestamp));
        IMieV3Factory(INonfungiblePositionManager(IMasterChefV3(masterChef).nonfungiblePositionManager()).factory())
            .setLmPool(address(pool), address(lmPool));
    }
}
