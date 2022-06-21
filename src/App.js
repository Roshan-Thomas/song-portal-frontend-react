import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/SongPortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x023E55D486a697612d3Bfdf289Be1ED4C86B3232"
  const contractABI = abi.abi;

  const checkIfWalledIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // check if we're authorized to acces the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounds" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
    
  }
  
  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const song = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const songPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await songPortalContract.getTotalSongs();
        console.log("Retrieved total song(s) count...", count.toNumber());

        const songTxn = await songPortalContract.song();
        console.log("Mining...", songTxn.hash);

        await songTxn.wait();
        console.log("Mined -- ", songTxn.hash);

        count = await songPortalContract.getTotalSongs();
        console.log("Retrieved total song(s) count...", count.toNumber());
      } else {
        console.log("Ethereum object doesnt exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalledIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        {/* eslint-disable-next-line*/}
        👋 Hey there!
        </div>

        <div className="bio">
        I am Roshan and I am an undergraduate student. Connect your Ethereum wallet and upload your faviorite song!
        </div>

        <button className="waveButton" onClick={song}>
          Upload Song
        </button>

        {/*
        * If ther is no curretAccount render this button
    */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
