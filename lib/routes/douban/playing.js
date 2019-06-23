const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const score = parseFloat(ctx.params.score) || 0;
    const response = await got({
        method: 'get',
        url: `https://movie.douban.com/cinema/nowplaying/beijing`,
    });
    const $ = cheerio.load(response.data);

    ctx.state.data = {
        title: `正在上映的${score ? `超过 ${score} 分的` : ''}电影`,
        link: `https://movie.douban.com/cinema/nowplaying/`,
        item: $('.list-item')
            .get()
            .map((i) => {
                const item = $(i);
                const itemScore = parseFloat(item.attr('data-score')) || 0;
                if (itemScore >= score) {
                    return {
                        title: item.attr('data-title'),
                        description: `标题：${item.attr('data-title')} 评分：${itemScore} 片长：${item.attr('data-duration')} 制片国家/地区：${item.attr('data-region')} 导演：${item.attr(
                            'data-director'
                        )} 主演：${item.attr('data-actors')}`,
                        link: `https://movie.douban.com/subject/${item.attr('id')}`,
                    };
                } else {
                    return null;
                }
            })
            .filter((item) => item),
    };
    ctx.state.allowEmpty = true;
};
