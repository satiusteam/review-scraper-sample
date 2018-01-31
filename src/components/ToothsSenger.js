import React, {Component,Fragment} from 'react';
import styles from './ToothsSenger.css';

import {
  downloadCSV,
  parseResponse,
  addPageToUrl,
  MAIN_URL,
  setupParseWithPages
} from '../functions/scrapeFunctions';


const pageToCompareTo =   "https://www.toothssenger.com/118276-ofallon-dentist-dr-edward-logan"

const parseWithPages = setupParseWithPages(MAIN_URL,parseResponse,addPageToUrl);


export default class extends Component {

  state = {
    reviews: []
  };

  componentDidMount(){

    const addReviews = reviews =>{
      this.setState({ reviews });
    };

    parseWithPages().then(reviews =>{
      addReviews(reviews);
    });
  }


  render(){
    const downloadWithCSVFormat = downloadCSV('reviews.csv');
    const listOfItems = (review) =>

        <div className={"card"}>

          <h1>{review.name},{review.datePublished}</h1>

          <h2>Review Body</h2>
          <p>
            {review.reviewBody}
          </p>
          <h2>About Front Desk</h2>
          <p>
            {review[ "AboutFrontDesk" ]}
          </p>
          <h2>About Hygenist</h2>
          <p>
            {review[ "AboutHygienist" ]}
          </p>
        </div>;


    const listOfReviews = this.state.reviews.map((review, i) => (
            <ul key={i}>
              {listOfItems(review)}
            </ul>

        )
    );


    return (
        <Fragment>
          <header style={{textAlign: "center"}}>
            <h1>Checkout source code on github</h1>
            <div className={[styles.centered,"row"].join(' ')}>
              <div className={"col m4 l2 s12 offset-l3"}  style={{padding: '3%'}}>
                <a target={"_blank"} href={"https://github.com/satiusteam/review-scraper-sample"} className="btn">
                  GitHub
                </a>
              </div>
              <div className={"col m4 l2 s12"} style={{padding: '3%'}}>

              <a className={"btn"} target={"_blank"} href={"https://github.com/satiusteam/review-scraper-sample/archive/1.0.zip"}>
                 Download .zip
                </a>
              </div>
              <div className={"col m4 l2 s12"}  style={{padding: '3%'}}>

              <a className={"btn"} target={"_blank"} href={"https://github.com/satiusteam/review-scraper-sample/archive/1.0.tar.gz"}>
                  Download .tar.gz
                </a>
              </div>
            </div>
          </header>
          <hr />
          <div className={"container"}>
            <div className={"row"}>
              <div className={"col l8 m8 s8"}>
                <h3>
                  This is scrape result
                </h3>
                <h4>
                  <a style={{ cursor: 'pointer' }} onClick={() => downloadWithCSVFormat(this.state.reviews)}>Download
                    CSV</a>
                </h4>
                <h5>
                  Total downloaded <strong style={{fontSize: 'larger'}}>{this.state.reviews.length ? this.state.reviews.length : "---"}</strong>
                </h5>

                <div className={"reviews"}>
                  {this.state.reviews.length ? listOfReviews : <h5>"loading..."</h5>}
                </div>


              </div>
              <div className={"col l4 m4 s4"}>
                <h3> This is the page we are scraping</h3>
                <iframe title={"toothssenger"} style={{ height: '500px' }} src={pageToCompareTo}></iframe>
              </div>
            </div>
          </div>
        </Fragment>

    )

  }
}

/* downloadCSV({ filename: "stock-data.csv" }); */
