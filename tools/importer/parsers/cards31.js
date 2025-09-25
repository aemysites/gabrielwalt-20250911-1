/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each .d-teaser-boxes-stack__item
  function extractCard(cardEl) {
    // Find the image
    let img = null;
    const picture = cardEl.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img');
    }

    // Find the tag(s)
    let tag = null;
    const tagList = cardEl.querySelector('.d-teaser-box__tags');
    if (tagList) {
      // Only take the first tag, if multiple
      const tagSpan = tagList.querySelector('.d-base-tag--label');
      if (tagSpan) {
        tag = tagSpan.cloneNode(true);
      }
    }

    // Find the date
    let date = null;
    const dateSpan = cardEl.querySelector('.d-teaser-box__date span');
    if (dateSpan) {
      date = dateSpan.cloneNode(true);
    }

    // Find the title
    let title = null;
    const heading = cardEl.querySelector('.d-teaser-box__heading span');
    if (heading) {
      title = heading.cloneNode(true);
    }

    // Find the description
    let desc = null;
    const descSpan = cardEl.querySelector('.d-teaser-box__text span');
    if (descSpan) {
      desc = descSpan.cloneNode(true);
    }

    // Find the link
    let link = null;
    const anchor = cardEl.closest('a');
    if (anchor && anchor.href) {
      link = document.createElement('a');
      link.href = anchor.href;
      link.textContent = anchor.getAttribute('aria-label') || (title ? title.textContent : anchor.href);
      link.target = anchor.target || '_self';
      link.rel = anchor.rel || '';
    }

    // Compose text cell content
    const textCell = [];
    if (date) {
      const dateP = document.createElement('p');
      dateP.appendChild(date);
      textCell.push(dateP);
    }
    if (tag) {
      const tagP = document.createElement('p');
      tagP.appendChild(tag);
      textCell.push(tagP);
    }
    if (title) {
      const h3 = document.createElement('h3');
      h3.appendChild(title);
      textCell.push(h3);
    }
    if (desc) {
      const descP = document.createElement('p');
      descP.appendChild(desc);
      textCell.push(descP);
    }
    if (link) {
      textCell.push(link);
    }

    // Always use the image as the first cell
    return [img, textCell];
  }

  // Get all cards
  const cardEls = element.querySelectorAll(':scope > .d-teaser-boxes-stack__item');
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards31)'];
  rows.push(headerRow);
  // Card rows
  cardEls.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
