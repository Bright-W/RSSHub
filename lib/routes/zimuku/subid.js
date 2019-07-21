const got = require('@/utils/got');
const cheerio = require('cheerio');
// const formatPubDate = require('@/utils/date.js');

module.exports = async (ctx) => {
    const subid = ctx.params.subid;
    const url = `http://www.zimuku.la/subs/${encodeURI(subid)}.html`;

    const response = await got({
        method: 'get',
        url: url,
        headers: {
            Referer: url,
        },
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('.odd,.even');
    const title = $('.page-header H1').text();

    ctx.state.data = {
        title: `${title} - 字幕库`,
        link: url,
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: `${item
                            .find('.first a')
                            .eq(0)
                            .attr('title')}`,
                        description: `语言：${item
                            .find('.lang img')
                            .map(function() {
                                return $(this).attr('alt');
                            })
                            .get()
                            .join(', ')} \n格式：${item
                            .find('.first .label-info')
                            .map(function() {
                                return $(this).text();
                            })
                            .get()
                            .join(', ')} `,
                        pubDate: '',
                        link: `http://www.zimuku.la${item
                            .find('.first a')
                            .eq(0)
                            .attr('href')}`,
                    };
                })
                .get(),
    };
};
