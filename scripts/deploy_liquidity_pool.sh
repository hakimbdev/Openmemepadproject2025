#!/bin/bash
# Example deployment script for LiquidityPool.tact using Tact CLI
# Usage: ./deploy_liquidity_pool.sh <tokenA_address> <tokenB_address> <owner_address>

set -e

CONTRACT=../contracts/LiquidityPool.tact
TOKEN_A=${1:-"<tokenA_address>"}
TOKEN_B=${2:-"<tokenB_address>"}
OWNER_ADDRESS=${3:-"<owner_address>"}

# Compile the contract

tact compile $CONTRACT

# Deploy the contract

tact deploy $CONTRACT \
    --arg _tokenA:$TOKEN_A \
    --arg _tokenB:$TOKEN_B \
    --arg _owner:$OWNER_ADDRESS

echo "LiquidityPool contract deployed for tokens $TOKEN_A and $TOKEN_B with owner $OWNER_ADDRESS." 