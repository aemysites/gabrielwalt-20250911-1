/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block requirements
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Find the main row containing the cards
  const cardRow = element.querySelector('.teaser__wrapper');
  if (!cardRow) {
    // Defensive: fallback, nothing to do
    return;
  }

  // Each card is an <a.teaser>
  const cards = cardRow.querySelectorAll(':scope > a.teaser');
  cards.forEach((card) => {
    // IMAGE CELL
    let imageEl = null;
    const picture = card.querySelector('.teaser__picture');
    if (picture) {
      // Use the <img> inside <picture>
      imageEl = picture.querySelector('img');
    }

    // TEXT CELL
    const textCellContent = [];
    // Title (h3)
    const title = card.querySelector('.teaser__title');
    if (title) {
      // Use a heading element
      textCellContent.push(title);
    }
    // Description (div.teaser__copy)
    const desc = card.querySelector('.teaser__copy');
    if (desc) {
      textCellContent.push(desc);
    }
    // CTA: If the whole card is a link, and it's not just a #, add a CTA at the bottom
    if (card.href && card.href !== '#' && card.title) {
      const cta = document.createElement('a');
      cta.href = card.href;
      cta.textContent = card.title;
      cta.target = card.target || '_self';
      textCellContent.push(cta);
    }

    rows.push([
      imageEl || '',
      textCellContent
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
