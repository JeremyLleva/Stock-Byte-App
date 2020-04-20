import React from "react"
import IntradayChart from "./intraday_chart"

class Playground extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      netWorth: 100000,
      unrealizedGain: 0,
      hasPlaygroundAccount: false,
      playgroundAccountData: [],
      stockList: [],
      currentPrices: {},
      stockInFocus: "",
      form: {
          symbol: ""
      },
      tradeForm: {
        quantity: ""
      },
      watchList: [],
      feedbackForm: {},
      playgrounds: [],
      leaderboardData: [],
      userInFocus: {},
      rightSideShow: "watchlist",
      tabWatchListStatus: true,
      chartData:[],
      chartLoading: false
    }

  }
  componentDidMount(){
      this.getPortfolio()
      this.getPlaygrounds()
  }
  getPlaygrounds = () => {
    fetch(`/leaderboard`)
    .then((response) => {
      if(response.status === 200){
          return(response.json())
        }
      }
    )
    .then((result) => {
      result.map((playground, index) => {
        if(playground.stock_list.length > 1){
          playground.stock_list.map((stock, i) => {
            this.getCurrentPrice(stock.symbol)
          })
        }
      })
      this.setState({
        playgrounds : result
      })
    })
  }

  getLeaderboard = () => {
    const{ playgrounds } = this.state
    let leaderboardData = []
    playgrounds.map((playground, index) => {
      let nickName = playground.nick_name
      let netWorth = playground.cash
      if(playground.stock_list.length > 0){
        playground.stock_list.map((stock, i) => {
          let price = this.state.currentPrices[`${stock.symbol}`]
          netWorth += price * stock.total_quantity
        })
      }
      let playerInfo = { nickName: nickName, netWorth: netWorth, cash: playground.cash, stockList: playground.stock_list }
      leaderboardData.push(playerInfo)
      })
      this.setState({
        leaderboardData : leaderboardData.sort((a, b) => (a.netWorth < b.netWorth) ? 1 : -1).slice(0,10)
      })
    }






  getPortfolio = () => {
    fetch(`/portfolios`)
    .then((response) => {
      if(response.status === 200){
          return(response.json())
        }
      }
    )
    .then((result) => {
        if(result.length > 1){
          this.setState({
            playgroundAccountData: result.find(value => value.name === "playground"),
            hasPlaygroundAccount: true
          })
          this.getStockList()
        }
    })
  }
  createPlaygroundAccount = () => {
      return fetch(`/portfolios`, {
          body: JSON.stringify({'name': 'playground', 'cash': 100000.00}),
          headers: {
              "Content-Type": "application/json"
          },
          method: "POST"
      })
      .then((response) => {
          if(response.ok){
            return this.getPortfolio()
          }
      })
  }

  getStockList = () => {
    fetch(`/stocks?portfolio=playground`)
      .then((response)=>{
        if(response.status === 200){
          return(response.json())
        }
      })
      .then((result)=>{
        this.setState({ stockList: result })
        result.map((stock)=>{
        this.getCurrentPrice(stock.symbol)
        })
      })
    fetch(`/stocks?portfolio=default`)
      .then((response)=>{
        if(response.status === 200){
          return(response.json())
        }
      })
      .then((result)=>{
        this.setState({ watchList: result })
        result.map((stock)=>{
        this.getCurrentPrice(stock.symbol)
        })
      })
    }

  getCurrentPrice = (symbol) => {
    fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=bc07ae0baa6241d79c88764a862a7dba`)
      .then((response)=>{
    if(response.status === 200){
       return(response.json())
     }
   })
   .then((result)=>{
     const { currentPrices } = this.state
     currentPrices[`${symbol}`] = result.price
     this.setState({
       currentPrices: currentPrices
     })
   })
  }


  validSymbol = (symbol) => {
    fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=bc07ae0baa6241d79c88764a862a7dba`)
      .then((response)=>{
        if(response.status === 200){
           return(response.json())
         }
      })
      .then((result)=>{
        if(result.price){
          return true
        }else{
          return false
        }
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { form } = this.state
    fetch(`https://api.twelvedata.com/price?symbol=${form.symbol}&apikey=bc07ae0baa6241d79c88764a862a7dba`)
      .then((response)=>{
        if(response.status === 200){
           return(response.json())
         }
      })
      .then((result)=>{
        if(result.price){
          this.setStockInFocus(form.symbol)
        }
      })

  }


  handleChange = (event) => {
      let { form } = this.state
      form[event.target.name] = event.target.value.toUpperCase()
      this.setState({
        form: form
      })
  }

  validTrade = (tradeForm) => {
    this.getStockList()
    const { playgroundAccountData, stockList } = this.state
    let action = tradeForm.action
    let quantity = tradeForm.quantity
    let symbol = this.state.stockInFocus
    let currentPrice = this.state.currentPrices[`${ symbol }`]
    let cash = playgroundAccountData.cash
    let value = currentPrice * quantity * action
    let position = stockList.find(value => value.symbol === symbol).total_quantity
    if(action == 1 && cash >= value){
      return { value: value, tradeForm: { action: 1, quantity: quantity, price: currentPrice } }
    }else if(action == -1 && quantity <= position){
      return { value: value, tradeForm: { action: -1, quantity: quantity, price: currentPrice } }
    }else{
      return {}
    }
  }


  createTrade = (request) => {
    let symbol = this.state.stockInFocus
    let validForm = this.validTrade(request)
    if(validForm.tradeForm){
        return fetch(`/trades?portfolio=playground&stock=${symbol}`, {
          body: JSON.stringify(validForm.tradeForm),
          headers: {
            "Content-Type": "application/json"
          },
          method: "Post"
          })
          .then((response) => {
            if(response.ok){
              this.updatePortfolio(validForm.value)
              this.getStockList()
              this.setState({
                feedbackForm: validForm.tradeForm
              })
            }
          })
        }else{
        alert("something is wrong, cannot place the trade")
      }
  }


  handleBuySubmit = (event) => {
    event.preventDefault()
    let { tradeForm } = this.state
    tradeForm.action = 1
    this.createTrade(this.state.tradeForm)
  }
  handleSellSubmit = (event) => {
    event.preventDefault()
    let { tradeForm } = this.state
    tradeForm.action = -1
    this.createTrade(this.state.tradeForm)
  }
  // store what user entered to form
  handleTradeChange = (event) => {
    let { tradeForm } = this.state
    tradeForm[event.target.name] = event.target.value
    this.setState({ tradeForm: tradeForm })
  }

  updatePortfolio = (value) => {
    const { playgroundAccountData } = this.state
    let cash = playgroundAccountData.cash
    let id = playgroundAccountData.id
    let portfolioParams = {
      cash: cash - value
    }
    fetch(`/portfolios/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify({ portfolio: portfolioParams }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        return this.getPortfolio()
      })
  }

  setStockInFocus = (symbol) => {
    this.resetFeedback()
    this.getChart(symbol)
    this.setState({
      stockInFocus: symbol
    })
    let form = { symbol: symbol}
    return fetch(`/stocks?portfolio=playground`, {
        body: JSON.stringify(form),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    .then((response) => {
        if(response.ok){
          return this.getStockList()
        }
    })
  }

  showUserPortfolio = (user) => {
    this.setState({
      userInFocus: user,
      rightSideShow: "userstock"
    })
  }

  showLeaderBoard = () => {
    this.getLeaderboard()
    this.setState({
      rightSideShow: "leaderboard",
      tabWatchListStatus: false
    })
  }

  showWatchList = () => {
    this.setState({
      rightSideShow: "watchlist",
      tabWatchListStatus: true
    })
  }



  resetFeedback = () => {
    this.setState({
      feedbackForm:{}
    })
  }

  getChart = (symbol) => {
    fetch(`https://cloud.iexapis.com//stable/stock/${symbol}/intraday-prices?token=pk_3e33ec663d95431bac64f43bb0586cd7`)
    .then((response) => {
      return response.json()
    })
    .then((payload) => {
      console.log(payload);
        this.setState({
          chartData: payload,
          chartLoading: true})
    })
  }



  render(){
    const { playgroundAccountData, stockList, currentPrices, watchList } = this.state
    let netWorth = playgroundAccountData.cash
    let unrealizedGain = 0
    if(stockList.length > 0){
      stockList.map(stock => netWorth += stock.total_quantity * currentPrices[`${ stock.symbol }`])
      unrealizedGain = netWorth - (playgroundAccountData.total_cost + playgroundAccountData.cash)
    }
    const roundToTwo = (number) =>{
      return Math.round((number)*100)/100
    }
    return(
      <>
        { !this.state.hasPlaygroundAccount &&
          <div className = "page-wrap-other">
            <h4>Are you ready to enter the playground? You will be given $100,000 Virtual Money to start.</h4>
            <button type="button" class="btn btn-primary btn-lg"
              onClick={() => this.createPlaygroundAccount()}>
            Yes
            </button>
          </div>
        }

        { this.state.hasPlaygroundAccount &&
          <div >
          <div class="row">
            <div class="col-sm-3">
            <div>

            {/* account information table */}
              <table>
                <tr >
                  <th scope="row">Cash: </th>
                  <td>${ Math.round(playgroundAccountData.cash*100)/100 }</td>
                </tr>
                <tr >
                  <th scope="row">Net Worth: </th>
                  <td>${ Math.round(netWorth*100)/100 }</td>
                </tr>
                <tr >
                  <th scope="row">Total Gain/Loss: </th>
                  <td>${ Math.round((netWorth-100000)*100)/100 }</td>
                </tr>
                <tr >
                  <th scope="row">Unrealized Gain/Loss: </th>
                  <td>${ Math.round(unrealizedGain*100)/100 }</td>
                </tr>
              </table>

              {/* account portfolio table*/}
              <table class="table table-hover">
                <thead>
                  <tr class="table-primary">
                    <th scope="col">Symbol</th>
                    <th scope="col">Average Price</th>
                    <th scope="col">Position</th>
                    <th scope="col">Current Price</th>
                    <th scope="col">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody>
                { (stockList?stockList.filter(stock => stock.total_quantity>0):[]).map((stock, index) => {
                  return(
                    <tr  key={ index } onClick={() => this.setStockInFocus(stock.symbol)}>
                      <th scope="row">
                        { stock.symbol }
                      </th>
                      <td>{ roundToTwo(stock.average_price) }</td>
                      <td>{ stock.total_quantity }</td>
                      <td>{ roundToTwo(currentPrices[`${ stock.symbol }`])}</td>
                      <td>{ roundToTwo((currentPrices[`${ stock.symbol }`] * stock.total_quantity - stock.value))}</td>
                    </tr>)}
                  )
                }
                </tbody>
              </table>

              </div>
            </div>
            <div class="col-sm-6">
            {this.state.stockInFocus &&
              <div>
              {/* stock show section */}
                <h1>{ this.state.stockInFocus }</h1>
                <div id = "chart">
                  { this.state.chartLoading ? <IntradayChart chartData = {this.state.chartData}  /> : "Oh well" }
                </div>
                <h4>Current Price: { roundToTwo(currentPrices[`${ this.state.stockInFocus }`]) }</h4>
                <h4>Average Price: { stockList.find(value => value.symbol === this.state.stockInFocus)?roundToTwo(stockList.find(value => value.symbol === this.state.stockInFocus).average_price):0 }</h4>
                <h4>Current Position: { stockList.find(value => value.symbol === this.state.stockInFocus)?stockList.find(value => value.symbol === this.state.stockInFocus).total_quantity:0 }</h4>
                <h4>Maximum shares can buy: { Math.floor(playgroundAccountData.cash/currentPrices[`${ this.state.stockInFocus }`]) }</h4>

              </div>
            }
            {!this.state.stockInFocus &&
              <div>
              {/* overview show section */}
              <h1>Welcome to Playground! { this.props.current_user.nick_name }</h1>

              </div>
            }



            </div>
            <div class="col-sm-3">
            {/* nav tabs switch between watchlist and leaderboard */}
              <ul class="nav nav-tabs">
                <li class={this.state.tabWatchListStatus?"nav-item active":"nav-item"} >
                  <a class="nav-link" data-toggle="tab" onClick = {() => this.showWatchList() }>Watch List</a>
                </li>
                <li class={this.state.tabWatchListStatus?"nav-item":"nav-item active"}>
                  <a class="nav-link" data-toggle="tab" onClick = {() => this.showLeaderBoard() } >Leader Board</a>
                </li>
              </ul>
              {/* watchlist */}
              {this.state.rightSideShow === "watchlist" &&
              <div id="watchlist">
                <table class="table table-hover">
                  <thead>
                    <tr class="table-info">
                    <th scope="col">Symbol</th>
                    <th scope="col">Current Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    { watchList.map((stock, index) => {
                      return(
                        <tr key={ index } onClick={() => this.setStockInFocus(stock.symbol)}>
                        <th scope="row">
                        { stock.symbol }
                        </th>
                        <td>{ roundToTwo(currentPrices[`${ stock.symbol }`])}</td>
                        </tr>)}
                      )
                    }
                  </tbody>
                </table>
              </div>
            }

            {/* leaderboard */}
            {this.state.rightSideShow === "leaderboard" &&
              <div id="leaderboard">
                <table class="table table-hover">
                  <thead>
                    <tr class="table-info">
                    <th scope="col">Users</th>
                    <th scope="col">Net Worth</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.leaderboardData.map((user, index) => {
                      return(
                        <tr key={ index } onClick = {() => this.showUserPortfolio(user) }>
                        <th scope="row">
                        { user.nickName }
                        </th>
                        <td>{ roundToTwo(user.netWorth)}</td>
                        </tr>)}
                      )
                    }
                  </tbody>
                </table>
              </div>
            }

            {/* user's stocks table*/}
            {this.state.rightSideShow === "userstock" &&
                <div id="playerPortfolio">
                {this.state.userInFocus.nickName &&
                <table class="table table-hover">
                  <thead>
                    <tr class="table-info">
                    <th scope="col">{this.state.userInFocus.nickName}'s Stock</th>
                    <th scope="col">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.userInFocus.stockList.map((stock, index) => {
                      return(
                        <tr key={ index } onClick={() => this.setStockInFocus(stock.symbol)}>
                        <th scope="row">
                        { stock.symbol }
                        </th>
                        <td>{ stock.total_quantity}</td>
                        </tr>)}
                      )
                    }
                  </tbody>
                  <tfoot>
                    <tr class="table-success">
                    <th scope="col">Cash</th>
                    <th scope="col">${roundToTwo(this.state.userInFocus.cash)}</th>
                    </tr>
                  </tfoot>
                </table>}
              </div>
            }

            </div>
          </div>

{/* feedback alert */}
          <div>
            { this.state.feedbackForm.action &&
              <div class="alert alert-dismissible alert-info">
              <button type="button" class="close" data-dismiss="alert" onClick={() => this.resetFeedback()}>&times;</button>
              <strong>Your order is placed! </strong>
              {(this.state.feedbackForm.action == 1)?'Bought':'Sold'} { this.state.stockInFocus } { this.state.feedbackForm.quantity } shares at { roundToTwo(this.state.feedbackForm.price) }.
            </div>
            }
          </div>

          <div class="row">
{/* find stock form */}
            <div class="col-sm-3">
            <div class="form-group">
                <label class="col-form-label" for="inputDefault">Find a stock</label>
                <input onChange={ this.handleChange } type="text" class="form-control" name="symbol" Placeholder="Enter Stock Symbol Here" style={{width:"70%"}}/>
                <button type="submit" onClick= { this.handleSubmit } class="btn btn-info">Find</button>
            </div>
          </div>

{/* place trade order */}
            <div class="col-sm-9">
            <form>
              <div class="form-group">
                <label class="col-form-label" for="inputDefault">Quantity of stocks</label>
                <input style={{width:"20%"}} onChange={ this.handleTradeChange } type="text" class="form-control" name="quantity"/>
                <button type="submit" onClick= { this.handleBuySubmit } class="btn btn-success" >Buy</button>
                <button type="submit" onClick= { this.handleSellSubmit } class="btn btn-danger">Sell</button>
              </div>
            </form>
            </div>

          </div>

          </div>
        }
      </>

    )
  }
}

export default Playground
