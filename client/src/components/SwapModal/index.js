
import React, {useState} from "react";
import { useSelector } from "react-redux";
import {Modal, Button, Row, Col, Container} from 'react-bootstrap';
import '../css/modal.scss';
import ERC721 from '../../abis/ERC721.json';


const SwapModal = (props) => {
    const wallet = useSelector((state) => state.WalletConnect);
    const swapAddress = '0xc99A68C45b93a8e021A95463627A1F9f725E9a43';

    const [imgSrc, setImgSrc] = useState('/img-load.png');
    const [imgName, setImgName] = useState('#Select your NFT');

    const [myNftData, setMyNftData] = useState(null);
    const initSwap = async() => {
        console.log('init swap');

        console.log(myNftData);
        console.log(props.nft);
        
        const nftInstance = new wallet.web3.eth.Contract(
            ERC721.abi,
            myNftData.contractAddress
        );


        const res = await nftInstance.methods.approve(swapAddress, parseInt(myNftData.tokenID)).send({from: wallet.address});

        console.log(res);
        const amount = wallet.web3.utils.toWei('0.00069', 'ether');
        const result = await wallet.ZAP.methods.newContract(props.nft.owner, 'password', myNftData.contractAddress, parseInt(myNftData.tokenID), props.nft.contractAddress, parseInt(props.nft.tokenID)).send({from: wallet.address, value: amount});
        console.log(result);

    }

    const selectNFT = (data) => {
        setImgSrc(data.tokenURI.image)
        setImgName(data.tokenURI.name);
        setMyNftData(data);
    }

    return(
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="modal-width"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Swap Request
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className={'selection-container'}>
                <Row className={'nft-sticky-row'}>
                    <Col md={6}>
                        { props.nft ? <div className="modal-nft"> 
                            <div className="nft-card">
                                            <img className='nft-img' alt="" src={props.nft.tokenURI.image}/>
                                            <p className="nft-name">{props.nft.tokenURI.name}</p>
                                        </div>
                        </div> : ''}
                    </Col>

                    <Col md={6}>
                        { <div className="modal-nft"> 
                                <div className="nft-card">
                                                <img className='nft-img' alt=""  src={imgSrc}/>
                                                <p className="nft-name">{imgName}</p>
                                            </div>
                            </div> }
                    </Col>
                    <div className="text-center">
                        <Button className="zap-button" onClick={initSwap}>ZAP IT</Button>
                    </div>
                    <hr className="divider" />
                </Row>
                
                <Row>
                {
                    props.nftData.map((data, i) => {
                        return(
                            <div className="col col-md-3 nft-col" key={i}>
                                <div className="nft-card" onClick={() => selectNFT(data)}>
                                    <img className='nft-img' alt="" src={data.tokenURI.image}/>
                                    <p className="nft-name">{data.tokenURI.name}</p>
                                </div>
                            </div>
                        )
                    })
                }
                </Row>
                </Container>
            </Modal.Body>
    </Modal>
    )
    
}

export default SwapModal;