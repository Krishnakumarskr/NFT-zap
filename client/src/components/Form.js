import React, { useContext } from "react";
import AppContext  from "./AppContext";
import nftAbi from "../abis/ERC721";

const Form = ({swapAddress}) => {
    const globalContext = useContext(AppContext);
    
    const getContractFunc = async () => {
        const account = globalContext.accounts[0];
        const data = {
            receiver: '0xb4e912C0ED3B356af88Ee2587250875d4676Ca02',
            hashLock: '0x37a57542613fc4088aefd44a8e4378c8cfae4e5206',
            tokenContract: '0xB2Ee5deE09268e2bDb02b67268F345E298164826',
            tokenId: 1,
            requestedContract: '0xB2Ee5deE09268e2bDb02b67268F345E298164826',
            requestedId: 2
        }
        const { newContract } = globalContext.instances.contract.methods;
        // console.log(newContract);
        const nftInstance = new globalContext.instances.web3.eth.Contract(
            nftAbi,
            data.tokenContract
        );
        const res = await nftInstance.methods.approve(swapAddress, data.tokenId).send({from: account});

        console.log(res);
        //const { approve } = globalContext.instances.contract.methods;
        //approve('0xb4e912C0ED3B356af88Ee2587250875d4676Ca02', '0')
        const result = await newContract(data.receiver, data.hashLock, data.tokenContract, data.tokenId, data.requestedContract, data.requestedId).send({from: account});
        console.log(result);

    }
    return (
        <button onClick={getContractFunc}>
            Get contract
        </button>
    );
}

export default Form;
