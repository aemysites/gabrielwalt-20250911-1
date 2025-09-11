/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main modal dialog content
  const dialogContent = element.querySelector('.p-dialog-content');
  if (!dialogContent) return;

  // Find the two main columns: image and content
  // Left column: image
  const imageContainer = dialogContent.querySelector('.d-entry-gate__image-container');
  // Right column: content
  const contentContainer = dialogContent.querySelector('.d-entry-gate__content-container');

  // Defensive: ensure both columns exist
  if (!imageContainer || !contentContainer) return;

  // Build the table rows
  const headerRow = ['Columns (columns8)'];
  const columnsRow = [imageContainer, contentContainer];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the new block
  element.replaceWith(table);
}
