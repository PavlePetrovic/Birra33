function getData(){
    axios.get('https://api.punkapi.com/v2/beers')
        .then(res => {
            showTemplate(res.data);
            showTableShowList()
            search(res.data)
            addToCart(res.data)
            filter()
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
            addToCart(data)
            showTableShowList()

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
            showTableShowList()
        }

        searchedBeer = []
    })
    
    resetSearch.addEventListener('click', () => {
        resetSearch.style.display = 'none'
        showTemplate(data)
        searchBar.value = ''
        addToCart(data)
        showTableShowList()
    })
}

function showTableShowList(){
    let showTable = document.querySelector('.show-table')
    let showList = document.querySelector('.show-list')
    let contentItems = document.querySelector('.content-items')
    let beerBox = document.querySelectorAll('.beer-box')
    let beerBoxImg = document.querySelectorAll('.beer-box img')
    let beerDescription = document.querySelectorAll('.beer-description')
    let beerDescriptionH3 = document.querySelectorAll('.beer-description h3')
    let beerDescriptionText = document.querySelectorAll('.description-text')
    let beerPrice = document.querySelectorAll('.price')
    let addToCartBtn = document.querySelectorAll('.add-to-cart')

    contentItems.style.flexDirection = 'row'

    showTable.addEventListener('click', () => {
        contentItems.style.flexDirection = 'row'
        beerBox.forEach(box => {
            box.style.flexDirection = 'column'
            box.style.width = '260px'
            box.style.justifyContent = 'center'
            box.style.padding = '0px'
        })
        beerBoxImg.forEach(img => {
            img.style.marginTop = '15px'
            img.style.marginInline = '0px'
        })
        beerDescription.forEach(desc => {
            desc.style.width = '260px'
            desc.style.alignItems = 'center'
            desc.style.paddingLeft = '0px'
        })
        beerDescriptionH3.forEach(h => {
            h.style.display = 'none'
        })
        beerDescriptionText.forEach(text => {
            text.style.display = 'none'
        })
        beerPrice.forEach(price => {
            price.style.color = '#BF431F'
        })
        addToCartBtn.forEach(btn => {
            btn.style.width = '100%'
            btn.style.marginTop = '0px'
        })
    })

    showList.addEventListener('click', () => {
        contentItems.style.flexDirection = 'column'
        beerBox.forEach(box => {
            box.style.flexDirection = 'row'
            box.style.width = '100%'
            box.style.justifyContent = 'flex-start'
            box.style.padding = '25px'
        })
        beerBoxImg.forEach(img => {
            img.style.marginTop = '0px'
            img.style.marginInline = '60px'
        })
        beerDescription.forEach(desc => {
            desc.style.width = '100%'
            desc.style.alignItems = 'flex-start'
            desc.style.paddingLeft = '25px'
        })
        beerDescriptionH3.forEach(h => {
            h.style.display = 'block'
        })
        beerDescriptionText.forEach(text => {
            text.style.display = 'block'
        })
        beerPrice.forEach(price => {
            price.style.color = '#44322c'
        })
        addToCartBtn.forEach(btn => {
            btn.style.width = '170px'
            btn.style.marginTop = '5px'
        })
    })
}

function addToCart(data){
    let contentBox = document.querySelector(".content-items")
    let beerBox = contentBox.querySelectorAll('.beer-box')
    let cart = document.querySelector('.cart')
    let cartPlaceholder = document.querySelector('.cart-placeholder')
    let cartPrices = document.querySelector('.cart-prices')
    let total = cart.querySelector('.total')

    let beersInCart
    let totalPrice

    if(localStorage.getItem("totalPrice") === null){
        totalPrice = 0
    } else{
        totalPrice = JSON.parse(localStorage.getItem("totalPrice"))
    }
    
    if(localStorage.getItem("beersInCart") === null){
        beersInCart = []
    } else{
        beersInCart = JSON.parse(localStorage.getItem("beersInCart"))
    }

    if(beersInCart.length < 1){
        cartPlaceholder.innerText = 'No products in the cart'
        total.innerText = ``
    } else{
        cartPlaceholder.innerText = ''
        total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`
    }

    showTemplateCart(JSON.parse(localStorage.getItem("beersInCart")))

    localStorage.setItem('beersInCart', JSON.stringify(beersInCart))
    localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
    
    beerBox.forEach(beerDivItem => {
        beerDivItem.addEventListener('click', (e) => {
            if(e.target.tagName === 'BUTTON'){
                cartPlaceholder.innerText = ''
                let beerName = beerDivItem.children[1].children[0].innerText
                data.forEach(beerData => {
                    if(beerName === beerData.name){
                        let isBeerInCart = false
                        beersInCart.forEach(beer => {
                            if(beer.name === beerData.name){
                                beer.selectedBeerQuantity =  beer.selectedBeerQuantity + 1
                                let price = beer.abv
                                totalPrice += price
                                isBeerInCart = true
                            } 
                        })
                        if(isBeerInCart === false){
                            beerData.selectedBeerQuantity = 1
                            beersInCart.push(beerData)
                            let price = beerData.abv
                            totalPrice += price
                        }      

                        localStorage.setItem("beersInCart", JSON.stringify(beersInCart))
                    }
                })
                total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`
            }      

            localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
            showTemplateCart(JSON.parse(localStorage.getItem("beersInCart")))
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
                cartPlaceholder.innerText = 'No products in the cart'
                total.innerText = ``
                totalPrice = 0
                localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
            } else{
                beersInCart.forEach(beer => {
                    if(beer.name === delItemName){
                        totalPrice = totalPrice - beer.selectedBeerQuantity * beer.abv
                        total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`
                        beer.selectedBeerQuantity = 1
                        beersInCart.splice(beersInCart.indexOf(beer), 1)
                        localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
                    }
                })
            }  

            localStorage.setItem("beersInCart", JSON.stringify(beersInCart))
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

function priceFilter(data){
    let priceSlider = document.getElementById('price-slider')
    let showPrice = document.querySelector('.show-price')

    let beersInPriceRange = []
    
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
    addToCart(data)
    showTableShowList()
}

function filter(){
    let filterBtn = document.querySelector('.btn-filter')
    let brewedAfter = document.getElementById('brewed-after')
    let brewedBefore = document.getElementById('brewed-before')
    let resetFilters = document.querySelector('.reset')
    let searchBar = document.querySelector('input[type="search"]')
    let resetSearch = document.querySelector('.reset-search')
    
    filterBtn.addEventListener('click', () => {
        resetFilters.style.display = 'block'

        let after = brewedAfter.value
        let before = brewedBefore.value
        let afterYear = after.substring(0, 4)
        let afterMonth = after.substring(5, 7)
        let beforeYear = before.substring(0, 4)
        let beforeMonth = before.substring(5, 7)
        let pickedFood = ''
        
        let food = document.querySelectorAll('.radio-filter div input[name="food"]')
        food.forEach(radio => {
            if(radio.checked){
                pickedFood = radio.value
            }
        })

        if(after && before && pickedFood){
            axios.get(`https://api.punkapi.com/v2/beers?brewed_after=${afterMonth}-${afterYear}&brewed_before=${beforeMonth}-${beforeYear}&food=${pickedFood}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else if(after && before){
            axios.get(`https://api.punkapi.com/v2/beers?brewed_after=${afterMonth}-${afterYear}&brewed_before=${beforeMonth}-${beforeYear}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else if(after && pickedFood){
            axios.get(`https://api.punkapi.com/v2/beers?brewed_after=${afterMonth}-${afterYear}&food=${pickedFood}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else if(before && pickedFood){
            axios.get(`https://api.punkapi.com/v2/beers?brewed_before=${beforeMonth}-${beforeYear}&food=${pickedFood}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else if(after){
            axios.get(`https://api.punkapi.com/v2/beers?brewed_after=${afterMonth}-${afterYear}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else if(before){
            axios.get(`https://api.punkapi.com/v2/beers?brewed_before=${beforeMonth}-${beforeYear}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else if(pickedFood){
            axios.get(`https://api.punkapi.com/v2/beers?food=${pickedFood}`)
                .then(res => {
                    priceFilter(res.data)
                })
        } else{
            axios.get(`https://api.punkapi.com/v2/beers`)
            .then(res => {
                priceFilter(res.data)
            })
        }

        resetSearch.style.display = 'none'
        searchBar.value = ''
    })

    resetFilters.addEventListener('click', () => {
        let priceSlider = document.getElementById('price-slider')
        let showPrice = document.querySelector('.show-price')
        priceSlider.value = '0, 60'
        showPrice.innerHTML = `Price: $0 - $60`
        let food = document.querySelectorAll('.radio-filter div input[name="food"]')
        food.forEach(radio => {
            radio.checked = false
        })
        resetSearch.style.display = 'none'
        searchBar.value = ''
        resetFilters.style.display = 'none'
        axios.get(`https://api.punkapi.com/v2/beers`)
            .then(res => {
                showTemplate(res.data)
                addToCart(res.data)
                showTableShowList()
            })
    })
}
