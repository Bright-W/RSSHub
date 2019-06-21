const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got.get('http://www.wuhaozhan.net/movie/list/');
    const $ = cheerio.load(response.data);
    const list = $('.l-box');
    ctx.state.data = {
        title: '五号站',
        link: 'http://www.wuhaozhan.net/movie/list/',
        description: '电影',
        item: 
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: item.find('.l-a').text() + item.find('.l-release-year').text() + '-' + item.find('.l-addition .l-average').text(),
                        description: item.find('.l-des').text() +'\n'+ item.find('.tags').text(),
                        pubDate: new Date(item.find('.dt').text()).toUTCString(),
                        link: item.find('.l-a').attr('href'),
                    };
                })
                .get(),
    };
};
