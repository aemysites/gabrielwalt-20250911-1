/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // First column: left content (intro, heading, dropdown)
  const leftCol = columns[0];
  // Second column: right content (links)
  const rightCol = columns[1];

  // Defensive: gather left column content
  const leftContent = [];
  // Get all paragraphs and headings in leftCol
  leftCol.querySelectorAll(':scope > p, :scope > h3').forEach((el) => {
    // Only add non-empty elements
    if (el.textContent.trim() || el.querySelector('img')) {
      leftContent.push(el);
    }
  });
  // Get dropdown (location selector)
  const dropdown = leftCol.querySelector(':scope > .d-dws-dropdown');
  if (dropdown) {
    leftContent.push(dropdown);
  }

  // Defensive: gather right column content
  const rightContent = [];
  // Find all .d-link-list containers
  rightCol.querySelectorAll(':scope > .d-link-list').forEach((list) => {
    // Find all links inside each list
    list.querySelectorAll('a').forEach((a) => {
      rightContent.push(a);
    });
  });

  // Table header
  const headerRow = ['Columns (columns37)'];
  // Table columns row
  const columnsRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
