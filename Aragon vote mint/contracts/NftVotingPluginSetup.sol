// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@aragon/osx/framework/plugin/setup/PluginSetup.sol";
import "@aragon/osx/framework/plugin/setup/IPluginSetup.sol";
import "@aragon/osx/core/permission/PermissionLib.sol";
import "@aragon/osx/core/dao/IDAO.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "./NftVotingPlugin.sol";

contract NftVotingPluginSetup is PluginSetup {
    bytes32 public constant EXECUTE_PERMISSION_ID =
        keccak256("EXECUTE_PERMISSION");

    event PluginDeployed(address plugin);

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes calldata _data
    )
        external
        override
        returns (
            address plugin,
            IPluginSetup.PreparedSetupData memory preparedSetupData
        )
    {
        address nftToken = abi.decode(_data, (address));
        require(nftToken != address(0), "Invalid NFT token");

        NftVotingPlugin pluginContract = new NftVotingPlugin(
            IDAO(_dao),
            IERC721Enumerable(nftToken)
        );
        plugin = address(pluginContract);

        // Transfer ownership to the deployer (msg.sender)
        pluginContract.transferOwnership(msg.sender);

        // 1 permission: DAO -> plugin, EXECUTE
        PermissionLib.MultiTargetPermission[]
            memory permissions = new PermissionLib.MultiTargetPermission[](1);

        permissions[0] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Grant,
            where: _dao,
            who: plugin,
            condition: PermissionLib.NO_CONDITION,
            permissionId: EXECUTE_PERMISSION_ID
        });

        // helpers is an empty array
        preparedSetupData.helpers = new address[](0);
        preparedSetupData.permissions = permissions;

        emit PluginDeployed(plugin);
        return (plugin, preparedSetupData);
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        IPluginSetup.SetupPayload calldata _payload
    )
        external
        view
        override
        returns (PermissionLib.MultiTargetPermission[] memory permissions)
    {
        // Revoke the same permission granted in installation
        permissions = new PermissionLib.MultiTargetPermission[](1);
        permissions[0] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Revoke,
            where: _dao,
            who: _payload.plugin,
            condition: PermissionLib.NO_CONDITION,
            permissionId: EXECUTE_PERMISSION_ID
        });
    }

    /// @inheritdoc IPluginSetup
    function prepareUpdate(
        address,
        uint16,
        IPluginSetup.SetupPayload calldata
    )
        external
        pure
        override
        returns (bytes memory, IPluginSetup.PreparedSetupData memory)
    {
        revert("Non-upgradeable plugin");
    }

    function getPermissions()
        public
        pure
        returns (PermissionLib.MultiTargetPermission[] memory permissions)
    {
        permissions = new PermissionLib.MultiTargetPermission[](1);
        permissions[0] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Grant,
            where: address(0),
            who: address(0),
            condition: PermissionLib.NO_CONDITION,
            permissionId: EXECUTE_PERMISSION_ID
        });
    }

    /// @inheritdoc IPluginSetup
    function implementation() external pure override returns (address) {
        // Not used for this simple non‑upgradeable pattern
        return address(0);
    }
}
