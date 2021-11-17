import React, { useContext, useState } from "react";
import AppContext  from "./AppContext";
import nftAbi from "../abis/ERC721";
// import { NftProvider, useNft } from "use-nft";

const Form = ({swapAddress}) => {
    const globalContext = useContext(AppContext);
    //const account = globalContext.accounts[0];

    const [showTrade, setShowTrade] = useState(true);
    const [receiver, setReceiver] = useState('');
    const [hashLock, setHashLock] = useState('');
    const [tokenContract, setTokenContract] = useState('');
    const [tokenId, setTokenId] = useState('');

    const [requestedContract, setRequestedContract] = useState('');
    const [requestedId, setRequestedId] = useState('');

    const [tradeId, setTradeId] = useState('');
    const [hash, setHash] = useState('');

    const formData = {
        receiver,
        hashLock,
        tokenContract,
        tokenId,
        requestedContract,
        requestedId
    };

    const withdrawData = {
        tradeId,
        hash
    }

   

    const getContractFunc = async () => {
        const account = globalContext.accounts[0];
        // const data = {
        //     receiver: '0x5cc51e3550e12571146962F69b78701925c6B174',
        //     hashLock: '0x37a57542613fc4088aefd44a8e4378c8cfae4e5206',
        //     tokenContract: '0x121c84a9b62b4a5667bc57db3d26cc1c85eb550c',
        //     tokenId: 1,
        //     requestedContract: '0x121c84a9b62b4a5667bc57db3d26cc1c85eb550c',
        //     requestedId: 2
        // }
        const { newContract } = globalContext.instances.contract.methods;
        // console.log(newContract);
        const nftInstance = new globalContext.instances.web3.eth.Contract(
            nftAbi,
            formData.tokenContract
        );
        const res = await nftInstance.methods.approve(swapAddress, formData.tokenId).send({from: account});

        console.log(res);
        //const { approve } = globalContext.instances.contract.methods;
        //approve('0xb4e912C0ED3B356af88Ee2587250875d4676Ca02', '0')
        const amount = globalContext.instances.web3.utils.toWei('0.00069', 'ether');
        const result = await newContract(formData.receiver, formData.hashLock, formData.tokenContract, formData.tokenId, formData.requestedContract, formData.requestedId).send({from: account, value: amount});
        console.log(result);

    }

    const switchView = () => {
        if(showTrade) {
            setShowTrade(false);
        } else {
            setShowTrade(true);
        }
        
    }

    const getFormValues = (e) => {
        e.preventDefault();
        console.log(formData);
        getContractFunc();
    }



    const withdrawAsset = async () => {
       // console.log(globalContext.instances.contract);
        const account = globalContext.accounts[0];
        console.log(globalContext.instances.contract);
        const { getContract } = globalContext.instances.contract.methods;
        const contractData = await getContract(parseInt(withdrawData.tradeId)).call({from: account});

        const nftInstance = new globalContext.instances.web3.eth.Contract(
            nftAbi,
            contractData.tokenContract
        );

        console.log(contractData);

        const res = await  nftInstance.methods.approve(swapAddress, 193).send({from: account});

        console.log(res);
        const { withdraw } = globalContext.instances.contract.methods;
        const amount = globalContext.instances.web3.utils.toWei('0.00069', 'ether');
        const result = await withdraw(parseInt(withdrawData.tradeId), withdrawData.hash).send({from: account, value: amount});
        console.log(result);


    }

    const getWithdrawValues = async (e) => {
        e.preventDefault();
        console.log(withdrawData);
        withdrawAsset();
    }

    return (
        <div>
            <div className="button-div">
                <button onClick={switchView}>
                    Make a trade
                </button>

                <button onClick={switchView}>
                    Withdraw
                </button>
            </div>
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col col-10 text-left">
                    {showTrade ? 
                    <form>
                        <div className="form-group">
                            <label htmlFor="receiverAddress">Receiver address</label>
                            <input type="text" className="form-control" id="receiverAddress" placeholder="Enter receiver address" onChange={(e) => {setReceiver(e.target.value)}} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="senderTokenContract">Your token Contract</label>
                            <input type="text" className="form-control" id="senderTokenContract" placeholder="Sender token contract address" onChange={(e) => {setTokenContract(e.target.value)}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="senderTokenId">Your token ID</label>
                            <input type="text" className="form-control" id="senderTokenId" placeholder="Sender token ID" onChange={(e) => {setTokenId(e.target.value)}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="receiverTokenContract">Receiver token Contract</label>
                            <input type="text" className="form-control" id="receiverTokenContract" placeholder="Receover token contract address" onChange={(e) => {setRequestedContract(e.target.value)}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="receiverTokenId">Receiver token ID</label>
                            <input type="text" className="form-control" id="receiverTokenId" placeholder="Receiver token ID" onChange={(e) => {setRequestedId(e.target.value)}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="hashlock">Hash lock</label>
                            <input type="text" className="form-control" id="hashlock" placeholder="Hash Lock" onChange={(e) => {setHashLock(e.target.value)}}/>
                        </div>
                        <button type="submit" onClick={getFormValues}  className="btn btn-primary">Submit</button>
                        </form>
                        : 
                            <form>
                                <div className="form-group">
                                    <label htmlFor="trade ID">Trade ID</label>
                                    <input type="text" className="form-control" id="tradeId" placeholder="Trade ID" onChange={(e) => {setTradeId(e.target.value)}}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Hash">Hash</label>
                                    <input type="text" className="form-control" id="hash" placeholder="Hash" onChange={(e) => {setHash(e.target.value)}}/>
                                </div>
                                <button type="submit" onClick={getWithdrawValues} className="btn btn-primary">Withdraw</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
            
        </div>
        
    );
}

export default Form;
