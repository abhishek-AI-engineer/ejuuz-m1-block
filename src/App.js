import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Replace with your contract's ABI and address
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "key",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "DataStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "key",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "storeKeyValue",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			}
		],
		"name": "getAllKeyValues",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "key",
				"type": "string"
			}
		],
		"name": "getKeyValue",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Replace with your contract address
const contractAddress = "0x07064227d45675aa31a7b3df9e483836f8a90ccb";

function App() {
  const [userId, setUserId] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [output, setOutput] = useState("");
  const [allKeys, setAllKeys] = useState([]);
  const [allValues, setAllValues] = useState([]);

  useEffect(() => {
    // Check if Ethereum is available
    if (window.ethereum) {
      // Request user to connect to Metamask
      window.ethereum.request({ method: "eth_requestAccounts" });
    }
  }, []);

  // Initialize Ethereum provider and contract
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Store key-value pair
  const storeKeyValue = async () => {
    try {
      const tx = await contract.storeKeyValue(userId, key, value);
      await tx.wait(); // Wait for transaction to be mined
      alert("Data stored successfully!");
    } catch (error) {
      console.error(error);
      alert("Error storing data.");
    }
  };

  // Get the value for a specific key
  const getKeyValue = async () => {
    try {
      const result = await contract.getKeyValue(userId, key);
      setOutput(result);
    } catch (error) {
      console.error(error);
      alert("Error retrieving value.");
    }
  };

  // Get all key-value pairs for a user
  const getAllKeyValues = async () => {
    try {
      const [keys, values] = await contract.getAllKeyValues(userId);
      setAllKeys(keys);
      setAllValues(values);
    } catch (error) {
      console.error(error);
      alert("Error retrieving all data.");
    }
  };

  return (
    <div>
      <h1>Store Data on Blockchain</h1>

      <div>
        <h3>Store Key-Value Pair</h3>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={storeKeyValue}>Store Data</button>
      </div>

      <div>
        <h3>Get Key-Value Pair</h3>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={getKeyValue}>Get Value</button>
        <p>Output: {output}</p>
      </div>

      <div>
        <h3>Get All Key-Value Pairs</h3>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={getAllKeyValues}>Get All Data</button>
        <p>Keys: {allKeys.join(", ")}</p>
        <p>Values: {allValues.join(", ")}</p>
      </div>
    </div>
  );
}

export default App;
