import React, {useEffect} from 'react'
import AppContext from './components/AppContext';
import {useState} from 'react';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './theme';
import {BrowserRouter as Router} from 'react-router-dom'
//import Navbar from './components/Navbar';

export const GlobalState = ({children}) => {
  const [globalStates, setGlobalStates] = useState(
    {
        web3: null,
        accounts: null,
        signUp: false,
        instance: null
    }
);


// Avoid cyclic reference
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  
  
  //Retrive from local storage
  useEffect(() => {
    const json = localStorage.getItem("states");
    //console.log("JSON", json)
    const logged = JSON.parse(json);
    if (logged) {
      setGlobalStates(logged);
    }
  }, []);

  //Add to local storage
  useEffect(() => {
    const json = JSON.stringify(globalStates, getCircularReplacer());
    localStorage.setItem('states', json)
    //console.log("Data",json)

  },[globalStates]);

 

const accountSignUp = async () => {
    console.log('Calling signup')
    try {
        // Get network provider and web3 instance.
        
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
            SimpleStorageContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        
        // Set web3, accounts, signup to the global state.
        setGlobalStates({web3, accounts, signUp: true, instance});

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
        <ThemeProvider theme={theme}>
          <Router>
            <Navbar signUp={accountSignUp} />
          
          {children}
          </Router>
        </ThemeProvider>
    </AppContext.Provider>
);
}

