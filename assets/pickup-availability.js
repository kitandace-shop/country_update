if (!customElements.get('pickup-availability')) {
    customElements.define( 
      'pickup-availability',
      class PickupAvailability extends HTMLElement {
        constructor() {
          super();
  
          if (!this.hasAttribute('available')) return;
          this.errorHtml = this.querySelector('template').content.firstElementChild.cloneNode(true);
          this.onClickRefreshList = this.onClickRefreshList.bind(this);
          this.fetchAvailability(this.dataset.variantId);
        }
  
        fetchAvailability(variantId) {
          var bopis_id="0";
          //console.log("bopis_cookie:"+this.getCookie("bopis"));
          /*
          if (sessionStorage.bopis_store == null){
            bopis_id="0";
          }else{
            bopis_id=sessionStorage.bopis_store;
          }*/
          if (this.getCookie("bopis")==""){
            bopis_id="0";
          }else{
            bopis_id=this.getCookie("bopis"); 
          }
          //console.log("bopis_store:"+bopis_id);
          let rootUrl = this.dataset.rootUrl;
          if (!rootUrl.endsWith('/')) {
            rootUrl = rootUrl + '/';
          }
          const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability&bopis_store=${bopis_id}`; 
  
          fetch(variantSectionUrl)
            .then((response) => response.text())
            .then((text) => {
              const sectionInnerHTML = new DOMParser()
                .parseFromString(text, 'text/html')
                .querySelector('.shopify-section');
              this.renderPreview(sectionInnerHTML);
            })
            .catch((e) => {
              const button = this.querySelector('button');
              if (button) button.removeEventListener('click', this.onClickRefreshList);
              this.renderError();
            });
        }
  
        onClickRefreshList(evt) {
          this.fetchAvailability(this.dataset.variantId);
        }
  
        renderError() {
          this.innerHTML = '';
          this.appendChild(this.errorHtml);
  
         this.querySelector('button').addEventListener('click', this.onClickRefreshList);
        }
  
        renderPreview(sectionInnerHTML) {
  
          const drawer = document.querySelector('pickup-availability-drawer');
          if (drawer) drawer.remove();
          if (!sectionInnerHTML.querySelector('pickup-availability-preview')) {
            this.innerHTML = '';
            this.removeAttribute('available');
            return;
          }
  
          this.innerHTML = sectionInnerHTML.querySelector('pickup-availability-preview').outerHTML;
          this.setAttribute('available', '');
  
          document.body.appendChild(sectionInnerHTML.querySelector('pickup-availability-drawer'));
          const colorClassesToApply = this.dataset.productPageColorScheme.split(' ');
          colorClassesToApply.forEach((colorClass) => {
            document.querySelector('pickup-availability-drawer').classList.add(colorClass);
          });
          const button = this.querySelector('button');
          if (button)
            button.addEventListener('click', (evt) => {
              document.querySelector('pickup-availability-drawer').show(evt.target);
            });
        }
        setCookie(cname, cvalue, exdays) {
          const d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          let expires = "expires="+ d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }       
        getCookie(cname) {
          let name = cname + "=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        }         
      }
    );
  }
  if (!customElements.get('pickup-availability-drawer')) {
    customElements.define(
      'pickup-availability-drawer',
      class PickupAvailabilityDrawer extends HTMLElement {
        constructor() {
          super();
  
          this.onBodyClick = this.handleBodyClick.bind(this);
  
          this.querySelector('button').addEventListener('click', () => {
            this.hide();
          });

          var elList=this.querySelectorAll('.bopis_default');
          elList.forEach(el => el.addEventListener('click', this.onClickBopis));
          this.addEventListener('keyup', (event) => {
            if (event.code.toUpperCase() === 'ESCAPE') this.hide();
          });
        }
  
        handleBodyClick(evt) {
          const target = evt.target;
          if (
            target != this &&
            !target.closest('pickup-availability-drawer') &&
            target.id != 'ShowPickupAvailabilityDrawer'
          ) {
            this.hide();
          }
        }
        onClickBopis(evt) {
          console.log("bopis clicked:"+this.dataset.bopis);
          sessionStorage.setItem("bopis_store", this.dataset.bopis);
          const d = new Date();
          d.setTime(d.getTime() + (365*24*60*60*1000));
          let expires = "expires="+ d.toUTCString();
          document.cookie = "bopis" + "=" + this.dataset.bopis + ";" + expires + ";path=/";
          
          
          window.location.reload();
          console.log("session:"+sessionStorage.bopis_store);
        }

        hide() {
          this.removeAttribute('open');
          document.body.removeEventListener('click', this.onBodyClick);
          document.body.classList.remove('overflow-hidden');
          //removeTrapFocus(this.focusElement);
        }
  
        show(focusElement) {
          this.focusElement = focusElement;
          this.setAttribute('open', '');
          document.body.addEventListener('click', this.onBodyClick);
          document.body.classList.add('overflow-hidden');
          //trapFocus(this);
        }
      }
    );
  }
  

  