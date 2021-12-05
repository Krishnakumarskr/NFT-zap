import React, { useEffect } from "react";
import Navbar from './components/Navbar';
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "./redux/WalletAction";


import "./App.css";
import MainLayout from "./components/MainLayout";

const App = () => {

    const wallet = useSelector(state => state.WalletConnect);
    const dispatch = useDispatch();

    useEffect(() => {
        const {web3Modal} = wallet;
        if(web3Modal.cachedProvider) {
            dispatch(connectWallet());
        }
        // eslint-disable-next-line
    }, []);

    return (
            <div className="App">
               < Navbar />
               < MainLayout />
            </div>
    );
}

export default App;
