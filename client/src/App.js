import React, { useEffect } from "react";
import {useState} from 'react';
import AtomicSwapContract from "./contracts/HashedTimelockERC721.json";
//import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar';
import AppContext from './components/AppContext';
import Form from './components/Form';
//import nftAbi from "./abis/ERC721";

import "./App.css";

const App = () => {

    const [accounts, setAccounts] = useState(null);
    const [instances, setInstances] = useState({
        web3: null,
        contract: null,
        nft: null
    });

    const SwapContractAddress = '0x2620b1004A895A6a5E7d8FdD397Fa0A1c7e857c0';
      
    //Retrive from local storage
    useEffect(() => {
        const json = localStorage.getItem("accounts");
        const accounts = JSON.parse(json);
        if (accounts !== null) {
            setAccounts(accounts);
            (async () => {
                const web3 = await getWeb3();
                const instance = new web3.eth.Contract(
                    AtomicSwapContract.abi,
                    SwapContractAddress
                );
                
                setInstances({web3, contract:instance});
            })();
        }
    }, []);

    //Add to local storage
    useEffect(() => {
        const json = JSON.stringify(accounts);
        localStorage.setItem('accounts', json);
    }, [accounts]);

    const globalStates = {
        accounts,
        instances
    }

    console.log(globalStates);

    const accountSignUp = async () => {
        console.log('calling signup')
        try {
            // Get network provider and web3 instance.
            
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            // const networkId = await web3.eth.net.getId();
            // const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                AtomicSwapContract.abi,
                SwapContractAddress
                // SimpleStorageContract.abi,
                // deployedNetwork && deployedNetwork.address,
            );

            // const nftInstance = new web3.eth.Contract(
            //     nftAbi,
            //     SwapContractAddress
            // );

            // Set web3, accounts, signup to the global state.
            // setGlobalStates({web3, accounts, signUp: true, instance});
            setAccounts(accounts);
            setInstances({web3, contract:instance});

            // console.log(instance);
            // console.log(web3);

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert( 
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    return (
       <AppContext.Provider value={globalStates}>
            <div className="App">
                <Navbar signUp={accountSignUp} />
                <Form swapAddress={SwapContractAddress}/>
            </div>
        </AppContext.Provider>
    );
}

export default App;
