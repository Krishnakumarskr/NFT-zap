import axios from 'axios';
import chainData from '../chaindata/data.json';
import ERC721 from '../abis/ERC721.json';

export const getAPIdata = async (address) => {
    // const result = await axios.get('https://api-rinkeby.etherscan.io/api', {
    //     params: {
    //         module: 'account',
    //         action: 'tokennfttx',
    //         address: address,
    //         apikey: 'XX77XCKEUGCI9QD4UQFFGXMBECQ992R887'
    //     }
    // });
    // return result.data.result;

    return chainData.result;

    //   const a = document.createElement("a");
    //     a.href = URL.createObjectURL(new Blob([JSON.stringify(result.data, null, 2)], {
    //         type: "application/json"
    //     }));
    //     a.setAttribute("download", "data.json");
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);

    //   console.log(result);
}

export const filterAPIData = async (filterAddress, wallet, setData) => {
    getAPIdata(filterAddress).then(async(chainData) => {
        //console.log(chainData);
        let res = [];
        await Promise.all(chainData.map(async (item) => {
            const {web3} = wallet;
            const nftContract = item.contractAddress;
            const tokenID = item.tokenID;
            const instance = new web3.eth.Contract(
                ERC721.abi,
                nftContract
            );

            const owner = await instance.methods.ownerOf(tokenID).call();
            //console.log(owner);
            if (owner === filterAddress) {
                //res.push(item);
                const tokenURI = await instance.methods.tokenURI(tokenID).call();
                const response = await axios.get(tokenURI);
                if(response.data.name) {
                    const index = res.findIndex((data) => (data.tokenID === item.tokenID && data.contractAddress === item.contractAddress))
                    if(index <= -1) {
                        const nftData = {
                            owner: owner,
                            contractAddress: item.contractAddress,
                            tokenID: item.tokenID,
                            tokenURI: response.data
                        };
        
                        res.push(nftData);
                    }
                }   
            }
        }));
        setData(res);
    });
    
    //console.log(res)
}