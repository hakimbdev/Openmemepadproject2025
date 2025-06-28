#!/bin/bash
# Example deployment script for TokenFactory.tact using Tact CLI
# Usage: ./deploy_token_factory.sh <owner_address> <creation_fee>

set -e

CONTRACT=../contracts/TokenFactory.tact
OWNER_ADDRESS=${1:-"<owner_address>"}
CREATION_FEE=${2:-10000000} # Example: 0.01 TON in nanotons

# Compile the contract

tact compile $CONTRACT

# Deploy the contract

tact deploy $CONTRACT \
    --arg _owner:$OWNER_ADDRESS \
    --arg _creationFee:$CREATION_FEE

echo "TokenFactory contract deployed with owner $OWNER_ADDRESS and creation fee $CREATION_FEE." 