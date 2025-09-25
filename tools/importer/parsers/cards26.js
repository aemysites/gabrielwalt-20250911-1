/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from card
  function extractImage(card) {
    // Find <img> inside <picture> inside card
    const img = card.querySelector('picture img');
    if (img && img.getAttribute('data-src')) {
      // Use data-src if available
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    return img || null;
  }

  // Helper to extract text content from card
  function extractText(card) {
    const textContent = document.createElement('div');
    // Date (optional)
    const date = card.querySelector('.d-teaser-box__date span');
    if (date) {
      const dateP = document.createElement('p');
      dateP.append(date.cloneNode(true));
      textContent.appendChild(dateP);
    }
    // Tag (optional)
    const tag = card.querySelector('.d-base-tag--label');
    if (tag) {
      const tagSpan = document.createElement('span');
      tagSpan.append(tag.cloneNode(true));
      textContent.appendChild(tagSpan);
    }
    // Title (mandatory)
    const title = card.querySelector('.d-teaser-box__heading span');
    if (title) {
      const h3 = document.createElement('h3');
      h3.append(title.cloneNode(true));
      textContent.appendChild(h3);
    }
    // Description (optional)
    const desc = card.querySelector('.d-teaser-box__text span');
    if (desc) {
      const descP = document.createElement('p');
      descP.append(desc.cloneNode(true));
      textContent.appendChild(descP);
    }
    // Call-to-action (optional, use the card link if present)
    const link = card.closest('a');
    if (link && link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.getAttribute('aria-label') || link.textContent.trim();
      cta.target = link.target || '_self';
      textContent.appendChild(cta);
    }
    return textContent;
  }

  // Find all card items
  const itemsContainer = element.querySelector('.d-new-base-slider__items');
  const cardItems = itemsContainer ? Array.from(itemsContainer.children) : [];

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards26)']);

  // Each card: image/icon | text content
  cardItems.forEach(item => {
    // Defensive: find the teaser box
    const teaserBox = item.querySelector('.d-teaser-box');
    if (!teaserBox) return;
    // Image
    const img = extractImage(teaserBox);
    // Text content
    const text = extractText(teaserBox);
    rows.push([img, text]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
