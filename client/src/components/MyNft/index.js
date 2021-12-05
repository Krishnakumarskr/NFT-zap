import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {filterAPIData} from '../common';
import Grid from '../common/grid';


const MyNFTs = () => {
    const wallet = useSelector((state) => state.WalletConnect);
    const [nftData, setNftData] = useState(null);

    useEffect(() => {
        if(wallet.web3 !== null) {
            filterAPIData(wallet.address, wallet, setNftData);
        }
        // eslint-disable-next-line
    }, [wallet.address, wallet.web3]);

    return <Grid gridData = {nftData} swapIt = {false} />
}

export default MyNFTs;