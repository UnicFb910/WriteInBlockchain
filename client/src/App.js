import React, { Component } from "react";
import WriteInBlockchainContract from "./contracts/WriteInBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { text: '', newText: '', web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
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
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);

      const response = await this.state.contract.methods.Read().call();
      this.setState({
        text : response
      })
  
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  storeValue = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    
    try {
      await contract.methods.Write(this.state.newText).send({ from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const response = await contract.methods.Read().call();

      // Update state with the result.
      this.setState ({
        text : response
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error
      );
      console.error(error);
    }
  };
  
  handleChangeValue = (event) => {
    this.setState({
      newText : event.target.value
    })
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Write in Blockchain</h1>
        <label>El valor actual es: {this.state.text}</label>
        <br/>
        <br/>
        <form onSubmit={this.storeValue}>
          <label>Enviar valor: </label>
          <input type="text" value={this.state.newText} onChange={this.handleChangeValue}></input>
          <input type="submit" value="Send"></input>
        </form>
      </div>
    );
  }
}
export default App;
