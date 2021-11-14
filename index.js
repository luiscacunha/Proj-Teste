const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



app.get('/', (req, res) => {
    res.json('Seja bem vindo à minha API sobre Cripto Moedas, podera consultar precos das moedas e ver noticias sobre em portugues.')
})

const newspapers = [
    {
        name: 'CM Jornal',
        address: 'https://www.cmjornal.pt/pesquisa/?SearchRequest.RangeType=All&SearchRequest.Filters=&SearchRequest.Sort=Relevance&SearchRequest.ContentType=All&SearchRequest.Query=criptomoeda&SearchRequest.FromStr=14%2F11%2F2011&SearchRequest.ToStr=14%2F11%2F2021' ,
        base: ''
    },
    {
        name: 'Sapo',
        address: 'https://www.sapo.pt/pesquisa/web/noticias?q=cripto+moedas#gsc.tab=0&gsc.q=cripto%20moedas&gsc.page=1' ,
        base: 'www.sapo.pt/'
    },{
        name: 'Observador',
        address: 'https://observador.pt/2021/02/04/visa-lanca-projeto-piloto-de-criptomoedas-com-o-anchorage-digital-bank/' ,
        base: 'www.observador.pt/'
    }

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('a:contains("cripto")', html).each(function () {
                const Titulo = $(this).text().replace("\n","")
                const url = $(this).attr('href')

                articles.push({
                    Titulo,
                    url: newspaper.base + url,
                    fonte: newspaper.name
                })
            })

            $('a:contains("criptomoedas")', html).each(function () {
                const Titulo = $(this).text().replace("\n","")
                const url = $(this).attr('href')

                articles.push({
                    Titulo,
                    url: newspaper.base + url,
                    fonte: newspaper.name
                })
            })
            $('a:contains("bitcoin")', html).each(function () {
                const Titulo = $(this).text().replace("\n","")
                const url = $(this).attr('href')

                articles.push({
                    Titulo,
                    url: newspaper.base + url,
                    fonte: newspaper.name
                })
            })
            

        })
})

app.get('/noticias', (req, res) => {
    res.json(articles)
})

app.get('/moedas-preco', (req, res) => {

    axios.get('https://coinmarketcap.com/').then((urlResponse) => {
        const $ = cheerio.load(urlResponse.data);

        const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr'

        const keys = [
            'posicao',
            'nome',
            'preco',
            'percentual 24h',
            'percentual 7d',
            'valor de mercado',
            'volume',
            'suprimento Circulante '
        ]
        const coinArr = []


        $(elemSelector).each((parentIdx,parentElem)=>{
            let keyIdx = 0
            const coinObj = {}
            if(parentIdx <= 9){
                $(parentElem).children().each((childIdx,childElem)=>{
                    let tdValue = $(childElem).text()

                    if (keyIdx === 1 || keyIdx === 6){
                        tdValue=$('p:first-child',$(childElem).html()).text()
                    }
                    
                    if (tdValue) {
                        coinObj[keys[keyIdx]] = tdValue
                        keyIdx++
                    }  
                    
                })
                coinArr.push(coinObj)
                    console.log(coinObj)

            }

        });
     //   console.log(coinArr)
        res.json(coinArr)
    });

});




app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))