#!/bin/bash
# Example deployment script for Token.tact using Tact CLI
# Usage: ./deploy_token_contract.sh <owner_address>

set -e

CONTRACT=../contracts/Token.tact
NAME="MyToken"
SYMBOL="MTK"
DECIMALS=9
INITIAL_SUPPLY=1000000000
OWNER_ADDRESS=${1:-"<owner_address>"}

# Compile the contract

tact compile $CONTRACT

# Deploy the contract

tact deploy $CONTRACT \
    --arg name:$NAME \
    --arg symbol:$SYMBOL \
    --arg decimals:$DECIMALS \
    --arg initial_supply:$INITIAL_SUPPLY \
    --arg owner:$OWNER_ADDRESS

echo "Token contract deployed with name $NAME, symbol $SYMBOL, decimals $DECIMALS, initial supply $INITIAL_SUPPLY, owner $OWNER_ADDRESS." 