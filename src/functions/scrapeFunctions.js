import cheerio from "cheerio";
import axios from "axios/index";

import {
  prepStringForCSv,
  createAKeyAbleValue
} from '../utils/fp';

export const convertArrayOfObjectsToCSV = ({data,columnDelimiter,lineDelimiter,keys,result,ctr}) =>{

  if ( data == null || !data.length ) {
    return null;
  }

  columnDelimiter = columnDelimiter || ',';
  lineDelimiter = lineDelimiter || '\n';

  keys = Object.keys(data[ 0 ]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item){
    ctr = 0;
    keys.forEach(function (key){
      if ( ctr > 0 ) result += columnDelimiter;

      result += item[ key ] ? `"${item[ key ]}"` : "";
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

export const downloadCSV = (filename) => data =>{
  let csv = convertArrayOfObjectsToCSV({
    data
  });
  if ( csv == null ) return;

  filename = filename || 'export.csv';

  if ( !csv.match(/^data:text\/csv/i) ) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  let link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
};

export const parseResponse = response =>{
  const $ = cheerio.load(response.data);

  const results = [];
  $(".jsReviewItem").map((index, reviewItem) =>{

    let itemToadd = {};
    const name = $(reviewItem).find("span[itemprop='author'] span[itemprop='name']").text().trim();
    const datePublished = $(reviewItem).find("span[itemprop='datePublished']").text();
    const key = datePublished.replace(/\s|\.|,|:/g, "");
    let reviewBody = prepStringForCSv($(reviewItem).find("span[itemprop='reviewBody']").text());


    itemToadd = { name, reviewBody, datePublished, key };
    $(reviewItem).find("div.reviewbox p").map((index, paragraph) =>{
      if ( $(paragraph).find("strong").html() ) {
        const key = createAKeyAbleValue($(paragraph)
            .find("strong")
            .html())
        ;
        $(paragraph).find("strong").remove();
        const body = $(paragraph).html();
        if ( key.length && body.length ) {
          itemToadd[ key ] = prepStringForCSv(body);
        }
      }
      return index;
    });


    if ( name.length && reviewBody.length && datePublished.length ) {
      results.push(itemToadd);
    }
    return itemToadd;
  });

  return results;

}

export const MAIN_URL = "https://www.toothssenger.com/api/118276-ofallon-dentist-dr-edward-logan";

export const addPageToUrl = (mainUrl, page) => `${mainUrl}?review=${page}`;


export const setupParseWithPages = (mainUlr,parserFunction,urlMutator) => {

    return async function parseWithPagesFunc(page = 1, processed = []){

      const results = await axios
          .get(urlMutator(mainUlr, page))
          .then(response =>{

            return parserFunction(response);

          });

      return results.length > 0 ? parseWithPagesFunc(page + 1, processed.concat(results)) : processed;
    };
}

