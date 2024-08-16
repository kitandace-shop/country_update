
//these functions grey out and disble buttons within a div and vice versa
function disableButtons(element) {
    const buttons = element.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.style.pointerEvents = 'none';
        button.style.color = 'lightgrey';
        button.style.backgroundColor = 'lightgrey';
    });
}

function enableButtons(element) {
    const buttons = element.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.style.pointerEvents = 'auto';
        button.style.color = '';
        button.style.backgroundColor = '';
    });
}


//make the add to bag button unclickable until the rebuy widget loads
cartButtonDiv = document.querySelector("#productStickyContainer");
disableButtons(cartButtonDiv);

const targetNode = document.body;
const config = { childList: true, subtree: true };

//modifications to the smart cart widget and add to cart button on render. Use mutation observer to detect the loading of the object
const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const element = document.getElementsByClassName('rebuy-cart__progress-step-label')[1];
            if (element) {
                console.log(element)
                //if the progress step label loads on the page, change it's contents to a generic "Free T-Shirt"
                element.innerHTML = "Free T-Shirt";
                //remove the specific "Free Gift" from the bottom of the smart cart widget
                document.querySelectorAll('.rebuy-cart__progress-bar-container.below').forEach(function(element) {
                    element.style.display = 'none';
                });
                //enable the add to cart and wishlist buttons
                enableButtons(cartButtonDiv);
                
                observer.disconnect();
            }
        }
    }
};

const observer = new MutationObserver(callback);

// Initial check
const initialElement = document.querySelector('.rebuy-cart__progress-step-label');
if (initialElement) {
    initialElement.innerHTML = "Free T-Shirt";
} else {
    observer.observe(targetNode, config);
}



