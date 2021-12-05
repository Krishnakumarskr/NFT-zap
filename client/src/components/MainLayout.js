import React, { useState } from "react";
import {Tabs, Tab} from 'react-bootstrap';
import MyNFTs from "./MyNft";
import Collection from './Collection';
import SwapRequests from "./SwapRequests";
import "bootstrap/dist/css/bootstrap.min.css";


import './css/profile.scss';

const MainLayout = () => {
    const [activeTab, setActiveTab] = useState('my-nft');


    return(
        <Tabs className="tabs mb-3" activeKey={activeTab} onSelect={(i) => setActiveTab(i)}>
            <Tab eventKey="collections" title="Collections">
                <Collection />
            </Tab>
            <Tab eventKey="swap-requests" title="Swap Requests">
                <SwapRequests />
            </Tab>
            <Tab eventKey="my-nft" title="My NFTs">
                <MyNFTs />
            </Tab>
        </Tabs>
    )
    
}

export default MainLayout;