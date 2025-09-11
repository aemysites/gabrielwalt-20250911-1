/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card
  function extractImage(card) {
    // Try to find a <picture> first
    let picture = card.querySelector('.d-base-card__header picture');
    if (picture) return picture;
    // Fallback: find an <img>
    let img = card.querySelector('.d-base-card__header img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content (title, date, tag, description, etc.)
  function extractTextContent(card) {
    const fragment = document.createDocumentFragment();

    // Date (optional)
    const date = card.querySelector('.d-teaser-box__date');
    if (date) {
      fragment.appendChild(date.cloneNode(true));
    }

    // Tag (optional)
    const tag = card.querySelector('.d-base-tag-list');
    if (tag) {
      fragment.appendChild(tag.cloneNode(true));
    }

    // Title (mandatory)
    const title = card.querySelector('.d-teaser-box__heading');
    if (title) {
      // Use <strong> for heading semantics if not already present
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      fragment.appendChild(strong);
      fragment.appendChild(document.createElement('br'));
    }

    // Description (optional)
    const desc = card.querySelector('.d-base-card__content');
    if (desc) {
      fragment.appendChild(desc.cloneNode(true));
    }

    // No explicit CTA in this HTML, but if there is a link, add it
    // (In this HTML, the entire card is a link, so we skip adding a CTA)
    return fragment;
  }

  // Find all card links (each card is an <a> inside .d-new-base-slider__item)
  const cardItems = element.querySelectorAll('.d-new-base-slider__item');
  const rows = [];
  const headerRow = ['Cards (cards26)'];
  rows.push(headerRow);

  cardItems.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;
    const card = link.querySelector('.d-base-card');
    if (!card) return;

    // First cell: image
    const image = extractImage(card);
    // Second cell: text content
    const textContent = extractTextContent(card);

    // Wrap image in a link to preserve clickability (if needed)
    let imageCell = image;
    if (image && link.href) {
      const imageLink = document.createElement('a');
      imageLink.href = link.href;
      imageLink.appendChild(image.cloneNode(true));
      imageCell = imageLink;
    }

    // Second cell: text content, optionally wrap in a link
    let textCell = textContent;
    if (link.href) {
      const textLink = document.createElement('a');
      textLink.href = link.href;
      textLink.appendChild(textContent);
      textCell = textLink;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
