import axios from 'axios';
import cheerio from 'cheerio';
import { CheerioElement } from 'cheerio';


interface CarPart {
  name: string;
  price: number;
  url?: string;
}

async function fetchAutoZone(query: string): Promise<CarPart[]> {
  const response = await axios.get(`https://www.autozone.com/search?q=${query}`);
  const $ = cheerio.load(response.data);

  const parts: CarPart[] = $('.part-selector').map((_: number, element: CheerioElement) => {
    const name = $(element).find('.part-name').text().trim();
    const priceText = $(element).find('.part-price').text().replace(/[$,]/g, '').trim();
    const price = parseFloat(priceText);

    return { name, price };
  }).toArray();

  return parts;
}

async function fetchOReilly(query: string): Promise<CarPart[]> {
  const response = await axios.get(`https://www.oreillyauto.com/search?q=${query}`);
  const $ = cheerio.load(response.data);

  const parts: CarPart[] = $('.part-selector').map((_: number, element: CheerioElement) => {
    const name = $(element).find('.part-name').text().trim();
    const priceText = $(element).find('.part-price').text().replace(/[$,]/g, '').trim();
    const price = parseFloat(priceText);

    return { name, price };
  }).toArray();

  return parts;
}

export async function comparePrices(query: string): Promise<{ autoZone: CarPart[]; oReilly: CarPart[] }> {
  const [autoZone, oReilly] = await Promise.all([fetchAutoZone(query), fetchOReilly(query)]);

  return { autoZone, oReilly };
}
