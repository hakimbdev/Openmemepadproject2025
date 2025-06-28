// TEP-74 Token Implementation (with fee-on-transfer)

contract Token {
    // Token metadata
    string name;
    string symbol;
    int decimals;
    int total_supply;
    address owner;
    int public transferFeeBps; // fee in basis points (e.g., 100 = 1%)

    // Balances and allowances
    map<address, int> balances;
    map<address, map<address, int>> allowances;

    // Events
    event Transfer(address from, address to, int amount);
    event Approval(address owner, address spender, int amount);
    event Mint(address to, int amount);
    event Burn(address from, int amount);
    event FeeChanged(int newFeeBps);

    // Constructor
    Token(string _name, string _symbol, int _decimals, int _initial_supply, address _owner) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        total_supply = _initial_supply;
        owner = _owner;
        balances[_owner] = _initial_supply;
        transferFeeBps = 100; // default 1%
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
    }

    void setTransferFee(int newFeeBps) onlyOwner {
        require(newFeeBps >= 0 && newFeeBps <= 1000, "Fee out of range");
        transferFeeBps = newFeeBps;
        emit FeeChanged(newFeeBps);
    }

    // Get balance of an address
    int balanceOf(address account) {
        return balances[account] ?? 0;
    }

    // Transfer tokens
    void transfer(address to, int amount) {
        require(amount > 0, "Amount must be positive");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        int fee = (amount * transferFeeBps) / 10000;
        int amountAfterFee = amount - fee;
        balances[msg.sender] -= amount;
        balances[to] += amountAfterFee;
        if (fee > 0) {
            balances[owner] += fee;
        }
        emit Transfer(msg.sender, to, amountAfterFee);
        if (fee > 0) emit Transfer(msg.sender, owner, fee);
    }

    // Approve allowance
    void approve(address spender, int amount) {
        require(amount >= 0, "Amount must be non-negative");
        if (!allowances[msg.sender]) {
            allowances[msg.sender] = map<address, int>();
        }
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
    }

    // Allowance query
    int allowance(address _owner, address spender) {
        return allowances[_owner] && allowances[_owner][spender] ? allowances[_owner][spender] : 0;
    }

    // Transfer from (delegated)
    void transferFrom(address from, address to, int amount) {
        require(amount > 0, "Amount must be positive");
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from] && allowances[from][msg.sender] >= amount, "Allowance exceeded");
        int fee = (amount * transferFeeBps) / 10000;
        int amountAfterFee = amount - fee;
        balances[from] -= amount;
        balances[to] += amountAfterFee;
        allowances[from][msg.sender] -= amount;
        if (fee > 0) {
            balances[owner] += fee;
        }
        emit Transfer(from, to, amountAfterFee);
        if (fee > 0) emit Transfer(from, owner, fee);
    }

    // Mint tokens (owner only)
    void mint(address to, int amount) onlyOwner {
        require(amount > 0, "Amount must be positive");
        balances[to] += amount;
        total_supply += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    // Burn tokens (owner only)
    void burn(address from, int amount) onlyOwner {
        require(balances[from] >= amount, "Insufficient balance");
        balances[from] -= amount;
        total_supply -= amount;
        emit Burn(from, amount);
        emit Transfer(from, address(0), amount);
    }

    // Get token metadata
    string getName() { return name; }
    string getSymbol() { return symbol; }
    int getDecimals() { return decimals; }
    int getTotalSupply() { return total_supply; }
    address getOwner() { return owner; }
} 