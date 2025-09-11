/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card
  function extractImage(card) {
    // Try to find the picture element
    const picture = card.querySelector('.d-base-card__header picture, picture');
    if (picture) return picture;
    // fallback: try to find img
    const img = card.querySelector('.d-base-card__header img, img');
    return img || null;
  }

  // Helper to extract the text content for the card
  function extractTextContent(card) {
    const frag = document.createDocumentFragment();

    // Date (optional, above title)
    const date = card.querySelector('.d-teaser-box__date, .d-base-card__date');
    if (date) {
      // Use the <span> inside the date, if present
      const dateSpan = date.querySelector('span');
      if (dateSpan) {
        frag.appendChild(dateSpan.cloneNode(true));
        frag.appendChild(document.createElement('br'));
      }
    }

    // Tag (optional, top right)
    const tag = card.querySelector('.d-base-tag-list, .d-teaser-box__tags');
    if (tag) {
      // Only take the first tag if multiple
      const tagItem = tag.querySelector('.d-base-tag');
      if (tagItem) {
        frag.appendChild(tagItem.cloneNode(true));
        frag.appendChild(document.createElement('br'));
      }
    }

    // Title (mandatory)
    const title = card.querySelector('.d-teaser-box__heading, .d-base-heading--h3');
    if (title) {
      // Use <strong> for heading
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }

    // Description (optional)
    const desc = card.querySelector('.d-base-card__content, .d-teaser-box__text');
    if (desc) {
      // Use only the text content, skip nested tags
      frag.appendChild(document.createTextNode(desc.textContent.trim()));
    }

    return frag;
  }

  // Find all card items (direct children)
  const cardItems = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));

  // Build rows: header first, then one row per card
  const rows = [];
  rows.push(['Cards (cards4)']);

  cardItems.forEach((item) => {
    // The card is inside an <a> (link) inside the item
    const link = item.querySelector('a');
    const card = link ? link : item;
    // Image cell
    const image = extractImage(card);
    // Text cell
    const textContent = extractTextContent(card);
    // Compose row
    rows.push([
      image ? image : '',
      textContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
