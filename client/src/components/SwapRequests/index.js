import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {Row, Col, Container} from 'react-bootstrap';
import axios from 'axios';
import ERC721 from '../../abis/ERC721.json';
import '../css/swapRequests.scss';


const SwapRequests = () => {
    const wallet = useSelector((state) => state.WalletConnect);
    const [requestedContracts, setRequestedContracts] = useState(null);
    const [withdrawnContracts, setWithdrawnContracts] = useState([]);
    const [refundedContracts, setRefundedContracts] = useState([]);

    

    const zapWithdraw = async(data) => {
        console.log(data);
        const {ZAP, address} = wallet;
        const amount = wallet.web3.utils.toWei('0.00069', 'ether');
        const swapAddress = '0xc99A68C45b93a8e021A95463627A1F9f725E9a43';
        const nftInstance = new wallet.web3.eth.Contract(
            ERC721.abi,
            data.requestedcontract
        );

        const approveres = await nftInstance.methods.approve(swapAddress, parseInt(data.requestedid)).send({from: address});
        console.log(approveres);

        const res = await ZAP.methods.withdraw(data.contractID, data.preimage).send({value: amount, from: address});
        console.log(res);
    }

    useEffect(() => {
        const fetchRequestData = async() => {
            const {ZAP, address, web3} = wallet;
            const totalContracts = await ZAP.methods.AllTrades().call();
            console.log(totalContracts);
            let swapRequestContracts = [];
            let refundedContracts = [];
            let withdrawnContracts = [];
            
            for(let i = totalContracts; i >= 0; i--) {
                let contract = await ZAP.methods.contracts(i).call();
                
                if(contract.sender === address || contract.receiver === address) {
                    const instance = new web3.eth.Contract(
                        ERC721.abi,
                    contract.tokenContract
                    );
                    const requestedInstance = new web3.eth.Contract(
                        ERC721.abi,
                        contract.requestedcontract
                    );
                    try {
                        contract.tokenURI = await instance.methods.tokenURI(parseInt(contract.tokenId)).call();
                        const response = await axios.get(contract.tokenURI);
    
                        contract.requestedURI = await requestedInstance.methods.tokenURI(parseInt(contract.requestedid)).call();
                        const requestedResponse = await axios.get(contract.requestedURI);
    
                        contract.metaData = response.data;
                        contract.requestedMetaData = requestedResponse.data;
                        contract.contractID = i;
                        if(contract.withdrawn === true) {
                            withdrawnContracts.push(contract);
                        } else if(contract.refunded === true) {
                            if(contract.Sender === address) {
                                refundedContracts.push(contract);
                            }
                        } else {
                            swapRequestContracts.push(contract);
                        }
                        
                    } catch(e) {
                        console.log(e);
                        continue;
                    }
                    
                }
            }
            setRequestedContracts(swapRequestContracts);
            setWithdrawnContracts(withdrawnContracts);
            setRefundedContracts(refundedContracts);
        }
        if(wallet.web3 !== null) {
            fetchRequestData();
        }
        // eslint-disable-next-line
    }, [wallet.address, wallet.web3]);

    

    if(requestedContracts) {
        return (
            <section>
                <Container>
                    <section className="requests">
                        {requestedContracts.map((data, i) => {
                            return(
                                <Row className="request-list" key={i}>
                                    <Col md={6} className="col text-left">
                                        <div className="img-container text-left">
                                            <img src={data.metaData.image} alt="" className="request-list-img"/>
                                            <img src={data.requestedMetaData.image} alt="" className="request-list-img" />
                                            
                                        </div>
                                    </Col>
                                    <Col md={6} className="col button-col text-right">
                                        <div className="btn-container text-right">
                                            <button onClick={() => zapWithdraw(data)} className="btn btn-primary">ZAP IT</button>
                                        </div>
                                    </Col>
                                </Row>
                                
                            )
                        })}
                    </section>

                    <section className="withdrawn">{
                        withdrawnContracts.map((data, i) => {
                            return(
                                <Row className="request-list" key={i}>
                                    <Col md={6} className="col text-left">
                                        <div className="img-container text-left">
                                            <img src={data.metaData.image} alt="" className="request-list-img"/>
                                            <img src={data.requestedMetaData.image} alt="" className="request-list-img" />
                                            
                                        </div>
                                    </Col>
                                    <Col md={6} className="col button-col text-right">
                                        <div className="btn-container text-right">
                                            <p><b><button className="btn btn-success">Trade Completed</button></b> </p>
                                            {/* <button onClick={() => zapWithdraw(data)} className="btn btn-primary">ZAP IT</button> */}
                                        </div>
                                    </Col>
                                </Row>
                            )
                        })
                    }</section>

                    <section className="refunded">{
                        refundedContracts.map((data, i) => {
                            return(
                                <Row className="request-list" key={i}>
                                    <Col md={6} className="col text-left">
                                        <div className="img-container text-left">
                                            <img src={data.metaData.image} alt="" className="request-list-img"/>
                                            <img src={data.requestedMetaData.image} alt="" className="request-list-img" />
                                            
                                        </div>
                                    </Col>
                                    <Col md={6} className="col button-col text-right">
                                        <div className="btn-container text-right">
                                            <p><button className="btn btn-danger">Refunded</button> </p>
                                            {/* <button onClick={() => zapWithdraw(data)} className="btn btn-primary">ZAP IT</button> */}
                                        </div>
                                    </Col>
                                </Row>
                            )
                        })
                    }</section>
                    
                </Container>
            </section>
        )
    } else  {
        return (
            <section>
                <Container>
                    <h3>Loading...</h3>
                </Container>
            </section>
        )
    }
}

export default SwapRequests;