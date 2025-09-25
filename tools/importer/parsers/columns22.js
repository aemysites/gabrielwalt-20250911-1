/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content container
  const container = element.querySelector('.d-footer-top__container');
  if (!container) return;

  // Find left and right sections
  const leftSection = container.querySelector('.d-footer-top__culture-switch');
  const rightSection = container.querySelector('.d-footer-top__right-section');

  // Defensive: If either section is missing, don't proceed
  if (!leftSection || !rightSection) return;

  // The left column: Language/Culture switch
  // The right column: Contact, Newsletter, Social Media

  // Compose left cell
  // Use the entire leftSection for resilience
  const leftCell = leftSection;

  // Compose right cell
  // We'll combine all rightSection content into one cell
  const rightCell = rightSection;

  // Build table rows
  const headerRow = ['Columns (columns22)'];
  const contentRow = [leftCell, rightCell];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
