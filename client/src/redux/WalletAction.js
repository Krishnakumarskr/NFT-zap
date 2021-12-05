// constants
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import contract from "../contracts/HashedTimelockERC721.json";


const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

export const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

// const updateAccountRequest = (payload) => {
//   return {
//     type: "UPDATE_ADDRESS",
//     payload: payload,
//   };
// };

const getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    }

    return providerOptions;
}

export const connectWallet = () => {
    return async(dispatch) => {
        dispatch(connectRequest());
        try {
            const web3Modal = new Web3Modal({
                cacheProvider: true,
                providerOptions: getProviderOptions() // required
            });
    
            const provider = await web3Modal.connect();
            const ZAPcontractAddress = '0xc99A68C45b93a8e021A95463627A1F9f725E9a43';
    
            await subscribeProvider(provider);
            
            const web3 = new Web3(provider);
        
            const accounts = await web3.eth.getAccounts();
            const address = accounts[0];
        
            const instance = new web3.eth.Contract(
              contract.output.abi,
              ZAPcontractAddress
            );

            dispatch(
                connectSuccess({
                    address,
                    web3,
                    ZAP: instance,
                    provider,
                    connected: true,
                    web3Modal
                })
            );
        } catch (e) {
            dispatch(connectFailed(e));
        }
    }
}

const subscribeProvider = async(provider) => {
    if (!provider.on) {
      return;
    }
}

