import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../redux/WalletAction";

const Navbar = () => {
    const dispatch = useDispatch();
    const wallet = useSelector((state) => state.WalletConnect);
    console.log(wallet);

    const connect = () => {
        console.log('connect');
        dispatch(connectWallet());
    }
    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <div className="container">
                <a className="navbar-brand" href="/">NFT ZAP</a>
                <div className="navbar navbar-collapse">
                    <div className="nav navbar-nav ms-auto ml-auto">
                        { !wallet.connected &&  
                            <li><button className='btn btn-primary' onClick={connect}>Sign Up</button></li> 
                        }
                        { wallet.connected && 
                            <li>Account: {wallet.address}</li>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;