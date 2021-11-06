import React, { useEffect, useState } from "react";
import WriteInBlockchainContract from "./contracts/WriteInBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = WriteInBlockchainContract.networks[networkId];
        const instance = new web3.eth.Contract(
          WriteInBlockchainContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

        const response = await instance.methods.Read().call();
        setText(response);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    componentDidMount();
  }, []);

  const storeValue = async (event) => {
    event.preventDefault();

    try {
      await contract.methods.Write(newText).send({ from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const response = await contract.methods.Read().call();

      // Update state with the result.
      setText(response);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(error);
      console.error(error);
    }
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h1>Write in Blockchain</h1>
      <label>El valor actual es: {text}</label>
      <br />
      <br />
      <form onSubmit={storeValue}>
        <label>Enviar valor: </label>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        ></input>
        <input type="submit" value="Send"></input>
      </form>
    </div>
  );
};

export default App;
