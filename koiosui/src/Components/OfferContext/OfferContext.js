import React, { createContext } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import lodash from 'lodash';
import './OfferContext.css';
import Decimal from 'decimal.js';

export const OfferContext = createContext({
  articleCollection: [],
  addToCollection: () => [],
  removeFromCollection: () => [],
  returnCollection: () => {},
  createOffer: () => {},
  getData: () => {},
  suggestions: []
});

export class OfferProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articleCollection: [],
            getOffer: this.getOffer.bind(this),
            addToCollection: this.addToCollection.bind(this),
            returnCollection: this.returnCollection.bind(this),
            renderArticleAsRow: this.renderArticleAsRow.bind(this),
            createOffer: this.createOffer.bind(this),
            getData: this.getData.bind(this),
            suggestions: [],
            offerId: 0,
            offer: {
                Id: 0,
                Number: 0,
                CreatedAt: "",
                TotalPrice: 0
            },
            toggle: true,
            totalPrice: 0,
            amount: 0
        }

        this.getOffer = this.getOffer.bind(this);
        this.addToCollection = this.addToCollection.bind(this);
        this.removeFromCollection = this.removeFromCollection.bind(this);
        this.returnCollection = this.returnCollection.bind(this);
        this.renderArticleAsRow = this.renderArticleAsRow.bind(this);
        this.createOffer = this.createOffer.bind(this);
        this.getData = this.getData.bind(this);
        this.appendArticleToOffer = this.appendArticleToOffer.bind(this);
    }

    articleExistsInOffer = (articleId) => {
        let tmpArticles = this.state.articleCollection;

        for(let index in tmpArticles) {
            if (tmpArticles[index].id ===  articleId) {
                return index;
            }
        }

        return -1;
    }

    appendArticleToOffer = () => {
        let tmpArticles = this.state.articleCollection;

        for(let index in tmpArticles) {
            let exists = this.articleExistsInOffer(tmpArticles[index].id);

            if (exists >= 0) {
                if(!tmpArticles[exists].hasOwnProperty("amount")) {
                    tmpArticles[exists].amount = 0;
                }

                tmpArticles[exists].amount += 1;
            } 
        }

        this.setState({
            articleCollection: tmpArticles
        })
    }

    createOffer = () => {
        if(this.state.toggle) {
            this.setState({
                toggle: false
            })
        }
        else {
            this.setState({
                toggle: true
            })
        }

        return this.state.toggle;
    }

    getOffer = async (offerId) => {
        let url = "http://localhost:59189/api/Offer/GetOfferArticles?offerId="
            + offerId;

        let offerUrl = "http://localhost:59189/api/Offer/GetById?id="
            + offerId;

        await axios.get(offerUrl).then(response => {
            this.setState({
                offer: response.data
            });
        }).catch(error => {
            alert("Offer with given id doesn't exist.");

            this.setState({
                articleCollection: []
            })

            throw error;
        })

        await axios.get(url).then(response => {
            this.setState({
                articleCollection: response.data
            });

            this.setState({
                offerId: offerId
            });

            let tmpArray = [];
            let tmpSum = 0;

            this.setState({
                totalPrice: tmpSum
            });

            this.appendArticleToOffer();

            for(let index in response.data) {
                let tmpValue = response.data[index];
                if(!tmpArray.includes(tmpValue.id)) {
                    tmpArray.push(tmpValue.id);
                    let value1 = new Decimal(tmpValue.unitPrice);
                    tmpSum +=  parseFloat(value1.mul(tmpValue.amount !== undefined ? tmpValue.amount : 1));
                }
            }

            this.setState({
                totalPrice: tmpSum
            })
        }).catch(error => {
            this.setState({
                articleCollection: []
            })

            throw error;
        })
    }    
    
    addToCollection = async(article, offerId, amount) => {
        if(article !== undefined) {
            let tmpArray;

            this.state.articleCollection !== [] && this.state.articleCollection.length > 0
                ? tmpArray = this.state.articleCollection
                : tmpArray = []

            tmpArray.push(article);

            this.setState({
                articleCollection: tmpArray
            })

            for(let i = 0; i < amount; i++) {
                await this.addOfferArticle(offerId, article.id);
            }
            
            let calculatedTotalPrice = this.state.totalPrice + article.totalPrice;

            this.setState({
                totalPrice: calculatedTotalPrice
            });
        }
    }

    addOfferArticle = async (offerId, articleId) => {
        await axios.post('http://localhost:59189/api/Offer/AddOfferArticle', {
            "OfferId": offerId,
            "ArticleId": articleId
        }).then(response => {
            return response.data;
        }).catch(() => {
            return -1;
        });
    }

    deleteArticleFromOffer = async (articleId) => {
        let url = "http://localhost:59189/api/Offer/DeleteOfferArticle?offerId="
            + this.state.offerId
            + "&articleId="
            + articleId;

        await axios.delete(url)
            .then().catch(error => {
                alert("Something went wrong");
                throw error;
            })
    }

    removeFromCollection = async (article) => {
        let tmpArray = this.state.articleCollection;

        this.deleteArticleFromOffer(article.id)
            .then(() => {
                tmpArray = lodash.remove(tmpArray, value => 
                    value.Id !== article.id
                )
        
            this.setState({
                articleCollection: tmpArray
            })
        })

        await this.getOffer(this.state.offerId);
    }

    returnCollection = () => {
        return this.state.articleCollection;
    }

    renderArticleAsRow = (value, key) => {
        if(value != null && value.amount !== undefined){
            return(
                <tr key={key} className="articleAsRow">
                    <td>
                        {value.id}
                    </td>

                    <td>
                        {value.name}
                    </td>

                    <td>
                        {value.unitPrice}
                    </td>

                    <td>
                        {value.amount}
                    </td>

                    <td>
                        <Button
                            color="danger"
                            onClick={async () => await this.removeFromCollection({...value})}
                        >
                            Remove from offer
                        </Button>
                    </td>
                </tr>
            );
        }
        else{
            return null;
        }
    }

    getData = async (searchText) => {
        let result;

        let url = 'http://localhost:59189/api/Article/Paginated?name='
            + searchText
            + '&skip=0&take=10';

        if(searchText != null) {
            await axios.get(url)
                .then(response => {
                    result = response.data
                    return result;
                }).catch(error => {
                    alert("Something went wrong");
                    throw error;
                });

            this.setState({
                suggestions: result
            });
        }
    }

    render() {
        return (
            <OfferContext.Provider value={{...this.state}}>
                {{...this.props.children}}
            </OfferContext.Provider>
        );
    }
}

export const OfferConsumer = OfferContext.Consumer;