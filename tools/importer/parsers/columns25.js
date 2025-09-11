/* global WebImporter */
export default function parse(element, { document }) {
  // Find left column (content)
  const leftCol = element.querySelector('.teaser__aux-wrapper');
  // Find right column (image)
  const rightCol = element.querySelector('.teaser__media');

  // Defensive: fallback if wrappers not found
  const columns = [];
  if (leftCol) columns.push(leftCol);
  if (rightCol) columns.push(rightCol);
  if (columns.length < 2) {
    // fallback to direct children
    Array.from(element.children).forEach((child) => {
      if (!columns.includes(child)) columns.push(child);
    });
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns25)'];
  // Table body: one row, two columns
  const bodyRow = columns;

  // Create table
  const table = WebImporter.DOMUtils.createTable([headerRow, bodyRow], document);

  // Replace original element with table
  element.replaceWith(table);
}
