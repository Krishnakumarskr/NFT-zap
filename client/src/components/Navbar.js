import React, { useContext } from "react";
import AppContext  from "./AppContext";

const Navbar = ({signUp}) => {
    const globalContext = useContext(AppContext);
    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <div className="container">
                <a className="navbar-brand" href="/">NFT ZAP</a>
                <div className="navbar navbar-collapse">
                    <div className="nav navbar-nav ms-auto ml-auto">
                        { !globalContext.accounts &&  
                            <li><button className='btn btn-primary' onClick={signUp}>Sign Up</button></li> 
                        }
                        { globalContext.accounts && 
                            <li>Account: {globalContext.accounts[0]}</li>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;