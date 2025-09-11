/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card root element
  function extractCard(card) {
    // Find the image (always in <picture> inside .d-base-card__header)
    let imgEl = null;
    const header = card.querySelector('.d-base-card__header picture');
    if (header) {
      imgEl = header.querySelector('img');
    }

    // Find the title (inside .d-base-card__title)
    let titleEl = null;
    const titleWrap = card.querySelector('.d-base-card__title');
    if (titleWrap) {
      // The heading is usually a div with role=heading, inside .d-base-card__title
      const heading = titleWrap.querySelector('[role="heading"]');
      if (heading) {
        titleEl = heading;
      }
    }

    // Find the description (inside .d-base-card__content)
    let descEl = null;
    const content = card.querySelector('.d-base-card__content');
    if (content) {
      // Usually a <p> or <span> inside
      const p = content.querySelector('p, span');
      if (p) {
        descEl = p;
      }
    }

    // Compose text cell: title (strong), then description (if present)
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    return [imgEl, textCell];
  }

  // Get all card items (direct children with .d-teaser-boxes-stack__item)
  const cards = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));

  // Build table rows
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  cards.forEach(cardItem => {
    // The card content is inside an <a> (the first child)
    const link = cardItem.querySelector('a');
    if (!link) return; // Defensive: skip if no link
    // The card visual is inside .d-base-card
    const card = link.querySelector('.d-base-card');
    if (!card) return;
    const [imgEl, textCell] = extractCard(card);
    // Only add if both image and text are present
    if (imgEl && textCell.length) {
      rows.push([imgEl, textCell]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
