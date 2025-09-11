/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card root element
  function extractCard(cardEl) {
    // Find the image (first picture or img)
    let imageEl = null;
    const header = cardEl.querySelector('.d-base-card__header');
    if (header) {
      imageEl = header.querySelector('picture, img');
      // If picture, use the picture; if img, use img
      if (imageEl && imageEl.tagName === 'PICTURE') {
        // Use the picture element as-is
      } else if (imageEl && imageEl.tagName === 'IMG') {
        // Use the img element as-is
      } else {
        imageEl = null;
      }
    }

    // Find the title (heading)
    let titleEl = null;
    const titleWrap = cardEl.querySelector('.d-base-card__title');
    if (titleWrap) {
      titleEl = titleWrap.querySelector('[role="heading"], h2, h3, h4, h5, h6');
    }

    // Find the description (paragraph)
    let descEl = null;
    const contentWrap = cardEl.querySelector('.d-base-card__content');
    if (contentWrap) {
      descEl = contentWrap.querySelector('p');
    }

    // Compose the text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    return [imageEl, textCell];
  }

  // Get all card items (direct children with class d-teaser-boxes-stack__item)
  const cardItems = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));

  // Build rows
  const rows = cardItems.map(item => {
    // The card is inside the <a> tag
    const link = item.querySelector('a');
    let cardRoot = null;
    if (link) {
      // The card root is the .d-base-card inside the link
      cardRoot = link.querySelector('.d-base-card');
    }
    if (!cardRoot) return [null, null];
    return extractCard(cardRoot);
  });

  // Table header
  const headerRow = ['Cards (cards17)'];
  const tableRows = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
