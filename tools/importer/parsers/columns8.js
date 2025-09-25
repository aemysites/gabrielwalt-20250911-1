/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the modal dialog content root
  const dialogContent = element.querySelector('.p-dialog-content');
  if (!dialogContent) return;

  // Find the main entry gate content container
  const entryGate = dialogContent.querySelector('.d-entry-gate');
  if (!entryGate) return;

  // Left column: image
  const imageContainer = entryGate.querySelector('.d-entry-gate__image-container');
  let imageEl = null;
  if (imageContainer) {
    const pic = imageContainer.querySelector('picture');
    if (pic) {
      imageEl = pic.querySelector('img'); // reference existing image element
    }
  }

  // Right column: content
  const contentContainer = entryGate.querySelector('.d-entry-gate__content-container');
  const rightColContent = document.createElement('div');
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.d-entry-gate__heading');
    if (heading) rightColContent.appendChild(heading);
    // Decision section (location/role selectors)
    const decision = contentContainer.querySelector('.d-entry-gate__decision');
    if (decision) rightColContent.appendChild(decision);
    // Disclaimer
    const disclaimer = contentContainer.querySelector('.d-entry-gate__disclaimer');
    if (disclaimer) rightColContent.appendChild(disclaimer);
  }
  // Footer (start page link + accept button)
  const footer = entryGate.querySelector('.d-entry-gate__footer');
  if (footer) rightColContent.appendChild(footer);

  // Compose the table rows
  const headerRow = ['Columns (columns8)'];
  const columnsRow = [imageEl ? imageEl : '', rightColContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
