import axios from 'axios';
import xml2js from 'xml2js';
import Log from '@dazn/lambda-powertools-logger';
import { TideRecord } from '@lib/common';

/**
 * Retrieve XML based tide info
 *
 * @param locationCode
 * @param year
 */
export async function downloadTideSourceInfo(locationCode, year) {
  const sourceUri = `https://getij.rws.nl/data/xml/hwlw-${locationCode}-${year}0101-${year}1231.xml`;
  Log.info('Going to download tide info: ' + sourceUri, { locationCode, year });

  return await axios.get(sourceUri);
}

/**
 * parse the raw xml into in-memory json structure
 *
 * @param xml raw string
 */
export async function parseXml(xml: string): Promise<any> {
  /*
<astronomical-tide>
    <location>Rotterdam</location>
    <reference>NAP</reference>
    <timezone>Nederlandse tijd (GMT +1)</timezone>
    <source>www.getij.nl</source>
    <values>
        <value>
            <datetime>202001010326 </datetime>
            <tide>LW</tide>
            <val> -9</val>
        </value>
        <value>
            <datetime>202001010736 </datetime>
            <tide>HW</tide>
            <val> 117</val>
        </value>
*/
  const parser = new xml2js.Parser();
  return await parser.parseStringPromise(xml);
}

/**
 * map the in-memory xml json structure to our own domain objects
 *
 * @param xml raw parsed to json
 */
export async function mapXmlToJson(xml: any): Promise<Array<TideRecord>> {
  // "values": [
  //   {
  //     "value": [
  // {
  //   "datetime": [
  //     "202001010326 "
  //   ],
  //   "tide": [
  //     "LW"
  //   ],
  //   "val": [
  //     " -9"
  //   ]
  // },


  const parseDate = (date: string) => {
    // we need to convert dates in form of 202001010326 to 2020-01-01T03:26:00+01:00
    const year = date.substr(0, 4);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);
    const hour = date.substr(8, 2);
    const minute = date.substr(10, 2);

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00+01:00`);
  };

  return (xml['astronomical-tide'].values[0].value as Array<{ datetime: Array<string>, tide: Array<string>, val: Array<string> }>).map((el, idx) => {
    // sometimes its a simple (xml) object, sometimes the value is an object in which the value is inside property '_'
    const rawdate = typeof el.datetime[0] === 'string' ? el.datetime[0] : el.datetime[0]['_'];
    return {
      at: parseDate(rawdate),
      tide: el.tide[0] === 'LW' ? 'LW' : 'HW',
      elevation: parseInt(el.val[0], 10)
    };
  });
}