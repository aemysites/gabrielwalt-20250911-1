/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main modal dialog (content container)
  const modal = element.querySelector('.d-modal-dialog.d-entry-gate-modal__modal');
  if (!modal) return;

  // Find the main content split: image (left), content (right)
  const gate = modal.querySelector('.d-entry-gate');
  if (!gate) return;

  // Left column: image
  const imageContainer = gate.querySelector('.d-entry-gate__image-container');
  let leftCol = null;
  if (imageContainer) {
    // Use the picture element directly
    const picture = imageContainer.querySelector('picture');
    if (picture) {
      leftCol = picture;
    }
  }

  // Right column: heading, role selection, disclaimer, footer
  const contentContainer = gate.querySelector('.d-entry-gate__content-container');
  let rightColItems = [];
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.d-entry-gate__heading');
    if (heading) rightColItems.push(heading);

    // Decision (role selection)
    const decision = contentContainer.querySelector('.d-entry-gate__decision');
    if (decision) rightColItems.push(decision);

    // Disclaimer
    const disclaimer = contentContainer.querySelector('.d-entry-gate__disclaimer');
    if (disclaimer) rightColItems.push(disclaimer);
  }

  // Footer: Start page link and Accept & Continue button
  const footer = gate.querySelector('.d-entry-gate__footer');
  if (footer) {
    rightColItems.push(footer);
  }

  // Compose columns
  const columnsRow = [leftCol, rightColItems];

  // Table header
  const headerRow = ['Columns (columns34)'];

  // Build table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
