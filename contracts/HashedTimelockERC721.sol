pragma solidity 0.8.0; 

  import "../node_modules/openzeppelin-solidity/contracts/utils/Context.sol";
  import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Burnable.sol";
  import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
  import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
  import "../node_modules/openzeppelin-solidity/contracts/utils/Counters.sol";
  import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
  import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract HashedTimelockERC721 {

    event HTLCERC721New(
        uint256 indexed contractId,
        address indexed sender,
        address indexed receiver,
        address tokenContract,
        uint256 tokenId,
        string hashlock,
        address requestedcontract,
        uint256 requestedid
    );
    event HTLCERC721Withdraw(uint256 indexed contractId);
    event HTLCERC721Refund(uint256 indexed contractId);

    struct LockContract {
        address Sender;
        address receiver;
        address tokenContract;
        uint256 tokenId;
        string hashlock;
        address requestedcontract;
        uint256 requestedid;
        bool withdrawn;
        bool refunded;
        string preimage;
    }

    modifier tokensTransferable(address _token, uint256 _tokenId) {
        // ensure this contract is approved to transfer the designated token
        // so that it is able to honor the claim request later
        require(
            ERC721(_token).getApproved(_tokenId) == address(this),
            "The HTLC must have been designated an approved spender for the tokenId"
        );
        _; 
    }
    
    modifier contractExists(uint256 _contractId) {
        require(haveContract(_contractId), "contractId does not exist");
        _;
    }
    
    modifier withdrawable(uint256 _contractId) {
        require(contracts[_contractId].receiver == msg.sender, "withdrawable: not receiver");
        require(contracts[_contractId].withdrawn == false, "withdrawable: already withdrawn");
        _;
    }
    modifier refundable(uint256 _contractId) {
        require(contracts[_contractId].Sender == msg.sender, "refundable: not sender");
        require(contracts[_contractId].refunded == false, "refundable: already refunded");
        require(contracts[_contractId].withdrawn == false, "refundable: already withdrawn");
        _;
    }
    uint256 contractId = 0;
    uint256 verificatonfees;
    uint256 ExchangeFees = 0.00069 ether;
    mapping(address => bool) public whiteListedAddress;
    mapping (uint256 => LockContract) contracts;
    mapping(address => uint256[]) Trades;
    
    /**
     * @dev Sender / Payer sets up a new hash time lock contract depositing the
     * funds and providing the reciever and terms.
     *
     * NOTE: _receiver must first call approve() on the token contract.
     *       See isApprovedOrOwner check in tokensTransferable modifier.
     * @param _receiver Receiver of the tokens.
     * @param _hashlock A sha-2 sha256 hash hashlock.
     * @param _tokenContract ERC20 Token contract address.
     * @param _tokenId Id of the token to lock up.
     * @param _requestedcontract contract address for the requestednft.
     * @param _requestedid tokenid for the requested id.
     */
    function newContract(
        address _receiver,
        string memory _hashlock,
        address _tokenContract,
        uint256 _tokenId,
        address _requestedcontract,
        uint256 _requestedid
    )
        external
        payable
        tokensTransferable(_tokenContract, _tokenId)
        returns (uint256 _contractId)
    {
       _contractId = contractId;
       if(validateaddress(_tokenContract)!=true){
           require(msg.value>=ExchangeFees);
       }
        // This contract becomes the temporary owner of the token
    ERC721(_tokenContract).transferFrom(msg.sender, address(this), _tokenId);

        contracts[contractId] = LockContract(
            msg.sender,
            _receiver,
            _tokenContract,
            _tokenId,
            _hashlock,
            _requestedcontract,
            _requestedid,
            false,
            false,
            _hashlock
        );
        
        contractId++;
        
        Trades[msg.sender].push(_contractId);

        emit HTLCERC721New(
            _contractId,
            msg.sender,
            _receiver,
            _tokenContract,
            _tokenId,
            _hashlock,
            _requestedcontract,
            _requestedid
        );
    }

    /**
    * @dev Called by the receiver once they know the preimage of the hashlock.
    * This will transfer ownership of the locked tokens to their address.
    *
    * @param _contractId Id of the HTLC.
    * @param _preimage sha256(_preimage) should equal the contract hashlock.
    * @return bool true on success
     */
    function withdraw(uint256 _contractId,string memory _preimage)
        external
        payable
        contractExists(_contractId)
        withdrawable(_contractId)
        returns (bool)
    {
        
        LockContract storage c = contracts[_contractId];
        if(validateaddress(c.tokenContract)!=true){
           require(msg.value>=ExchangeFees);
        }
        c.hashlock = _preimage;
        ERC721(c.requestedcontract).transferFrom(msg.sender, c.Sender, c.requestedid);
        ERC721(c.tokenContract).transferFrom(address(this), c.receiver, c.tokenId);
        c.withdrawn = true;
        emit HTLCERC721Withdraw(contractId);
        return true;
    }

    /**
     * @dev Called by the sender if there was no withdraw AND the time lock has
     * expired. This will restore ownership of the tokens to the sender.
     *
     * @param _contractId Id of HTLC to refund from.
     * @return bool true on success
     */
    function refund(uint256 _contractId)
        external
        contractExists(_contractId)
        refundable(_contractId)
        returns (bool)
    {
        LockContract storage c = contracts[_contractId];
        c.refunded = true;
        ERC721(c.tokenContract).transferFrom(address(this), c.Sender, c.tokenId);
        emit HTLCERC721Refund(_contractId);
        return true;
    }
    
    function SetverificationFees(uint256 _Amount)public{
        verificatonfees = _Amount;
    }
    
    function SubmitContract(address _collectibleAddress)public payable{
        require(msg.value >= verificatonfees);
        if (msg.sender !=Owner(_collectibleAddress)){
            revert("you are not the Owner of this coolectible");
        }
        whiteListedAddress[_collectibleAddress]=true;
    }

    
    // * @dev Get contract details.
    // * @param _contractId HTLC contract id
     //* @return All parameters in struct LockContract for _contractId HTLC
     
    function getContract(uint256 _contractId)
        public
        view
        returns (
            address sender,
            address receiver,
            address tokenContract,
            uint256 tokenId,
            string memory hashlock,
            bool withdrawn,
            bool refunded,
            string memory preimage
        )
    {
        if (haveContract(_contractId) == false)
             return (address(0), address(0), address(0), 0, "",false, false, "");
        LockContract storage c = contracts[_contractId];
        return (
            c.Sender,
            c.receiver,
            c.tokenContract,
            c.tokenId,
            c.hashlock,
            c.withdrawn,
            c.refunded,
            c.preimage
        );
    }

    /**
     * @dev Is there a contract with id _contractId.
     * @param _contractId Id into contracts mapping.
     */
    function haveContract(uint256 _contractId)
        internal
        view
        returns (bool exists)
    {
        exists = (contracts[_contractId].Sender != address(0));
    }
    
    
    function MyTrades(address _Address) public view returns(uint256[]memory){
      return Trades[_Address];
    }
    
    function AllTrades()public view returns(uint256){
        return contractId;
    }
    
    function Owner(address _CollectibleAddress)internal view returns(address){
        return Ownable(_CollectibleAddress).owner();
    }
    
    
    function validateaddress (address _address) public view returns(bool){
        if(whiteListedAddress[_address]!=true){
          return false;
        }else{
            return true;
        }
    }
}