/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card element
  function extractCard(cardEl) {
    // Find image (mandatory)
    let img = cardEl.querySelector('img');
    // Defensive: fallback to picture if img not found
    if (!img) {
      const picture = cardEl.querySelector('picture');
      if (picture) img = picture;
    }

    // Find title (as heading)
    let title = null;
    const heading = cardEl.querySelector('.d-base-heading, [role="heading"]');
    if (heading) {
      // Use the heading element directly
      title = heading;
    }

    // Find description (paragraph)
    let desc = null;
    const descP = cardEl.querySelector('.d-base-card__content p, .d-teaser-box__text p, p');
    if (descP) {
      desc = descP;
    } else {
      // Sometimes description is in a span inside p
      const descSpan = cardEl.querySelector('.d-base-card__content span, .d-teaser-box__text span');
      if (descSpan) {
        // Wrap in a paragraph for consistency
        const p = document.createElement('p');
        p.append(descSpan);
        desc = p;
      }
    }

    // Compose text cell: title (heading), description (paragraph)
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);

    return [img, textCell];
  }

  // Get all cards (direct children with class d-teaser-boxes-stack__item)
  const cards = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));

  // Build table rows
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  cards.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
