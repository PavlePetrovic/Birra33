function getData(){
    axios.get('https://api.punkapi.com/v2/beers')
        .then(res => {
            showTemplate(res.data);
            search(res.data)
            priceFilter(res.data)
            addToCart(res.data)
        })
        .catch(err => {
            console.log(err);
        })
}
getData()

function showTemplate(data){
    let beers = data
    
    let scriptTemplate = document.querySelector('#template')
    let contentBox = document.querySelector(".content-items")
    
    let template = Handlebars.compile(scriptTemplate.innerHTML)
    let filled = template(beers, {
        // Default je false, to znaci:
        // Ako imamo {name: "list <br> 3 </br>"}, on ce da ga konvertuje kao tekst, ceo string
        // A ako je true, onda kada dodje do html taga u stringu, on konvertuje html, u ovom slucaju bi 3 bilo boldovano
        noEscape: true
    })
    contentBox.innerHTML = filled
    
    // Koraci
    // * Imamo podatke [data] iz kojih izvlacimo informacije
    // * Imamo varijablu template u kojoj kompajlujemo nas handlebar kod, koji smo napisali u html-u
    // * Imamo varijablu filled u kojoj smestamo kompajlovan kod - html prikaz
    // * Hvatamo element u kome zelimo da prikazemo kod i onda ga ubacujemo pomocu innerHTML
}

function search(data){
    let searchBar = document.querySelector('input[type="search"]')
    let searchBtn = document.querySelector('.search-button')
    let snackbar = document.getElementById('snackbar')
    let resetSearch = document.querySelector('.reset-search')
    
    let searchedBeer = []

    searchBtn.addEventListener('click', () => {
        let searchBarValue = searchBar.value

        if( searchBarValue.length < 2 ){
            snackbar.className = "show"
            snackbar.innerText = "Beer name"
            showTemplate(data)

            setTimeout( function(){  
                snackbar.className = snackbar.className.replace("show", ""); 
            }, 3000);
        } else {
            resetSearch.style.display = 'block'

            data.forEach(beer => {
                if(beer.name.toLowerCase() === searchBarValue.toLowerCase()){
                    if(!searchedBeer.includes(beer)){
                        searchedBeer.push(beer)
                    } 
                    if(searchedBeer.length > 1){
                        searchedBeer.shift()
                    }
                }
            })
            showTemplate(searchedBeer)
            addToCart(searchedBeer)
        }

        searchedBeer = []
    })
    
    resetSearch.addEventListener('click', () => {
        resetSearch.style.display = 'none'
        showTemplate(data)
        searchBar.value = ''
        addToCart(data)
    })
}

function showTableShowList(){
    let showTable = document.querySelector('.show-table')
    let showList = document.querySelector('.show-list')
    let contentItems = document.querySelector('.content-items')

    showTable.addEventListener('click', () => {
        contentItems.style.flexDirection = 'row'
    })

    showList.addEventListener('click', () => {
        contentItems.style.flexDirection = 'column'
    })
}
showTableShowList()

function priceFilter(data){
    let priceSlider = document.getElementById('price-slider')
    let priceFilterBtn = document.querySelector('.btn-filter')
    let showPrice = document.querySelector('.show-price')
    let resetFilter = document.querySelector('.reset')

    let beersInPriceRange = []
    
    priceFilterBtn.addEventListener('click', () => {
        resetFilter.style.display = 'block'
        let priceRange = priceSlider.value.replace(/\s+/g, '') // Pr: 0, 80 -> 0,80
        let commaIndex = priceRange.indexOf(',')
        let price1 = priceRange.substring(0, commaIndex)
        let price2 = priceRange.substring(commaIndex + 1)
        showPrice.innerHTML = `Price: $${price1} - $${price2}`

        let condition = false
        data.forEach(beer => {
            if(beer.abv >= price1 && beer.abv <= price2){
                if(!beersInPriceRange.includes(beer)){
                    beersInPriceRange.push(beer)
                }
                condition = true
            } else{
                if(beersInPriceRange.includes(beer)){
                    let beerIndex = beersInPriceRange.indexOf(beer)
                    beersInPriceRange.splice(beerIndex, 1)
                }
            }
        })
        if(condition === false){
            beersInPriceRange = []
        }
       
        showTemplate(beersInPriceRange)
        addToCart(beersInPriceRange)
    })

    resetFilter.addEventListener('click', () => {
        resetFilter.style.display = 'none'
        showTemplate(data)
        showPrice.innerHTML = `Price: $0 - $60`
        addToCart(data)
    })
}

function addToCart(data){
    let contentBox = document.querySelector(".content-items")
    let beerBox = contentBox.querySelectorAll('.beer-box')
    let cart = document.querySelector('.cart')
    let cartPrices = document.querySelector('.cart-prices')
    let total = cart.querySelector('.total')

    let beersInCart = []
    let totalPrice = 0
    
    beerBox.forEach(beerDivItem => {
        beerDivItem.addEventListener('click', (e) => {
            if(e.target.tagName === 'BUTTON'){
                let beerName = beerDivItem.children[3].innerText
                data.forEach(beerData => {
                    if(beerName === beerData.name){
                        if(beersInCart.includes(beerData)){
                            beerData.selectedBeerQuantity = beerData.selectedBeerQuantity + 1
                        } else{
                            beersInCart.push(beerData)
                            beerData.selectedBeerQuantity = 1
                        }
                        let price = beerData.abv
                        totalPrice += price
                    }
                })
            }      
            showTemplateCart(beersInCart)
            total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`
        })
    })

    cartPrices.addEventListener('click', (e) => {
        if(e.target.tagName === 'I'){
            let clickedItem = e.target.parentElement
            let itemText = clickedItem.innerHTML
            let indexOfIcoStart = itemText.indexOf('<')
            itemText = itemText.substring(0, indexOfIcoStart)
            let indexOfDash = itemText.lastIndexOf('-')
            let delItemName = itemText.substring(0, indexOfDash)
            delItemName = delItemName.trim()

            clickedItem.remove()
        
            if(beersInCart.length === 1){
                beersInCart.pop()
                totalPrice = 0
                total.innerText = ''
            } else{
                beersInCart.forEach(beer => {
                    if(beer.name === delItemName){
                            totalPrice = totalPrice - beer.selectedBeerQuantity * beer.abv
                            total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`
                            beer.selectedBeerQuantity = 1
                            beersInCart.splice(beersInCart.indexOf(beer), 1)
                    }
                })
            }  
        }
    })
}

function showTemplateCart(data){
    let beers = data
    
    let scriptTemplate = document.querySelector('#template-cart')
    let cart = document.querySelector(".cart-prices")
    
    let template = Handlebars.compile(scriptTemplate.innerHTML)
    let filled = template(beers)
    cart.innerHTML = filled
}