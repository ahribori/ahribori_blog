/* =========================================
 Build sitemap.xml
 ============================================*/
require('dotenv').config();
import request from 'request';
import routes from './routes';
import { createRoutes } from 'react-router';
import Sitemap from 'react-router-sitemap';
import { routesParser as parseRoutes } from 'react-router-sitemap';
import { paramsApplier as applyParams } from 'react-router-sitemap';
const route = createRoutes(routes);
const paths = parseRoutes(route);

const getArticles = new Promise((resolve, reject) => {
    request({
        method: 'GET',
        url: `${process.env.API_SERVER}/api/article?offset=0&limit=999999999`,
        headers: {
            'authorization': process.env.TOKEN
        }
    }, (err, response, body) => {
        if (err) reject(err);
        if (body) {
            try {
                const bodyObject = JSON.parse(body);
                resolve(bodyObject.articles);
            } catch (e) {
                reject(e);
            }
        }
    });
});

const getCategories = new Promise((resolve, reject) => {
    request({
        method: 'GET',
        url: `${process.env.API_SERVER}/api/category`,
        headers: {
            'authorization': process.env.TOKEN
        }
    }, (err, response, body) => {
        if (err) reject(err);
        if (body) {
            try {
                const bodyObject = JSON.parse(body);
                const categories = bodyObject.response;
                resolve(categories);
            } catch (e) {
                reject(e);
            }
        }
    });
});

Promise.all([getArticles, getCategories])
.then((results) => {
    const articles = results[0];
    const categories = results[1];
    const articles_ids = [];
    const categories_ids = [];


    for (let x = 0; x < categories.length; x++) {
        categories_ids.push(categories[x]._id);
    }
    for (let i = 0; i < articles.length; i++) {
        articles_ids.push(articles[i]._id);
    }

    const config = {
        '/category/:id': [
            { id: categories_ids },
        ],
        '/article/:id': [
            { id: articles_ids }
        ],
    };
    const dynamicPaths = applyParams(paths, config);
    const sitemap = new Sitemap(routes);
    sitemap.paths = dynamicPaths;
    sitemap.build('https://ahribori.com').save("./public/sitemap.xml");
})
.catch((error) => {
    console.error(error);
});
