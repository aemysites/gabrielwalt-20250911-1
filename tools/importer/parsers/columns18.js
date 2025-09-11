/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main modal dialog content
  const dialogContent = element.querySelector('.p-dialog-content');
  if (!dialogContent) return;

  // Find the main entry gate block (contains all relevant content)
  const entryGate = dialogContent.querySelector('.d-entry-gate');
  if (!entryGate) return;

  // Left column: image
  const imageContainer = entryGate.querySelector('.d-entry-gate__image-container');

  // Right column: all content except the image
  const contentContainer = entryGate.querySelector('.d-entry-gate__content-container');
  if (!contentContainer) return;

  // We'll include the entire contentContainer as the right column cell
  // and the imageContainer as the left column cell

  // Table header
  const headerRow = ['Columns (columns18)'];

  // Table content row: [image, content]
  const contentRow = [imageContainer, contentContainer];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
