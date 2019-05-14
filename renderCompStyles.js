let resizeTimeout;
renderCompStyles = function(update = false) {  
  
  // If not resizing
  if( ! update ) {
    
    // Remove all previous localStorage instances of csElements
    Object.keys(localStorage).reduce(function(obj, str) { 
      obj[str] = localStorage.getItem(str); 
      if( keys(obj)[0].indexOf('csElement-') > -1 ) {
        window.localStorage.removeItem(str);
      }
    }, {});

    // Generate stylesheet
    var stylesheet = document.createElement('style');
    stylesheet.type = 'text/css';
    var css = `
      .computedStyles {
        position: relative;
        z-index: 99;
        background: black;
        color:white;
        padding: 16px;
        color: white;
        border-radius: 5px;
        display: inline-flex;
        flex-flow: column nowrap;
      }
      .is-updating {
        display: inline-block;
        animation: updatePulse 1s forwards;
        color: red;
      }
      @keyframes updatePulse {
        0% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.5);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    stylesheet.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(stylesheet);
  }

  // Function to generate styleIds
  function generateStyleId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Get all elements with the [data-render-styles] attribute
  let elements = document.querySelectorAll('[data-render-styles]');      
  elements.forEach(element => {

    let styleAttributes = element.getAttribute('data-render-styles').replace(/\s/g, "").split(',');
    let computedStylesData = JSON.stringify(window.getComputedStyle(element));
    let elementStyleId = 'csElement-'+ generateStyleId(6);
    let stylesBlock = element.nextElementSibling;

    renderStyleData = function(elementStyleId) {          
      let elementStyleData = JSON.parse(window.localStorage.getItem(elementStyleId));
      if( ! update ) {
        element.insertAdjacentHTML('afterend', `<div class="computedStyles" />`);
      }
      // Loop throught style attributes
      styleAttributes.forEach(attribute => {
        if( ! element.nextElementSibling.querySelector(`[data-attribute=${attribute}]`) ) { 
          element.nextElementSibling.insertAdjacentHTML('beforeend', 
            `<div class="computedStyles__item" data-attribute=${attribute}>
              <strong>${attribute}</strong>: <span class="computedStyles__value"></span>;
            </div>`
          )
        }
        // Check if attribute exists in elementStyleData (localStorage)
        if( attribute in elementStyleData ) {
          let csValue = element.nextElementSibling.querySelector(`[data-attribute=${attribute}] .computedStyles__value`);
          if( csValue.innerHTML !== elementStyleData[attribute] ) {
            csValue.innerHTML = elementStyleData[attribute];
            csValue.classList.add('is-updating');
            csValue.addEventListener('animationend', function() {
              csValue.classList.remove('is-updating');
            });
          }
        }
      })          
    }

    if( ! update ) {
      element.setAttribute('data-style-id', elementStyleId)
      window.localStorage.setItem(elementStyleId, computedStylesData);
      renderStyleData(elementStyleId);
    } else {
      let elementStyleId = element.getAttribute('data-style-id');
      window.localStorage.setItem(elementStyleId, computedStylesData);
      renderStyleData(elementStyleId);
    }

  });   
  
  // Resize functionality
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      return renderCompStyles(true);
    }, 100);
  });

}
