// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

/// @title Callback for IMieV3PoolActions#mint
/// @notice Any contract that calls IMieV3PoolActions#mint must implement this interface
interface IMieV3MintCallback {
    /// @notice Called to `msg.sender` after minting liquidity to a position from IMieV3Pool#mint.
    /// @dev In the implementation you must pay the pool tokens owed for the minted liquidity.
    /// The caller of this method must be checked to be a MieV3Pool deployed by the canonical MieV3Factory.
    /// @param amount0Owed The amount of token0 due to the pool for the minted liquidity
    /// @param amount1Owed The amount of token1 due to the pool for the minted liquidity
    /// @param data Any data passed through by the caller via the IMieV3PoolActions#mint call
    function MieV3MintCallback(uint256 amount0Owed, uint256 amount1Owed, bytes calldata data) external;
}
