/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find all immediate .owl-item children (each is a column)
  const owlWrapper = element.querySelector('.owl-wrapper');
  if (!owlWrapper) return;
  const items = Array.from(owlWrapper.children).filter(child => child.classList.contains('owl-item'));
  if (!items.length) return;

  // For each .owl-item, grab its main content block (the .teaser inside)
  const columns = items.map(item => {
    // Defensive: find the .teaser inside the .owl-item
    const teaser = item.querySelector('.teaser');
    if (!teaser) return '';
    return teaser;
  });

  // Build the table: header row, then a row with each column's content
  const headerRow = ['Columns (columns28)'];
  const contentRow = columns;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
