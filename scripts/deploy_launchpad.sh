#!/bin/bash
# Example deployment script for Launchpad.tact using Tact CLI
# Usage: ./deploy_launchpad.sh

set -e

CONTRACT=../contracts/Launchpad.tact

# Compile the contract

tact compile $CONTRACT

# Deploy the contract

tact deploy $CONTRACT

echo "Launchpad contract deployed." 