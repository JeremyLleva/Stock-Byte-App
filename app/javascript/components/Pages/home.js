import React from "react"
import Flexbox from 'flexbox-react';
import background from "./background.jpg"
import Chart from "./chart"
import TextLoop from "react-text-loop";

class Home extends React.Component {
  constructor(){
    super()
    this.state = {
      articles: []
    }
  }

  componentDidMount(){
      this.getArticles()
  }

getArticles = () => {
  fetch('https://finnhub.io/api/v1/news?category=general&token=bqaa48nrh5r8t7qn85ig')
    .then((response) => {
      return response.json()
    })
    .then((payload) => {
      let topThree = payload.filter((value, index) => index < 3 )
      this.setState({ articles: topThree })
    })
  }

    render () {
    return (
        <React.Fragment>


          <Flexbox flexDirection="column" minHeight="100vh">
            <Flexbox element="header" height="60px">



        <block class="blockquote">
          <h3 class="mb-0">
             <TextLoop interval={450} style={{color: 'darkblue'}}>
                <div>Trade faster</div>
                <div>Increase sales</div>
                <div>Stock winners</div>
                <div>Price perfectly</div>
                <div>Be on Top</div>
              </TextLoop>
          </h3>
          <h3>S T O C K   B Y T E  YOUR FINANCIAL EINSTEIN!!!!!!!!</h3>
        </block>


            </Flexbox>

            <Flexbox flexGrow={1}>
            <div class="card mb-3">
                  <h3 class="card-header">Let's learn about stock market!</h3>

                  <div class="card-body">
                    <h5 class="card-title">WHAT DOES STOCK MARKET DO?</h5>
                    <img src={ background } style={{width:"75%"}} />
                    <h6 class="card-subtitle text-muted">The Bull and Bear market meet UP! who is next?</h6>
                  </div>

                  <div class="card-body">
                    <h5>Stock market basics</h5>
                    <p>The stock market is made up of exchanges, like the New York Stock Exchange and the Nasdaq. Stocks are listed on a specific exchange, which brings buyers and sellers together and acts as a market for the shares of those stocks. The exchange tracks the supply and demand — and directly related, the price — of each stock. (Need to back up a bit? Read our explainer about stocks.)</p>

                    <p>But this isn’t your typical market, and you can’t show up and pick your shares off a shelf the way you select produce at the grocery store. Individual traders are typically represented by brokers — these days, that’s often an online broker. You place your stock trades through the broker, which then deals with the exchange on your behalf. (Need a broker? See our analysis of the best stockbrokers for beginners.) </p>
                    <p>The NYSE and the Nasdaq are open from 9:30 a.m. to 4 p.m. Eastern, with premarket and after-hours trading sessions also available, depending on your broker.</p>
                    <p><a href="https://www.nerdwallet.com/article/investing/how-to-invest-in-stocks" class="card-link">How To invest in stocks</a></p>
                  </div>


                  <div class="card-body">
                    <h5>Understanding the stock market</h5>

                    <p>When people refer to the stock market being up or down, they’re generally referring to one of the major market indexes.</p>
                    <p>A market index tracks the performance of a group of stocks, which either represents the market as a whole or a specific sector of the market, like technology or retail companies. You’re likely to hear most about the S&P 500, the Nasdaq composite and the Dow Jones Industrial Average; they are often used as proxies for the performance of the overall market.</p>
                    <p>Investors use indexes to benchmark the performance of their own portfolios and, in some cases, to inform their stock trading decisions. You can also invest in an entire index through index funds and exchange-traded funds, or ETFs, which track a specific index or sector of the market.</p>

                    <p><a href="https://www.nerdwallet.com/blog/investing/what-is-the-stock-market/" class="card-link">How the maarket works</a></p>
                  </div>


                  <div class="card-body">
                    <h5>Bull markets vs. bear markets</h5>

                    <p>Neither is an animal you’d want to run into on a hike, but the market has picked the bear as the true symbol of fear: A bear market means stock prices are falling — thresholds vary, but generally to the tune of 20% or more — across several of the indexes referenced earlier.</p>
                    <p>Younger investors may be familiar with the term bear market but unfamiliar with the experience: We’ve been in a bull market — with rising prices, the opposite of a bear market — since March 2009. That makes it the longest bull run in history.</p>
                    <p>It came out of the Great Recession, however, and that’s how bulls and bears tend to go: Bull markets are followed by bear markets, and vice versa, with both often signaling the start of larger economic patterns. In other words, a bull market typically means investors are confident, which indicates economic growth. A bear market shows investors are pulling back, indicating the economy may do so as well.</p>
                    <p>The good news is that the average bull market far outlasts the average bear market, which is why over the long term you can grow your money by investing in stocks.</p>
                    <p>The S&P 500, which holds around 500 of the largest stocks in the U.S., has historically returned an average of around 7% annually, when you factor in reinvested dividends and adjust for inflation. That means if you invested $1,000 30 years ago, you could have around $7,600 today.</p>
                    <p><a href="https://www.nerdwallet.com/blog/investing/average-stock-market-return/" class="card-link">What Is the Average Stock Market Return?</a></p>
                  </div>


                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">Cras justo odio</li>
                    <li class="list-group-item">Dapibus ac facilisis in</li>
                    <li class="list-group-item">Vestibulum at eros</li>
                  </ul>

                  <div class="card-body">


                    <a href="https://iexcloud.io" class="card-link" target="_blank"> Chart Data provided by IEX Cloud</a>
                    <a href="https://www.tradingview.com/" class="card-link" target="_blank">Chart Graph provided by Trading View</a>

                  </div>



                </div>




                <div class="card">
                  <div class="card-body">
                    <div>
                    <p className="box-footer" align="right" style={{color: 'green'}}>
                    <h1 class="card-title">Current News</h1>

                    </p>

                    { this.state.articles.map((article, index) => {
                      return(
                        <div>
                        <p style={{color: 'darkblue'}}>
                        <h4 class="card-title"> { article.headline } </h4>
                        </p>
                        <h6 class="card-subtitle mb-2 text-muted"> Source: { article.source } </h6>

                        <p class="card-text"> {article.summary} </p>

                        <p className="box-footer" align="right">
                        <a href= {article.url} class="card-link" target="_blank"> Continue Reading Here </a>
                        </p>

                        </div>
                      )
                    }) }
                    </div>
                  </div>

                <div>
                <h1>Insert Line Chart Here</h1>

                </div>

                </div>






            </Flexbox>

            <Flexbox element="footer" height="60px">

            </Flexbox>
          </Flexbox>



        </React.Fragment>
        );
    }
}

export default Home
