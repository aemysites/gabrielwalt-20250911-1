/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Table header row as required
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Find all card links (each card is an <a> inside .teaser__wrapper)
  const teaserWrapper = element.querySelector('.teaser__wrapper');
  if (!teaserWrapper) return;
  const cardLinks = Array.from(teaserWrapper.querySelectorAll(':scope > a.teaser'));

  cardLinks.forEach((card) => {
    // --- IMAGE CELL ---
    // Find the image inside the card
    let imgEl = null;
    const picture = card.querySelector('.teaser__media picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
    // Defensive: If no image, skip this card
    if (!imgEl) return;

    // --- TEXT CELL ---
    const textCellContent = [];
    // Title (h3)
    const title = card.querySelector('.teaser__title');
    if (title) textCellContent.push(title);
    // Description (teaser__copy)
    const desc = card.querySelector('.teaser__copy');
    if (desc) textCellContent.push(desc);
    // Call-to-action: Use the card's link text, but only if not redundant
    // In this HTML, the link itself wraps the card, so no separate CTA
    // If needed, could add a link to card.href with card.title
    // But since the whole card is clickable, skip extra CTA

    rows.push([imgEl, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
