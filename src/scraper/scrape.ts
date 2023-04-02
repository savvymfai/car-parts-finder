import axios from 'axios';
import cheerio from 'cheerio';

interface CarPart {
  name: string;
  price: number;
}

async function fetchAutoZone(query: string): Promise<CarPart[]> {
  const response = await axios.get(`https://www.autozone.com/search?q=${query}`);
  const $ = cheerio.load(response.data);

  // Update these selectors based on the actual structure of the AutoZone website
  const parts = $('.part-selector').map((_, element) => {
    const name = $(element).find('.part-name').text().trim();
    const priceText = $(element).find('.part-price').text().replace(/[$,]/g, '').trim();
    const price = parseFloat(priceText);

    return { name, price };
  }).toArray();

  return parts as CarPart[];
}

async function fetchOReilly(query: string): Promise<CarPart[]> {
  const response = await axios.get(`https://www.oreillyauto.com/search?q=${query}`);
  const $ = cheerio.load(response.data);

  // Update these selectors based on the actual structure of the O'Reilly Auto Parts website
  const parts = $('.part-selector').map((_, element) => {
    const name = $(element).find('.part-name').text().trim();
    const priceText = $(element).find('.part-price').text().replace(/[$,]/g, '').trim();
    const price = parseFloat(priceText);

    return { name, price };
  }).toArray();

  return parts as CarPart[];
}

export async function comparePrices(query: string): Promise<{ autoZone: CarPart[]; oReilly: CarPart[] }> {
  const autoZone = await fetchAutoZone(query);
  const oReilly = await fetchOReilly(query);

  return { autoZone, oReilly };
}
