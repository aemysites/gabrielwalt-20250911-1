/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each .d-teaser-boxes-stack__item
  function extractCard(cardItem) {
    // Find the anchor
    const anchor = cardItem.querySelector('a');
    // Find the card wrapper
    const cardWrapper = anchor && anchor.querySelector('.d-teaser-box-wrapper');
    // Find the card
    const card = cardWrapper && cardWrapper.querySelector('.d-base-card');
    if (!card) return null;

    // Image: get <img> inside .d-base-card__header
    let img = null;
    const header = card.querySelector('.d-base-card__header');
    if (header) {
      const picture = header.querySelector('picture');
      if (picture) {
        img = picture.querySelector('img');
      }
    }

    // Text content cell
    const textContent = document.createElement('div');
    // Instead of picking individual elements, clone the whole .d-base-card__body and .d-base-card__content
    const body = card.querySelector('.d-base-card__body');
    if (body) {
      textContent.appendChild(body.cloneNode(true));
    }
    const content = card.querySelector('.d-base-card__content');
    if (content) {
      textContent.appendChild(content.cloneNode(true));
    }
    // CTA: use the anchor itself as CTA if present
    if (anchor && anchor.href) {
      const cta = document.createElement('a');
      cta.href = anchor.href;
      cta.textContent = anchor.getAttribute('aria-label') || anchor.textContent.trim();
      cta.target = anchor.target || '_self';
      cta.rel = anchor.rel || 'noopener noreferrer';
      textContent.appendChild(cta);
    }

    // Compose row: [image, textContent]
    return [img, textContent];
  }

  // Get all card items
  const cardItems = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));
  const rows = cardItems.map(extractCard).filter(Boolean);

  // Table header
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
