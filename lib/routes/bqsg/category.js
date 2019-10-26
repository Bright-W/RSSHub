const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const category = ctx.params.category;
    const feed = await encodeURI(`http://bq.sg/category/${category}`);
    const response = await got.get(feed);
    const $ = cheerio.load(response.data);
    const list = $('.item-primary');

    const resultItems = await Promise.all(
        list.toArray().map(async (item) => {
            const $item = $(item);
            const link = $item.find('a')[0].attribs.href;

            let resultItem = {};
            let pubdate = new Date(new Date().toDateString());
            const parts = link.split('/');
            if (parts.length > 5) {
                pubdate = new Date(parts[3], parts[4] - 1, parts[5]);
            }
            // else{
            //     var matches = date.match(/(\d+)/);
            //     if(matches){
            //         pubdate = new Date()
            //     }
            // }

            resultItem = {
                title: $item.find('.item-primary-title').text(),
                description: $($item.find('.item-primary-desc').find('p')[0]).text(),
                pubDate: pubdate,
                link: link,
            };

            return Promise.resolve(resultItem);
        })
    );

    ctx.state.data = {
        title: 'BQ.SG',
        link: feed,
        description: 'BQ.SG BargainQueen - Singapore deals news, coupon, discount, promotions',
        item: resultItems,
    };
};
