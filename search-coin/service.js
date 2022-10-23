const fetch = require('node-fetch');
const cheerio = require('cheerio');

const baseUrl = 'https://en.numista.com';

async function getCoins(filter) {
	try {
		const response = await fetch(`${baseUrl}/catalogue/index.php?r=${filter}&ct=coin`);
		const body = await response.text();
		const $ = cheerio.load(body);
		const coins = [];
		$('.resultat_recherche').each(element => {
			const coin = {};
			element.find('.photo_avers > img').each(image => coin.avers = baseUrl + image.src);
			element.find('.photo_revers > img').each(image => coin.reverse = baseUrl + image.src);
			coins.push(coin);
		});
		return coins;
	} catch (error) {
		return [];
	}
}

async function getCoin(coin) {
	try {

	} catch (error) {
		return {};
	}
}

module.exports = {getCoins, getCoin};