// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IMieV3PoolImmutables.sol';
import './pool/IMieV3PoolState.sol';
import './pool/IMieV3PoolDerivedState.sol';
import './pool/IMieV3PoolActions.sol';
import './pool/IMieV3PoolOwnerActions.sol';
import './pool/IMieV3PoolEvents.sol';

/// @title The interface for a MieSwap V3 Pool
/// @notice A MieSwap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IMieV3Pool is
    IMieV3PoolImmutables,
    IMieV3PoolState,
    IMieV3PoolDerivedState,
    IMieV3PoolActions,
    IMieV3PoolOwnerActions,
    IMieV3PoolEvents
{}
