/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cardsNoImages36)'];
  const rows = [headerRow];

  // Get all card items (direct children)
  const cardItems = element.querySelectorAll(':scope > div');

  cardItems.forEach((cardItem) => {
    // Defensive: find the anchor (the card link)
    const link = cardItem.querySelector('a');
    // Defensive: find the card body
    const cardBody = link ? link.querySelector('.d-base-card__body') : null;
    if (!cardBody) return;

    // --- Extract date ---
    let dateElem = cardBody.querySelector('.d-teaser-box__date span');
    // --- Extract tags (optional) ---
    let tagElem = cardBody.querySelector('.d-teaser-box__tags .d-base-tag');
    // --- Extract heading ---
    let headingElem = cardBody.querySelector('.d-teaser-box__heading');
    // --- Extract description (optional) ---
    let descElem = cardBody.querySelector('.d-base-card__content .d-teaser-box__text');

    // Compose cell content
    const cellContent = [];

    // Date (if present)
    if (dateElem) {
      // Wrap in <div> for semantic separation
      const dateDiv = document.createElement('div');
      dateDiv.appendChild(dateElem.cloneNode(true));
      cellContent.push(dateDiv);
    }

    // Tag (if present)
    if (tagElem) {
      // Wrap in <div> for semantic separation
      const tagDiv = document.createElement('div');
      tagDiv.appendChild(tagElem.cloneNode(true));
      cellContent.push(tagDiv);
    }

    // Heading (if present)
    if (headingElem) {
      // Use the heading element directly
      cellContent.push(headingElem.cloneNode(true));
    }

    // Description (if present)
    if (descElem) {
      cellContent.push(descElem.cloneNode(true));
    }

    // Compose row: single cell with all content
    rows.push([cellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
