import { ICrawler } from '../../domain/crawler.interface';
import { Provider } from '../usecases-provider/usecases-provider';
import { ILogger } from '../../domain/logger.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { SearchResponseDto } from '../http/dto/search.response.dto';

export class CrawlerService implements ICrawler {
  constructor(
    @Inject(Provider.LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}
  async getDataCrawler(checkin: string, checkout: string) {
    const URL = `https://pratagy.letsbook.com.br/D/Reserva?checkin=${checkin}&checkout=${checkout}&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&mesCalendario=3%2F14%2F2023`;

    this.logger.log(
      'CrawlerService getDataCrawler',
      'Start process getDataCrawler',
    );

    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    await page.goto(URL, {
      waitUntil: 'networkidle2',
    });

    const data: SearchResponseDto[] = await page.evaluate(() => {
      const nodeList = document.querySelectorAll(
        '#tblAcomodacoes > tbody tr.row-quarto',
      );
      const hotelArray = [...nodeList];

      const listaHotel = [];

      hotelArray.forEach((hotel, i) => {
        i++;
        const search: SearchResponseDto = {
          name: hotel.querySelector(
            '#tblAcomodacoes > tbody tr > td.tdQuarto > div > div.flex-table-row > span',
          ).textContent,
          description: hotel.querySelector(
            '#tblAcomodacoes > tbody tr > td.tdQuarto > div > div.quartoContent > div > div > p',
          ).textContent,
          price: hotel.querySelector(
            '#tblAcomodacoes > tbody tr > td.precoQuarto > div.relative > div.flex-price > span.valorFinal.valorFinalDiscounted',
          )?.textContent,
          image: hotel
            .querySelector(
              `#tblAcomodacoes > tbody > tr:nth-child(${i}) > td.tdQuarto > div > div.left-col > ul > div.slick-list.draggable > div > li.slick-slide.slick-current.slick-active > img`,
            )
            ?.getAttribute('data-src'),
        };
        listaHotel.push(search);
      });
      return listaHotel;
    });

    const verifyList = data.every((objeto) => {
      return Object.values(objeto).every((valor) => valor === undefined);
    });

    if (verifyList) {
      await browser.close();
      throw new NotFoundException('No hotel found');
    }
    await browser.close();

    this.logger.log(
      'CrawlerService getDataCrawler',
      'Finish process getDataCrawler',
    );

    return data;
  }
}
