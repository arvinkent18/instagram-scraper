const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const baseUrl = 'https://instagram.com/';
const handler = 'willsmith';

(async () => {
  let html = await requestPromise({
    url: baseUrl + handler,
  });

  let $ = cheerio.load(html);

  let script = $('script[type="text/javascript"]').eq(3).html();

  let regex = /window._sharedData = (.+);/g.exec(script);

  let { entry_data: { ProfilePage: { [0]: { graphql: { user } } } } } = JSON.parse(regex[1]);

  let data = {
    name: user.full_name,
    profile_picture: user.profile_pic_url,
    followers: user.edge_followed_by.count,
    following: user.edge_follow.count,
    uploads: user.edge_owner_to_timeline_media.count,
  }

  console.log(data);
})();