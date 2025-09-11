/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main container for the sitemap columns
  const sitemapContainer = element.querySelector('.d-footer-sitemap__container');
  if (!sitemapContainer) return;

  // Find logo column (first column)
  const logoCol = sitemapContainer.querySelector('.d-footer-sitemap__logo');

  // Find menu columns (remaining columns)
  const menuContainer = sitemapContainer.querySelector('.d-footer-sitemap__menu');
  let menuCols = [];
  if (menuContainer) {
    // Each menu__item is a column
    menuCols = Array.from(menuContainer.querySelectorAll(':scope > .d-footer-sitemap__menu__item'));
  }

  // Compose the columns for the second row
  // First column: logo
  // Next columns: each menu item
  const columns = [];
  if (logoCol) columns.push(logoCol);
  columns.push(...menuCols);

  // Table rows
  const headerRow = ['Columns (columns9)'];
  const contentRow = columns;

  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
