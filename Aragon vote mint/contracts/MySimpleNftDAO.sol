// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@aragon/osx/core/dao/IDAO.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract MySimpleNftDAO is IDAO, ERC165 {
    address public nft;
    address public activePlugin;
    address public owner;

    // where -> permissionId -> who -> bool
    mapping(address => mapping(bytes32 => mapping(address => bool))) internal _permissions;

    constructor(address _nft) {
        nft = _nft;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // ===============================================================
    // IDAO Implementation
    // ===============================================================

    function hasPermission(
        address _where,
        address _who,
        bytes32 _permissionId,
        bytes calldata /*_data*/
    ) external view override returns (bool) {
        return _permissions[_where][_permissionId][_who];
    }

    function setMetadata(bytes calldata /*_metadata*/) external override {
        // No-op for demo
    }

    function execute(
        bytes32 /*_callId*/,
        Action[] calldata _actions,
        uint256 /*_allowFailureMap*/
    ) external override returns (bytes[] memory results, uint256 failureMap) {
        require(msg.sender == activePlugin || msg.sender == owner, "Not authorized to execute");

        results = new bytes[](_actions.length);
        failureMap = 0;

        for (uint256 i = 0; i < _actions.length; i++) {
            (bool success, bytes memory result) = _actions[i].to.call{value: _actions[i].value}(_actions[i].data);
            
            if (!success) {
                // If failure is allowed (logic omitted for simplicity), we could continue
                // But generally we revert
                revert("Execution failed");
            }
            results[i] = result;
        }
    }

    function deposit(
        address /*_token*/,
        uint256 /*_amount*/,
        string calldata /*_reference*/
    ) external payable override {
        // Accept funds
    }

    function setSignatureValidator(address /*_signatureValidator*/) external override {
        // No-op
    }

    function isValidSignature(bytes32 /*_hash*/, bytes memory /*_signature*/) external view override returns (bytes4) {
        return 0xffffffff; // Always valid for demo
    }

    function registerStandardCallback(bytes4 /*_interfaceId*/, bytes4 /*_callbackSelector*/, bytes4 /*_magicNumber*/) external override {
        // No-op
    }

    address public trustedForwarder;

    function setTrustedForwarder(address _trustedForwarder) external override {
        trustedForwarder = _trustedForwarder;
    }

    function getTrustedForwarder() external view override returns (address) {
        return trustedForwarder;
    }

    // ===============================================================
    // ERC165
    // ===============================================================

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IDAO).interfaceId || super.supportsInterface(interfaceId);
    }

    // ===============================================================
    // Custom Logic for dao.js compatibility
    // ===============================================================

    function activatePlugin(address _plugin) external onlyOwner {
        activePlugin = _plugin;
    }

    function grantPermission(bytes32 _permissionId, address _who) external onlyOwner {
        // Grants permission on the active plugin (target = plugin)
        require(activePlugin != address(0), "No active plugin");
        _permissions[activePlugin][_permissionId][_who] = true;
    }
}
