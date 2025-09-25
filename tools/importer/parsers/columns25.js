/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns25)'];

  // Defensive: find left (text) and right (image) columns
  let leftCol, rightCol;

  // Find the image (right column)
  // Look for .teaser__media or .teaser__picture
  rightCol = element.querySelector('.teaser__media, .teaser__picture');
  if (rightCol && rightCol.classList.contains('teaser__media')) {
    // Use the picture inside teaser__media
    const pic = rightCol.querySelector('picture');
    if (pic) rightCol = pic;
  }
  // If rightCol is still null, fallback to any <img>
  if (!rightCol) {
    rightCol = element.querySelector('img');
  }

  // Find the left column (content)
  // Look for .teaser__aux-wrapper or .teaser__content-wrapper
  leftCol = element.querySelector('.teaser__aux-wrapper, .teaser__content-wrapper');
  if (!leftCol) {
    // fallback: get the first div that is not the image
    const divs = Array.from(element.querySelectorAll(':scope > div'));
    leftCol = divs.find(div => !div.contains(rightCol));
  }
  // If still not found, fallback to the whole element
  if (!leftCol) leftCol = element;

  // The leftCol may contain extra wrappers; prefer the .teaser__content-wrapper if present
  const contentWrapper = leftCol.querySelector('.teaser__content-wrapper');
  if (contentWrapper) leftCol = contentWrapper;

  // Compose the columns row
  const columnsRow = [leftCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
