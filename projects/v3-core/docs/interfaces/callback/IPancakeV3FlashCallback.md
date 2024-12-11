# Solidity API

## IMieV3FlashCallback

Any contract that calls IMieV3PoolActions#flash must implement this interface

### MieV3FlashCallback

```solidity
function MieV3FlashCallback(uint256 fee0, uint256 fee1, bytes data) external
```

Called to `msg.sender` after transferring to the recipient from IMieV3Pool#flash.

_In the implementation you must repay the pool the tokens sent by flash plus the computed fee amounts.
The caller of this method must be checked to be a MieV3Pool deployed by the canonical MieV3Factory._

#### Parameters

| Name | Type    | Description                                                                |
| ---- | ------- | -------------------------------------------------------------------------- |
| fee0 | uint256 | The fee amount in token0 due to the pool by the end of the flash           |
| fee1 | uint256 | The fee amount in token1 due to the pool by the end of the flash           |
| data | bytes   | Any data passed through by the caller via the IMieV3PoolActions#flash call |
