/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from card
  function getCardImage(card) {
    // Find the <img> inside <picture>
    const picture = card.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper to extract text content from card
  function getCardText(card) {
    // Title
    const title = card.querySelector('.d-base-card__title .d-base-heading');
    // Description
    const desc = card.querySelector('.d-base-card__content p');
    // Compose text cell
    const cellContent = [];
    if (title) cellContent.push(title);
    if (desc) cellContent.push(desc);
    return cellContent;
  }

  // Find all card items
  const sliderContent = element.querySelector('.d-new-base-slider__content');
  const items = sliderContent
    ? sliderContent.querySelectorAll('.d-new-base-slider__item')
    : [];

  // Table header
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Build rows for each card
  items.forEach((item) => {
    // Each item contains an <a> with the card
    const cardLink = item.querySelector('a');
    if (!cardLink) return;
    const card = cardLink.querySelector('.d-teaser-box-wrapper');
    if (!card) return;

    // Image cell
    const img = getCardImage(card);
    // Text cell
    const textContent = getCardText(card);

    // If there's a link, wrap the text cell in a link for CTA
    // But only if the link is not already wrapping the card
    // In this HTML, the link wraps the entire card, so we don't need a separate CTA
    rows.push([
      img || '',
      textContent.length ? textContent : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
