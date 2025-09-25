/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from each .d-teaser-boxes-stack__item
  function extractCardContent(cardEl) {
    // Find the link (CTA) if present
    const link = cardEl.querySelector('a');
    // Find the card body
    const cardBody = link ? link.querySelector('.d-base-card__body') : null;
    // Defensive: If no cardBody, fallback to link
    const contentContainer = cardBody || link || cardEl;

    // Title
    let titleDiv = contentContainer.querySelector('.d-teaser-box__heading');
    let title = null;
    if (titleDiv) {
      // Use heading element directly, but remove id/role/aria attributes for cleanliness
      title = titleDiv.cloneNode(true);
      title.removeAttribute('id');
      title.removeAttribute('role');
      title.removeAttribute('aria-level');
    }

    // Description
    let description = null;
    const descDiv = contentContainer.querySelector('.d-base-card__content .d-teaser-box__text');
    if (descDiv) {
      description = descDiv.cloneNode(true);
    }

    // Date
    let date = null;
    const dateSpan = contentContainer.querySelector('.d-teaser-box__date span');
    if (dateSpan) {
      date = document.createElement('div');
      date.appendChild(dateSpan.cloneNode(true));
    }

    // Tag (e.g., Press)
    let tag = null;
    const tagSpan = contentContainer.querySelector('.d-base-tag--label');
    if (tagSpan) {
      tag = document.createElement('div');
      tag.appendChild(tagSpan.cloneNode(true));
    }

    // Compose card cell content in order: date, tag, title, description, CTA
    const cellContent = [];
    if (date) cellContent.push(date);
    if (tag) cellContent.push(tag);
    if (title) cellContent.push(title);
    if (description) cellContent.push(description);
    // CTA: Use the link itself, but only if it has an href and text
    if (link && link.href) {
      // Create a CTA link at the bottom, using the heading text as link text
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = title ? title.textContent.trim() : link.textContent.trim();
      cta.setAttribute('target', link.getAttribute('target') || '_self');
      cta.setAttribute('rel', link.getAttribute('rel') || 'noopener noreferrer');
      cellContent.push(cta);
    }
    return [cellContent]; // Single column
  }

  // Get all cards
  const cardEls = Array.from(element.querySelectorAll(':scope > .d-teaser-boxes-stack__item'));
  // Table header
  const headerRow = ['Cards (cardsNoImages36)'];
  // Build table rows
  const rows = [headerRow];
  cardEls.forEach(cardEl => {
    rows.push(extractCardContent(cardEl));
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
