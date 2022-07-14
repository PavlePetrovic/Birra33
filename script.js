let selectView = document.getElementById('selectView');
let leftArrow = document.getElementById('left')
let rightArrow = document.getElementById('right')
let page1 = document.getElementById('page-1')
let page2 = document.getElementById('page-2')
let page3 = document.getElementById('page-3')

let axiosURL = ``

let pageNumber = 1
let perPage = 10

selectView.addEventListener('click', () => {
    let selectViewValue = selectView.options[selectView.selectedIndex].value;
    selectViewValue = parseInt(selectViewValue)

    if (selectViewValue === 10) {
        perPage = 10
    } else if (selectViewValue === 20) {
        perPage = 20
    } else if (selectViewValue === 30) {
        perPage = 30
    }

    getData()
})

leftArrow.addEventListener('click', () => {
    if (pageNumber === 1) {
        pageNumber = 1
    } else {
        pageNumber = pageNumber - 1
        getData()
    }

    if (pageNumber === 1) {
        page1.classList.add('clicked')
        page2.classList.remove('clicked')
        page3.classList.remove('clicked')
    } else if (pageNumber === 2) {
        page1.classList.remove('clicked')
        page2.classList.add('clicked')
        page3.classList.remove('clicked')
    } else if (pageNumber === 3) {
        page1.classList.remove('clicked')
        page2.classList.remove('clicked')
        page3.classList.add('clicked')
    }
})

rightArrow.addEventListener('click', () => {
    if (pageNumber === 3) {
        pageNumber = 3
    } else {
        pageNumber = pageNumber + 1
        getData()
    }

    if (pageNumber === 1) {
        page1.classList.add('clicked')
        page2.classList.remove('clicked')
        page3.classList.remove('clicked')
    } else if (pageNumber === 2) {
        page1.classList.remove('clicked')
        page2.classList.add('clicked')
        page3.classList.remove('clicked')
    } else if (pageNumber === 3) {
        page1.classList.remove('clicked')
        page2.classList.remove('clicked')
        page3.classList.add('clicked')
    }
})

page1.addEventListener('click', () => {
    pageNumber = 1
    getData()

    page1.classList.add('clicked')
    page2.classList.remove('clicked')
    page3.classList.remove('clicked')
})

page2.addEventListener('click', () => {
    pageNumber = 2
    getData()

    page1.classList.remove('clicked')
    page2.classList.add('clicked')
    page3.classList.remove('clicked')
})

page3.addEventListener('click', () => {
    pageNumber = 3
    getData()

    page1.classList.remove('clicked')
    page2.classList.remove('clicked')
    page3.classList.add('clicked')
})

function getData() {
    axiosURL = `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=${perPage}`

    axios.get(axiosURL)
        .then(res => {
            showTemplate(res.data)
            onDisplayViewChange()
            showBeerModal(res.data)
            onSearch(res.data)
            addToCart(res.data)
            onBtnFilterClick()
        })
        .catch(err => {
            console.log(err);
        })
}
getData() 

function showTemplate(data) {
    let scriptTemplate = document.querySelector('#template')
    let contentBox = document.querySelector(".content-items")

    let template = Handlebars.compile(scriptTemplate.innerHTML)
    let filled = template(data, {
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

function onSearch(data) {
    let searchBar = document.querySelector('input[type="search"]')
    let searchBtn = document.querySelector('.search-button')
    let snackbar = document.getElementById('snackbar')
    let resetSearch = document.querySelector('.reset-search')
    
    let searchedBeer = []

    searchBtn.addEventListener('click', () => {
        let searchBarValue = searchBar.value

        if ( searchBarValue.length < 2 ){
            snackbar.className = "show"
            snackbar.innerText = "Beer name"
            showTemplate(data)
            addToCart(data)
            onDisplayViewChange()

            setTimeout( function() {  
                snackbar.className = snackbar.className.replace("show", ""); 
            }, 3000);
        } else {
            resetSearch.style.display = 'block'

            data.forEach(beer => {
                if (beer.name.toLowerCase() === searchBarValue.toLowerCase()) {
                    if (!searchedBeer.includes(beer)) {
                        searchedBeer.push(beer)
                    } 
                    if (searchedBeer.length > 1) {
                        searchedBeer.shift()
                    }
                }
            }) 

            showTemplate(searchedBeer)
            addToCart(searchedBeer)
            onDisplayViewChange()
            showBeerModal(searchedBeer)
        }

        searchedBeer = []
    })
    
    resetSearch.addEventListener('click', () => {
        resetSearch.style.display = 'none'
        showTemplate(data)
        searchBar.value = ''
        addToCart(data)
        onDisplayViewChange()
        showBeerModal(data)
    })
}

function onDisplayViewChange() {
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
            box.classList.remove('beer-box-list')
            box.classList.add('beer-box-grid')
        })
        beerBoxImg.forEach(img => {
            img.classList.remove('img-list')
            img.classList.add('img-grid')
        })
        beerDescription.forEach(desc => {
            desc.classList.remove('beer-description-list')
            desc.classList.add('beer-description-grid')
        })
        beerDescriptionH3.forEach(h => {
            h.classList.remove('h3-list')
            h.classList.add('h3-grid')
        })
        beerDescriptionText.forEach(text => {
            text.classList.remove('description-text-list')
            text.classList.add('description-text-grid')
        })
        beerPrice.forEach(price => {
            price.classList.remove('price-list')
            price.classList.add('price-grid')
        })
        addToCartBtn.forEach(btn => {
            btn.classList.remove('add-to-cart-list')
            btn.classList.add('add-to-cart-grid')
        })
    })

    showList.addEventListener('click', () => {
        contentItems.style.flexDirection = 'column'
        beerBox.forEach(box => {
            box.classList.remove('beer-box-grid')
            box.classList.add('beer-box-list')
        })
        beerBoxImg.forEach(img => {
            img.classList.remove('img-grid')
            img.classList.add('img-list')
        })
        beerDescription.forEach(desc => {
            desc.classList.remove('beer-description-grid')
            desc.classList.add('beer-description-list')
        })
        beerDescriptionH3.forEach(h => {
            h.classList.remove('h3-grid')
            h.classList.add('h3-list')
        })
        beerDescriptionText.forEach(text => {
            text.classList.remove('description-text-grid')
            text.classList.add('description-text-list')
        })
        beerPrice.forEach(price => {
            price.classList.remove('price-grid')
            price.classList.add('price-list')
        })
        addToCartBtn.forEach(btn => {
            btn.classList.remove('add-to-cart-grid')
            btn.classList.add('add-to-cart-list')
        })
    })
}

function addToCart(data) {
    let contentBox = document.querySelector(".content-items")
    let beerBox = contentBox.querySelectorAll('.beer-box')
    let cart = document.querySelector('.cart')
    let cartPlaceholder = document.querySelector('.cart-placeholder')
    let cartPrices = document.querySelector('.cart-prices')
    let total = cart.querySelector('.total')

    let beersInCart
    let totalPrice

    if (localStorage.getItem("totalPrice") === null) {
        totalPrice = 0
    } else {
        totalPrice = JSON.parse(localStorage.getItem("totalPrice"))
    }
    
    if (localStorage.getItem("beersInCart") === null) {
        beersInCart = []
    } else {
        beersInCart = JSON.parse(localStorage.getItem("beersInCart"))
    }

    if (beersInCart.length < 1) {
        cartPlaceholder.innerText = 'No products in the cart'
        total.innerText = ``
    } else {
        cartPlaceholder.innerText = ''
        total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`
    }

    showTemplateCart(JSON.parse(localStorage.getItem("beersInCart")))

    localStorage.setItem('beersInCart', JSON.stringify(beersInCart))
    localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
    
    beerBox.forEach(beerDivItem => {
        beerDivItem.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                cartPlaceholder.innerText = ''
                let beerName = beerDivItem.children[1].children[0].innerText
                data.forEach(beerData => {
                    if (beerName === beerData.name) {
                        let isBeerInCart = false
                        beersInCart.forEach(beer => {
                            if (beer.name === beerData.name) {
                                beer.selectedBeerQuantity =  beer.selectedBeerQuantity + 1
                                let price = beer.abv
                                totalPrice += price
                                isBeerInCart = true
                            } 
                        })
                        if (isBeerInCart === false) {
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
        if (e.target.tagName === 'I') {
            let clickedItem = e.target.parentElement
            let itemText = clickedItem.innerHTML
            let indexOfIcoStart = itemText.indexOf('<')
            itemText = itemText.substring(0, indexOfIcoStart)
            let indexOfDash = itemText.lastIndexOf('-')
            let delItemName = itemText.substring(0, indexOfDash)
            delItemName = delItemName.trim()

            clickedItem.remove()
        
            if (beersInCart.length === 1) {
                beersInCart.pop()
                cartPlaceholder.innerText = 'No products in the cart'
                total.innerText = ``
                totalPrice = 0
                localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
            } else {
                beersInCart.forEach(beer => {
                    if (beer.name === delItemName) {
                        totalPrice = JSON.parse(localStorage.getItem("totalPrice"))
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

function showTemplateCart(data) {
    let scriptTemplate = document.querySelector('#template-cart')
    let cart = document.querySelector(".cart-prices")
    
    let template = Handlebars.compile(scriptTemplate.innerHTML)
    let filled = template(data)
    cart.innerHTML = filled
}

function onInputPriceChange(data) {
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
        if (beer.abv >= price1 && beer.abv <= price2) {
            if (!beersInPriceRange.includes(beer)) {
                beersInPriceRange.push(beer)
            }
            condition = true
        } else {
            if (beersInPriceRange.includes(beer)) {
                let beerIndex = beersInPriceRange.indexOf(beer)
                beersInPriceRange.splice(beerIndex, 1)
            }
        }
    })

    if (condition === false) {
        beersInPriceRange = []
    }
    
    showTemplate(beersInPriceRange)
    addToCart(data)
    onDisplayViewChange()
    showBeerModal(data)
}

function onBtnFilterClick() {
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
        leftArrow.style.display = 'none'
        rightArrow.style.display = 'none'
        page1.style.display = 'none'
        page2.style.display = 'none'
        page3.style.display = 'none'
        
        let food = document.querySelectorAll('.radio-filter div input[name="food"]')
        food.forEach(radio => {
            if (radio.checked) {
                pickedFood = radio.value
            }
        })

        let url = axiosURL

        if (after) {
            url = `${url}&brewed_after=${afterMonth}-${afterYear}`      
        }
        if (before) {
            url = `${url}&brewed_before=${beforeMonth}-${beforeYear}`        
        }
        if (pickedFood) {
            url = `${url}&food=${pickedFood}`
        }

        axios.get(url)
            .then(res => {
                onInputPriceChange(res.data)
            })

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
        leftArrow.style.display = 'inline'
        rightArrow.style.display = 'inline'
        page1.style.display = 'inline'
        page2.style.display = 'inline'
        page3.style.display = 'inline'
        axios.get(axiosURL)
            .then(res => {
                showTemplate(res.data)
                addToCart(res.data)
                onDisplayViewChange()
                showBeerModal(res.data)
            })
    })
}

function showBeerModal(data) {
    let modal = document.querySelectorAll(".modal");
    let beerBox = document.querySelectorAll('.beer-box')

    beerBox.forEach(beer => {
        beer.addEventListener('click', (e) => {
            if (e.target.tagName != 'BUTTON') { 
                let clickedBeerName = beer.children[1].children[0].innerText
                let clickedModal
                let clickedBeerData 

                modal.forEach(mod => {
                    let modBeerName = mod.children[0].innerText
                    if (clickedBeerName === modBeerName) {
                        mod.style.display = "block";
                        clickedModal = mod
                    }
                })

                data.forEach(beer => {
                    if (beer.name === clickedBeerName) {
                        clickedBeerData = beer
                    }
                })

                let quantityInput = clickedModal.querySelector('#quantity')
                let upArrow = clickedModal.querySelector('#quantity-up')
                let upDown = clickedModal.querySelector('#quantity-down')
                
                quantityInput.value = 1

                upArrow.addEventListener('click', () => {
                    console.log(quantityInput.value);
                    let inputValue = parseInt(quantityInput.value)
                    inputValue++
                    quantityInput.value = inputValue
                })

                upDown.addEventListener('click', () => {
                    let inputValue = parseInt(quantityInput.value)
                    if (inputValue === 1) {
                        quantityInput.value = 1
                    } else {
                        inputValue--
                        quantityInput.value = inputValue
                    }
                })

                let cart = document.querySelector('.cart')
                let cartPlaceholder = document.querySelector('.cart-placeholder')
                let total = cart.querySelector('.total')
                let addBtn = clickedModal.querySelector('.add-in-cart-modal')
                
                addBtn.addEventListener('click', () => {
                    let beersInCart
                    let totalPrice

                    if (localStorage.getItem("totalPrice") === null) {
                        totalPrice = 0
                    } else {
                        totalPrice = JSON.parse(localStorage.getItem("totalPrice"))
                    }

                    if (localStorage.getItem("beersInCart") === null) {
                        beersInCart = []
                    } else {
                        beersInCart = JSON.parse(localStorage.getItem("beersInCart"))
                    }

                    showTemplateCart(JSON.parse(localStorage.getItem("beersInCart")))

                    localStorage.setItem('beersInCart', JSON.stringify(beersInCart))
                    localStorage.setItem('totalPrice', JSON.stringify(totalPrice))

                    let inputValue = parseInt(quantityInput.value)
                              
                    cartPlaceholder.innerText = ''

                    let isBeerInCart = false

                    beersInCart.forEach(beer => {
                        if (beer.name === clickedBeerName) {
                            beer.selectedBeerQuantity =  beer.selectedBeerQuantity + inputValue
                            let price = beer.abv
                            totalPrice = price * inputValue + totalPrice
                            isBeerInCart = true
                            localStorage.setItem("beersInCart", JSON.stringify(beersInCart))
                        } 
                    })

                    if (isBeerInCart === false) {
                        clickedBeerData.selectedBeerQuantity = inputValue
                        beersInCart.push(clickedBeerData)
                        let price = clickedBeerData.abv * inputValue
                        totalPrice += price
                        localStorage.setItem("beersInCart", JSON.stringify(beersInCart))
                    }
                    
                    total.innerText = `TOTAL: $${totalPrice.toFixed(1)}`     
                    
                    localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
                    showTemplateCart(JSON.parse(localStorage.getItem("beersInCart")))
                })

                window.addEventListener('click', (e) => {
                    addToCart(data)
                    if (e.target == clickedModal) {
                        clickedModal.style.display = "none";
                        document.location.reload()
                    }
                })
            }
        })
    })
}

let showCartBtn = document.querySelector('.show-cart')
let showFilltersBtn = document.querySelector('.show-filters')

showCartBtn.addEventListener('click', () => {
    let cart = document.querySelector('.cart')
    cart.classList.toggle('toggle-cart')
})
showFilltersBtn.addEventListener('click', () => {
    let filters = document.querySelector('.filters')
    filters.classList.toggle('toggle-filters')
})