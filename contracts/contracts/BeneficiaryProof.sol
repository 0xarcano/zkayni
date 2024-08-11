// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./MerkleProof.sol";

contract BeneficiaryProof is MerkleProof {
    bytes32[] public hashes;
    bytes32[] public leafs;

    constructor(address[] memory _beneficiaries) {
        address[] memory beneficiaries = _beneficiaries;

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            hashes.push(keccak256(abi.encodePacked(beneficiaries[i])));
        }

        leafs = hashes;

        uint256 n = beneficiaries.length;
        uint256 offset = 0;

        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i], hashes[offset + i + 1]
                        )
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }

    function getLeafs() public view returns (bytes32[] memory){
        return leafs;
    }

}