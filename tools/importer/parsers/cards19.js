/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  // Find all teaser cards
  const teasers = Array.from(element.querySelectorAll('a.teaser--facts-tiles'));
  teasers.forEach((teaser) => {
    // IMAGE: Use the <img> element directly
    const img = teaser.querySelector('img');
    // TEXT: Title from teaser, description from corresponding expandable section
    let title = teaser.querySelector('h3');
    let description = null;
    // Find corresponding expandable section by data-target
    const expandableId = teaser.getAttribute('data-target');
    if (expandableId && expandableId.startsWith('#')) {
      const section = element.querySelector(expandableId);
      if (section) {
        // First <p> inside section
        description = section.querySelector('p');
      }
    }
    // Compose text cell: title (as heading), then description
    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    // If no description, fallback to empty string
    if (textCell.length === 0) textCell.push('');
    // Add row: [image, text]
    rows.push([
      img || '',
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
