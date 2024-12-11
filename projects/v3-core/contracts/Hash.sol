// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
import './MieV3Pool.sol';
contract Hash {
    bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(MieV3Pool).creationCode));
}
