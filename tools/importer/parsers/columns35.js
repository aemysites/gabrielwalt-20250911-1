/* global WebImporter */
export default function parse(element, { document }) {
  // Find the key facts items container
  const itemsWrap = element.querySelector('.d-key-facts__items');
  let columns = [];
  if (itemsWrap) {
    // Get all direct children that are key facts items
    const items = Array.from(itemsWrap.children).filter(child => child.classList.contains('d-key-facts-item'));
    columns = items.map(item => item); // Reference, do not clone
  }

  // Always use the required block header
  const headerRow = ['Columns (columns35)'];
  // The second row: one cell per column, referencing the original DOM elements
  const contentRow = columns.length ? columns : [''];

  // Compose the table rows
  const tableRows = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
