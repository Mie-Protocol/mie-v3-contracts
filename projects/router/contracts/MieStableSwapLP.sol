// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
// pragma abicoder v2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MieStableSwapLP is ERC20 {
    address public minter;

    constructor() ERC20('Mie StableSwap LPs', 'Stable-LP') {
        minter = msg.sender;
    }

    /**
     * @notice Checks if the msg.sender is the minter address.
     */
    modifier onlyMinter() {
        require(msg.sender == minter, 'Not minter');
        _;
    }

    function setMinter(address _newMinter) external onlyMinter {
        minter = _newMinter;
    }

    function mint(address _to, uint256 _amount) external onlyMinter {
        _mint(_to, _amount);
    }

    function burnFrom(address _to, uint256 _amount) external onlyMinter {
        _burn(_to, _amount);
    }
}
