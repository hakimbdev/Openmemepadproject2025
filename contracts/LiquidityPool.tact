// Liquidity Pool Contract (with swap fee)

contract LiquidityPool {
    address public tokenA;
    address public tokenB;
    int public reserveA;
    int public reserveB;
    map<address, int> public lpBalances;
    int public totalLPSupply;
    address public owner;
    int public swapFeeBps; // e.g., 30 = 0.3%
    int public collectedFeesA;
    int public collectedFeesB;

    event LiquidityAdded(address provider, int amountA, int amountB, int lpTokensMinted);
    event LiquidityRemoved(address provider, int amountA, int amountB, int lpTokensBurned);
    event Swap(address trader, address fromToken, address toToken, int amountIn, int amountOut, int fee);
    event FeesWithdrawn(address to, int amountA, int amountB);

    // Constructor
    LiquidityPool(address _tokenA, address _tokenB, address _owner) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        reserveA = 0;
        reserveB = 0;
        totalLPSupply = 0;
        owner = _owner;
        swapFeeBps = 30; // 0.3%
        collectedFeesA = 0;
        collectedFeesB = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
    }

    void setSwapFee(int newFeeBps) onlyOwner {
        require(newFeeBps >= 0 && newFeeBps <= 1000, "Fee out of range");
        swapFeeBps = newFeeBps;
    }

    // Add liquidity
    void addLiquidity(int amountA, int amountB) {
        // In a real implementation, transfer tokens from provider to pool
        reserveA += amountA;
        reserveB += amountB;
        int lpMinted = (amountA + amountB) / 2; // Simplified
        lpBalances[msg.sender] += lpMinted;
        totalLPSupply += lpMinted;
        emit LiquidityAdded(msg.sender, amountA, amountB, lpMinted);
    }

    // Remove liquidity
    void removeLiquidity(int lpAmount) {
        require(lpBalances[msg.sender] >= lpAmount, "Not enough LP tokens");
        int amountA = (reserveA * lpAmount) / totalLPSupply;
        int amountB = (reserveB * lpAmount) / totalLPSupply;
        reserveA -= amountA;
        reserveB -= amountB;
        lpBalances[msg.sender] -= lpAmount;
        totalLPSupply -= lpAmount;
        // In a real implementation, transfer tokens from pool to provider
        emit LiquidityRemoved(msg.sender, amountA, amountB, lpAmount);
    }

    // Swap tokenA for tokenB (simplified, no fees)
    void swapAForB(int amountAIn) {
        require(reserveA > 0 && reserveB > 0, "No liquidity");
        int fee = (amountAIn * swapFeeBps) / 10000;
        int amountAInAfterFee = amountAIn - fee;
        int amountBOut = (amountAInAfterFee * reserveB) / (reserveA + amountAInAfterFee);
        reserveA += amountAInAfterFee;
        reserveB -= amountBOut;
        collectedFeesA += fee;
        // In a real implementation, transfer tokens accordingly
        emit Swap(msg.sender, tokenA, tokenB, amountAIn, amountBOut, fee);
    }

    // Swap tokenB for tokenA (simplified, no fees)
    void swapBForA(int amountBIn) {
        require(reserveA > 0 && reserveB > 0, "No liquidity");
        int fee = (amountBIn * swapFeeBps) / 10000;
        int amountBInAfterFee = amountBIn - fee;
        int amountAOut = (amountBInAfterFee * reserveA) / (reserveB + amountBInAfterFee);
        reserveB += amountBInAfterFee;
        reserveA -= amountAOut;
        collectedFeesB += fee;
        // In a real implementation, transfer tokens accordingly
        emit Swap(msg.sender, tokenB, tokenA, amountBIn, amountAOut, fee);
    }

    void withdrawFees(address to) onlyOwner {
        int amountA = collectedFeesA;
        int amountB = collectedFeesB;
        collectedFeesA = 0;
        collectedFeesB = 0;
        // In a real implementation, transfer tokens to owner
        emit FeesWithdrawn(to, amountA, amountB);
    }
} 