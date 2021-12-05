import React, { useState } from "react";
import { useSelector } from "react-redux";
import {filterAPIData} from '../common';
import Grid from '../common/grid';
import {Row, Form, Col} from 'react-bootstrap';


const Collection = () => {
    const wallet = useSelector((state) => state.WalletConnect);
    const [searchAddress, setSearchAddress] = useState('');
    const [nftData, setNftData] = useState(null);
  
    const searchAndRender = async () => {
        console.log(searchAddress);
        setNftData(await filterAPIData(searchAddress, wallet, setNftData));
    }

    return (
        <section>
            <div className="container">
            <Row>
                <Col md={8}>
                    <Form.Control type="text" placeholder="Enter address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
                </Col>
                <Col md={4}>
                    <button className="btn btn-primary" onClick={searchAndRender} disabled={!wallet.connected}>Search Collection</button>
                </Col>
            </Row>
            <Grid gridData = {nftData} swapIt={true}/>
            </div>
        </section>
        
    )
}

export default Collection;