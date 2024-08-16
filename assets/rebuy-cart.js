const targetNode = document.body;
const config = { childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const element = document.getElementsByClassName('rebuy-cart__progress-step-label')[1];
            if (element) {
                console.log("This lol");
                console.log(element)
                element.innerHTML = "Free T-Shirt";
                observer.disconnect();
            }
        }
    }
};

const observer = new MutationObserver(callback);

// Initial check
const initialElement = document.querySelector('.rebuy-cart__progress-step-label');
if (initialElement) {
    console.log("This lol");
    initialElement.innerHTML = "Free T-Shirt";
} else {
    observer.observe(targetNode, config);
}
