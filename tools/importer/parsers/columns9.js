/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container for the footer sitemap columns
  const container = element.querySelector('.d-footer-sitemap__container');
  if (!container) return;

  // Get the logo (first column)
  const logoDiv = container.querySelector('.d-footer-sitemap__logo');

  // Get all menu columns (second, third, fourth columns)
  const menuDiv = container.querySelector('.d-footer-sitemap__menu');
  let menuItems = [];
  if (menuDiv) {
    menuItems = Array.from(menuDiv.querySelectorAll(':scope > .d-footer-sitemap__menu__item'));
  }

  // Build the columns row: logo, then each menu column
  const columnsRow = [logoDiv, ...menuItems];

  // Compose the table rows
  const headerRow = ['Columns (columns9)'];
  const tableRows = [headerRow, columnsRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
