/* Set rates + misc */
var taxRate = 0;
var shippingRate = 0; 
var fadeTime = 300;


/* Assign actions */
$('.product-quantity input').change( function() {
  updateQuantity(this);
});

$('.product-removal button').click( function() {
  removeItem(this);
});


/* Recalculate cart */
function recalculateCart()
{
  var subtotal = 0;
  
  /* Sum up row totals */
  $('.product').each(function () {
    subtotal += parseFloat($(this).children('.product-line-price').text());
  });
  
  /* Calculate totals */
  var tax = 0 * 0;
  var shipping = (0 > 0 ? 0 : 0);
  var total = subtotal + tax + shipping;
  
  /* Update totals display */
  $('.totals-value').fadeOut(fadeTime, function() {
    $('#cart-subtotal').html(subtotal.toFixed(2));
    $('#cart-tax').html(tax.toFixed(2));
    $('#cart-shipping').html(shipping.toFixed(2));
    $('#cart-total').html(total.toFixed(2));
    if(total == 0){
      $('.checkout').fadeOut(fadeTime);
    }else{
      $('.checkout').fadeIn(fadeTime);
    }
    $('.totals-value').fadeIn(fadeTime);
  });
}


/* Update quantity */
function updateQuantity(quantityInput)
{
  /* Calculate line price */
  var productRow = $(quantityInput).parent().parent();
  var price = parseFloat(productRow.children('.product-price').text());
  var quantity = $(quantityInput).val();
  var linePrice = price * quantity;
  
  /* Update line price display and recalc cart totals */
  productRow.children('.product-line-price').each(function () {
    $(this).fadeOut(fadeTime, function() {
      $(this).text(linePrice.toFixed(2));
      recalculateCart();
      $(this).fadeIn(fadeTime);
    });
  });  
}


/* Remove item from cart */
function removeItem(removeButton)
{
  /* Remove row from DOM and recalc cart total */
  var productRow = $(removeButton).parent().parent();
  productRow.slideUp(fadeTime, function() {
    productRow.remove();
    recalculateCart();
  });
}

const checkoutButton = document.querySelector('.checkout')
// Obtener todos los elementos con la clase "product-title"
const productTitleElements = document.querySelectorAll('.product-title');

// Obtener todos los elementos con la clase "product-quantity"
const productQuantityElements = document.querySelectorAll('.product-quantity p');

// Crear arrays para almacenar los valores
const productTitles = [];
const productQuantities = [];

// Iterar a través de los elementos y almacenar los valores en los arrays
productTitleElements.forEach((element) => {
  productTitles.push(element.textContent);
});

productQuantityElements.forEach((element) => {
  productQuantities.push(element.textContent);
});


checkoutButton.addEventListener('click', () => {

    const cid = document.getElementById('cid').textContent.trim().substring(8)
    console.log(cid)
    const cartTotal = parseFloat(document.getElementById("cart-total").textContent);
    const products = [productTitles, productQuantities]
    
    const data = {
        amount: cartTotal,
        cid,
        products
    }

    fetch(`/api/carts/${cid}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          return response.json()
        })
        .then(data => {
          if(data.status === "success"){
            alert('Compra realizada, se le enviara un email con el ticket')
          }
        })
        .catch(error => {
          console.error("Error:", error)
        });
})