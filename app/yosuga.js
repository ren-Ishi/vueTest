window.onload = Main;
const baseURL = "http://localhost:3000";
function Main() {
    Vue.createApp({
        data() {
            return {
                input: "",
                Tag: "",
                ProductArray: [],
                pickupArray: [],
                boughtArray: [],
                showOrder: false,
                showHOME: true,
                showPickupArea: false,
                showBlock: true,
                showList: false,
                showHistory: false
            }
        },
        methods: {
            //HOMEに戻る
            backHOME: function (str) {
                this.showHOME = true;
                this.showPickupArea = false;
                this.showList = false;
                this.showOrder = false;
            },

            //購入履歴追加
            unshiftHistory: function (name) {
                this.boughtArray.unshift(new history(name));
            },

            //検索ボックスから検索
            searchingAll: function () {
                let url = "/Products?name_like=" + this.input;
                url = baseURL + encodeURI(url);
                this.updateProducts(url);
                this.showHOME = false;
                this.showList = false;
                this.showPickupArea = false;
            },

            //タグ検索
            searchingByTag: function (str) {
                let url = "/Products?hashtag_like=" + str;
                url = baseURL + encodeURI(url);
                this.updateProducts(url);
                this.showHOME = false;
                this.showList = true;
                this.Tag = str;
            },

            //詳細表示
            showPickup: function (name) {
                this.showPickupArea = true;
                let url = "/Products?name_like=" + name;
                url = baseURL + encodeURI(url);
                fetch(url, { method: 'GET' })
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        if (Array.isArray(res)) {
                            this.pickupArray = res;
                        }
                        else {
                            this.pickupArray = [res];
                        }
                    })
                    .catch((res) => {
                        console.log(res);
                    });
            },

            //購入手続き
            orderItem: function (event) {

                const orderURL = baseURL + '/Products/' + event.target.name;
                fetch(orderURL, { method: 'GET' })
                    .then((response) => {
                        return response.json();
                    })
                    .then((response) => {
                        if (response.stock <= 0) {

                        } else {
                            let updatedStock = response.stock - 1;
                            fetch(orderURL, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "id": response.id,
                                    "hashtag": response.hashtag,
                                    "stock": updatedStock,
                                    "name": response.name,
                                    "image": response.image,
                                    "price": response.price,
                                    "explanation": response.explanation
                                })
                            })
                                .then((res) => {
                                    this.showOrder = true;
                                });
                        }
                    })
                    .catch((response) => {
                        console.log(response);
                    });
            },

            //商品検索
            updateProducts: function (url) {
                fetch(url, { method: 'GET' })
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        if (Array.isArray(res)) {
                            this.ProductArray = res;
                        }
                        else {
                            this.ProductArray = [res];
                        }
                    })
                    .catch((res) => {
                        console.log(res);
                    });
            }
        }
    }).mount('#yosugaApp');
}

class history {
    constructor(str) {
        this.bought = str;
        let now = new Date();
        this.Date = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    }
}