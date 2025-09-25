/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each .d-teaser-boxes-stack__item
  function extractCard(cardEl) {
    // Find image
    let img = null;
    const imgEl = cardEl.querySelector('img');
    if (imgEl) {
      img = imgEl.cloneNode(true);
    }
    // Find title (use text, not the element itself)
    let title = '';
    const titleDiv = cardEl.querySelector('.d-base-card__title .d-base-heading');
    if (titleDiv) {
      title = titleDiv.textContent.trim();
    }
    // Find description (use text, not the element itself)
    let desc = '';
    const descP = cardEl.querySelector('.d-base-card__content p');
    if (descP) {
      desc = descP.textContent.trim();
    }
    // Find CTA (the link itself)
    let cta = null;
    const link = cardEl.closest('a');
    if (link && link.href && link.getAttribute('aria-label')) {
      cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.getAttribute('aria-label');
    }
    // Compose text cell as a fragment
    const frag = document.createDocumentFragment();
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      frag.appendChild(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      frag.appendChild(p);
    }
    if (cta) {
      frag.appendChild(cta);
    }
    // Compose image cell
    let imageCell = img || '';
    return [imageCell, frag];
  }

  // Get all card items
  const cardItems = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards1)'];
  rows.push(headerRow);
  // Card rows
  cardItems.forEach(item => {
    let cardContent = item;
    if (item.querySelector('.d-teaser-box-wrapper')) {
      cardContent = item.querySelector('.d-teaser-box-wrapper');
    }
    if (cardContent) {
      rows.push(extractCard(cardContent));
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
