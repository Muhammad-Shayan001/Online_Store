const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// Define your routes here
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/#/products', changefreq: 'weekly', priority: 0.8 },
  { url: '/#/about', changefreq: 'monthly', priority: 0.5 },
  { url: '/#/contact', changefreq: 'monthly', priority: 0.5 },
  { url: '/#/login', changefreq: 'monthly', priority: 0.3 },
  { url: '/#/register', changefreq: 'monthly', priority: 0.3 },
  { url: '/#/shipping-policy', changefreq: 'monthly', priority: 0.3 },
  { url: '/#/refund-policy', changefreq: 'monthly', priority: 0.3 },
  { url: '/#/privacy', changefreq: 'monthly', priority: 0.3 },
  { url: '/#/terms', changefreq: 'monthly', priority: 0.3 },
];

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname: 'https://www.onlinestore.com' });
  const writeStream = createWriteStream(path.resolve(__dirname, '../frontend/sitemap.xml'));

  sitemap.pipe(writeStream);

  links.forEach(link => sitemap.write(link));
  sitemap.end();

  await streamToPromise(sitemap);
  console.log('Sitemap generated successfully in public/sitemap.xml');
};

generateSitemap();
