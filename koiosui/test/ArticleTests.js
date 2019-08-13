import * as Article from '../src/Components/Article/Article.js';

var assert = require('assert');
var expect = require('expect');

describe('Will add new article', function() {
    it('if new article is created with return of its id', async () => {
        this.timeout(10000);

        let article = {
            name: "Article2",
            unitPrice: "150"
        };

        await Article.saveArticle(article)
            .then((result) => {
                // console.log("Nemoj me jebat: " + result);
                // assert.notEqual(result.result, 0);
                // assert.notEqual(result.status, 400);
                expect(result).toBeGreaterThanOrEqual(1);
                // assert.doesNotThrow('Bad Request');
            }).catch(error => {
                throw error;
            });
    });
});

describe('Will', function() {
    it('save 3 articles', async () => {
        this.timeout(10000);

        let article1 = {
            name: "Article2",
            unitPrice: "150"
        };

        let article2 = {
            name: "Article2",
            unitPrice: "150"
        };

        let article3 = {
            name: "Article1",
            unitPrice: "150"
        };

        await Article.saveArticle(article1)
            .then(async (result1) => {
                assert.notEqual(result1, 0);
                // expect(result1).resolves.toBeGreaterThan(0);
                assert.doesNotThrow('Bad Request');
                await Article.saveArticle(article2)
                    .then(async (result2) => {
                        assert.notEqual(result2, 0);
                        // expect(result2).resolves.toBeGreaterThan(0);
                        assert.doesNotThrow('Bad Request');
                        await Article.saveArticle(article3)
                            .then((result3) => {
                                assert.notEqual(result3, 0);
                                // expect(result3).resolves.toBeGreaterThan(0);
                                assert.doesNotThrow('Bad Request');
                            }).catch(error2 => {
                                throw error2;
                            })
                    }).catch(error3 => {
                        throw error3;
                    })
            }).catch(error1 => {
                throw error1;
            });
    });

    it('get all articles with name: Article2, maximum 10', async () => {
        this.timeout(10000);

        await Article.getSuggestionsByName("Article2", 0, 10)
            .then((result) => {
                assert.doesNotThrow('Bad Request');
                expect(result.response).resolves.toBeLessThanOrEqual(10);
            }).catch(error => {
                throw error;
            });
    });

    it('get all articles with name: Article2, but only first 2', async () => {
        this.timeout(10000);

        await Article.getSuggestionsByName("Article2", 0, 2)
            .then((result) => {
                assert.doesNotThrow('Bad Request');
                expect(result.response).resolves.toEqual(2);
            }).catch(error => {
                throw error;
            });
    });

    it('get all articles with name: Article2, skip 1 and take only first 2', async () => {
        this.timeout(10000);

        await Article.getSuggestionsByName("Article2", 1, 2)
            .then(result => {
                console.log("Rezultat glasi: " + result);
                // assert.doesNotThrow('Bad Request');
                // console.log("Rezultat: " + JSON.parse(result));
                // let objectResult = JSON.parse(result);
                assert.ok(result.length > 0);
                // expect(JSON.parse(result)).resolves.toHaveLength(2);
            })
            .catch(error => {
                console.log("Errorčina: " + error);
                throw error;
            });
    });

    it('save new article, store article id and then delete that article with that id', async () => {
        this.timeout(10000);

        let article = {
            name: "Article75000",
            unitPrice: "150"
        };
        
        await Article.saveArticle(article)
            .then(async (res) => {
                expect(res).toBeGreaterThan(0);
                await Article.deleteArticle(res)
                    .then((res2) => {
                        assert.notEqual(res2, 400);
                    }).catch(error =>{
                        throw error;
                    });
            }).catch(error => {
                throw error;
            });
    });

    it('update article with different name', async () => {
        this.timeout(10000);

        let article = {
            name: "Article75000",
            unitPrice: "150"
        };
        
        return await Article.saveArticle(article)
            .then(async (res) => {
                console.log("Rezultat prvog dijela: " + res);
                expect(res).toBeGreaterThan(0);
                article.id = res;
                article.name = "Article77777777";
                await Article.updateArticle(article)
                    .then((res2) => {
                        console.log("Rezultat drugog dijela: " + res2);
                        assert.notEqual(res2, 400);
                        console.log("Uspjeh");
                    }).catch(error =>{
                        done(error);
                    });
            }).catch(error => {
                done(error);
            });
        });
});