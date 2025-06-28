// Token Factory Contract (with access control, fee, and allowlist)
import "./Token.tact";

contract TokenFactory {
    // List of created token addresses
    address[] public tokens;
    address public owner;
    int public creationFee;
    int public collectedFees;
    map<address, bool> public allowlist;

    // Event for new token creation
    event TokenCreated(address token, string name, string symbol, int decimals, int initial_supply, address owner);
    event FeeWithdrawn(address to, int amount);
    event AllowlistUpdated(address user, bool allowed);
    event CreationFeeUpdated(int newFee);

    // Constructor
    TokenFactory(address _owner, int _creationFee) {
        owner = _owner;
        creationFee = _creationFee;
        collectedFees = 0;
        allowlist[_owner] = true;
    }

    // Modifier for owner-only functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
    }

    // Add or remove an address from the allowlist (owner only)
    void setAllowlist(address user, bool allowed) onlyOwner {
        allowlist[user] = allowed;
        emit AllowlistUpdated(user, allowed);
    }

    // Update the creation fee (owner only)
    void setCreationFee(int newFee) onlyOwner {
        creationFee = newFee;
        emit CreationFeeUpdated(newFee);
    }

    // Create a new token (allowlist only, must pay fee)
    void createToken(string name, string symbol, int decimals, int initial_supply, address tokenOwner) {
        require(allowlist[msg.sender], "Not allowed to create tokens");
        require(msg.value >= creationFee, "Insufficient fee");
        address token = new Token(name, symbol, decimals, initial_supply, tokenOwner);
        tokens.push(token);
        collectedFees += msg.value;
        emit TokenCreated(token, name, symbol, decimals, initial_supply, tokenOwner);
    }

    // Withdraw collected fees (owner only)
    void withdrawFees(address to) onlyOwner {
        require(collectedFees > 0, "No fees to withdraw");
        int amount = collectedFees;
        collectedFees = 0;
        // Send fees to owner
        to.transfer(amount);
        emit FeeWithdrawn(to, amount);
    }

    // Get all created tokens
    address[] getTokens() {
        return tokens;
    }
} 