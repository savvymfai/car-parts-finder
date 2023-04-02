import axios from 'axios';
import cheerio from 'cheerio';

export interface CarPart {
  name: string;
  price: number;
  url?: string;
}

async function fetchParts(url: string): Promise<CarPart[]> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const parts: CarPart[] = $('.part-selector').map((_: any, element: any) => {
    const name = $(element).find('.part-name').text().trim();
    const priceText = $(element).find('.part-price').text().replace(/[$,]/g, '').trim();
    const price = parseFloat(priceText);

    return { name, price };
  }).toArray();

  return parts;
}

export async function comparePrices(query: string): Promise<{ autoZone: CarPart[]; oReilly: CarPart[] }> {
  const [autoZone, oReilly] = await Promise.all([
    fetchParts(`https://www.autozone.com/search?q=${query}`),
    fetchParts(`https://www.oreillyauto.com/search?q=${query}`),
  ]);

  return { autoZone, oReilly };
}
