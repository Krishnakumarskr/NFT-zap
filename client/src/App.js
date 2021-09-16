import React, { useEffect } from "react";
import {useState} from 'react';
import AtomicSwapContract from "./contracts/HashedTimelockERC721.json";
//import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar';
import AppContext from './components/AppContext';
import Form from './components/Form';

import "./App.css";

const nftAbi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

const App = () => {

    const [accounts, setAccounts] = useState(null);
    const [instances, setInstances] = useState({
        web3: null,
        contract: null
    });

    const SwapContractAddress = '0x09AfBCE734A23C1eA5B780B3339eb9308eccBD81';
      
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
                '0x2C42919c1fcA38bdad17F7715F871a78E06c7ee4'
                // SimpleStorageContract.abi,
                // deployedNetwork && deployedNetwork.address,
            );

            const nftInstance = new web3.eth.Contract(
                nftAbi,
                '0x2C42919c1fcA38bdad17F7715F871a78E06c7ee4'
            );

            // Set web3, accounts, signup to the global state.
            // setGlobalStates({web3, accounts, signUp: true, instance});
            setAccounts(accounts);
            setInstances({web3, contract:instance, nft: nftInstance});

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
