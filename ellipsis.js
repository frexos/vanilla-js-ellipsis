const ellipsis = (containerClass, targetClass, link=null) => {

  let containers = document.querySelectorAll(containerClass);

  for (let container of containers) {
    if (!container) {
      return;
    }

    let isText = container.classList.contains('text') || container.classList.contains('multiline_text');
    let moreLink = document.createElement('span');
    moreLink.className = 'more-props';
    moreLink.setAttribute("title", "View more properties in Coreon");
    if (link) {
      moreLink.setAttribute("target", "_blank");
      moreLink.setAttribute("href", link);
    }

    let targets = !isText ? container.querySelectorAll(targetClass) : container.querySelector(targetClass).innerHTML;
    let childReference = targets[0];
    let parentElement = !isText ? childReference.parentNode : container.querySelector(targetClass);
    let ch = container.getBoundingClientRect().top;
    let h = container.offsetHeight;

    function calculateOffset(t) {
      let th = t.getBoundingClientRect().bottom;
      // THE DISTANCE OF THE LOWERMOST PART OF THE TARGET FROM THE LOWERMOST PART OF THE CONTAINER
      return h-(th-ch);
    }

    if (isText) {
      //  ELLIPSIS IMPLEMENTATION FOR TEXT - BREAK BY WORD
      let initialOffset = calculateOffset(parentElement);

      if (initialOffset >= 0) return;

      let textArr = targets.split(" ");

      function renderPointerElem(index=-1) {
        let pointer = document.createElement('span');
        if (index < 0) {
          pointer.innerHTML = textArr[index];
          pointer.classList.add('pointer');
        }
        // REMOVE INITIAL TEXT
        while (parentElement.firstChild) {
          parentElement.removeChild(parentElement.lastChild);
        }

        for (let i=0; i<textArr.length; i++) {
          let elem = textArr[i];
          if (i === index) elem = pointer
          parentElement.append(elem);
          parentElement.append(' ');
        }

        return pointer;
      }

      let total = textArr.length;

      renderPointerElem();

      // VERTICAL SEARCH

      let r = total-1;
      let l = 0;
      let m = 0;

      while (l < r) {
        m = Math.floor((l+r)/2)

        if (calculateOffset(renderPointerElem(m)) > 0) {
          l = m+1;
        } else {
          r = m-1;
        }
      }
      let index = m;
      renderPointerElem(index);
      let offset = calculateOffset(renderPointerElem(index));
      // HORIZONTAL SEARCH
      while (offset > 0 && index < textArr.length) {
        index++;
        offset = calculateOffset(renderPointerElem(index));
      }

      while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.lastChild);
      }

      let newElems = textArr.slice(0, index-1);
      let newText = newElems.join(" ");

      parentElement.insertAdjacentHTML('beforeend', newText);

    } else {
      //  ELLIPSIS IMPLEMENTATION FOR LIST ITEMS
      let total = targets.length;
      let lastElem = targets[total-1];
      let initialOffset = calculateOffset(lastElem);

      if (initialOffset >= 0) return;
      // VERTICAL SEARCH
      let r = total-1;
      let l = 0;
      let m = 0;
      while (l < r) {
        m = Math.floor((l+r)/2)
        if ( calculateOffset(targets[m]) > 0) {
          l = m+1;
        } else {
          r = m-1;
        }
      }

      let index = m;
      let offset = calculateOffset(targets[index]);
      let currElem = targets[index];
      // HORIZONTAL SEARCH
      while (offset > 0 && index < targets.length) {
        index++;
        currElem = targets[index];
        offset = calculateOffset(currElem);
      }

      let newElems = Array.prototype.slice.call(targets).slice(0, index-1);

      while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.lastChild);
      }

      for (let element of newElems) {
        parentElement.append(element);
      }
    }

    parentElement.append(moreLink);
  }
}

export default ellipsis;