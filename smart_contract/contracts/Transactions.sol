 //SPDX-License-Identifier: UNLICENSED
 pragma solidity ^0.8.0;

 contract Transactions {
    uint256 transactionCount;


    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct{
        address sender;
        address receiver;
        uint amount; 
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    //esta funcion añade una transacción al array y emite un evento
    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public{
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender,receiver,amount,message,block.timestamp,keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    //devuelve todas las transacciones (para despues mostrarlas en el front)
    function getAllTransactions() public view returns (TransferStruct[] memory){
        return transactions;
    }

    //devolvera el numero total de transacciones
    function getTransactionCount() public view returns (uint256){
        return transactionCount;
    }
 }