// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IMieV3Pool.sol";
import "./ILMPool.sol";

interface ILMPoolDeployer {
    function deploy(IMieV3Pool pool) external returns (ILMPool lmPool);
}
