/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each .owl-item
  function extractCard(cardEl) {
    // The card is an <a> element
    const link = cardEl.querySelector('a');
    if (!link) return null;

    // Image: find the <img> inside .teaser__media
    const img = link.querySelector('.teaser__media img');

    // Title: <h3 class="teaser__title">
    const title = link.querySelector('.teaser__title');
    // Description: <div class="teaser__copy">
    const desc = link.querySelector('.teaser__copy');
    // Date and Label: <span class="label-grey label"> and <span class="label-dark label">
    const date = link.querySelector('.aux-pos-top .label-grey.label');
    const label = link.querySelector('.aux-pos-top .label-dark.label');

    // Compose the text cell
    const textCell = document.createElement('div');
    if (date) {
      const dateSpan = document.createElement('span');
      dateSpan.textContent = date.textContent;
      textCell.appendChild(dateSpan);
      textCell.appendChild(document.createElement('br'));
    }
    if (label) {
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label.textContent;
      textCell.appendChild(labelSpan);
      textCell.appendChild(document.createElement('br'));
    }
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent;
      textCell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.appendChild(p);
    }
    // Optionally add CTA link if needed
    // const cta = document.createElement('a');
    // cta.href = link.href;
    // cta.textContent = link.title || title?.textContent || 'Read more';
    // textCell.appendChild(cta);

    return [img, textCell];
  }

  // Find all .owl-item elements
  const cards = Array.from(element.querySelectorAll(':scope .owl-item'));
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards32)'];
  rows.push(headerRow);
  // Card rows
  cards.forEach(cardEl => {
    const cardRow = extractCard(cardEl);
    if (cardRow) rows.push(cardRow);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
