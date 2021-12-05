
import React from "react";
import { useSelector } from "react-redux";
import SwapModal from "../SwapModal";
import {filterAPIData} from '../common';


const Grid = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedNFT, setSelectedNFT] = React.useState(null);
    const [myNftData, setMyNftdata] = React.useState(null);
    const wallet = useSelector((state) => state.WalletConnect);

    const openModal = async(data) => {
        if(props.swapIt) {
            const {address} = wallet;
            setModalShow(true);
            setSelectedNFT(data);
            await filterAPIData(address, wallet, setMyNftdata);
        }
    }

    if(props.gridData) {
        return (
            <>
            <div className="section main-layout">
                <div className="container">
                    <div className="row">
                        {
                            props.gridData.map((data, i) => {
                                return(
                                    <div className="col col-md-3 nft-col" key={i}>
                                        <div className="nft-card" onClick={(e) => openModal(data)}>
                                            <img className='nft-img' alt="" src={data.tokenURI.image}/>
                                            <p className="nft-name">{data.tokenURI.name}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <SwapModal 
                show={modalShow}
                nft={selectedNFT}
                onHide={() => setModalShow(false)}
                fullscreen = {true}
                nftData = {myNftData}
                //openSelectNFTModal={openSelectNFTModal}
                
            />
            </>
        )
    } else {
       return(<h3>Loading ...</h3>);
    }
    
}

export default Grid;