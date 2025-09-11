/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main entry gate block
  const entryGate = element.querySelector('.d-entry-gate');
  if (!entryGate) return;

  // --- LEFT COLUMN ---
  // Find the image container (contains <picture> with <img>)
  const imageContainer = entryGate.querySelector('.d-entry-gate__image-container');
  // Defensive: Use the whole image container if present
  const leftCol = imageContainer || document.createElement('div');

  // --- RIGHT COLUMN ---
  // Find the content container
  const contentContainer = entryGate.querySelector('.d-entry-gate__content-container');
  // Defensive: Use the whole content container if present
  const rightCol = contentContainer || document.createElement('div');

  // --- FOOTER ROW ---
  // Find the footer (contains link and button)
  const footer = entryGate.querySelector('.d-entry-gate__footer');
  // Defensive: Use the whole footer if present
  const footerRow = [footer || document.createElement('div')]; // Only one column, no empty column

  // --- TABLE STRUCTURE ---
  // Header row
  const headerRow = ['Columns (columns34)'];
  // Content row: left (image), right (content)
  const contentRow = [leftCol, rightCol];

  // Build the table
  const cells = [
    headerRow,
    contentRow,
    footerRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
