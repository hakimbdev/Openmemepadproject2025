// Launchpad Contract (with vesting)

contract Launchpad {
    struct Sale {
        address token;
        int pricePerToken;
        int totalTokens;
        int tokensSold;
        address owner;
        bool active;
        int vestingDuration; // in seconds
        int saleEndTime;
    }

    struct Vesting {
        int amount;
        int claimed;
        int startTime;
        int duration;
    }

    map<int, Sale> public sales;
    int public saleCount;
    map<int, map<address, Vesting>> public vestings;

    event SaleCreated(int saleId, address token, int pricePerToken, int totalTokens, address owner, int vestingDuration);
    event TokenPurchased(int saleId, address buyer, int amount, int totalPaid);
    event SaleCompleted(int saleId);
    event TokensClaimed(int saleId, address buyer, int amount);

    // Create a new token sale (owner only)
    void createSale(address token, int pricePerToken, int totalTokens, int vestingDuration) {
        saleCount += 1;
        int endTime = now() + 7 * 24 * 3600; // e.g., 7 days sale
        sales[saleCount] = Sale(token, pricePerToken, totalTokens, 0, msg.sender, true, vestingDuration, endTime);
        emit SaleCreated(saleCount, token, pricePerToken, totalTokens, msg.sender, vestingDuration);
    }

    // Buy tokens from a sale
    void buyTokens(int saleId, int amount) {
        Sale sale = sales[saleId];
        require(sale.active, "Sale not active");
        require(amount > 0 && sale.tokensSold + amount <= sale.totalTokens, "Not enough tokens left");
        int totalCost = amount * sale.pricePerToken;
        require(msg.value >= totalCost, "Insufficient payment");
        sale.tokensSold += amount;
        vestings[saleId][msg.sender] = Vesting(amount, 0, sale.saleEndTime, sale.vestingDuration);
        emit TokenPurchased(saleId, msg.sender, amount, totalCost);
        if (sale.tokensSold == sale.totalTokens) {
            sale.active = false;
            emit SaleCompleted(saleId);
        }
        sales[saleId] = sale;
    }

    void claimTokens(int saleId) {
        Vesting v = vestings[saleId][msg.sender];
        require(v.amount > 0, "No tokens to claim");
        int elapsed = now() - v.startTime;
        int vested = v.amount * (elapsed >= v.duration ? 1 : elapsed) / v.duration;
        int claimable = vested - v.claimed;
        require(claimable > 0, "Nothing to claim");
        v.claimed += claimable;
        // In a real implementation, transfer claimable tokens to buyer
        vestings[saleId][msg.sender] = v;
        emit TokensClaimed(saleId, msg.sender, claimable);
    }

    // Get sale info
    Sale getSale(int saleId) {
        return sales[saleId];
    }
} 