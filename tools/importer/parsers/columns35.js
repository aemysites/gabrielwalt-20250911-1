/* global WebImporter */
export default function parse(element, { document }) {
  // Find the key facts block
  const itemsWrap = element.querySelector('.d-key-facts__items');
  if (!itemsWrap) return;
  const items = Array.from(itemsWrap.querySelectorAll('.d-key-facts-item'));
  if (!items.length) return;

  // Each item becomes a column: extract the content div (preserves icons, headings, text)
  const columns = items.map(item => {
    const content = item.querySelector('.d-key-facts-item__content');
    // Defensive: if missing, fallback to empty cell
    return content ? content : document.createElement('div');
  });

  // Build the table
  const headerRow = ['Columns (columns35)'];
  const columnsRow = columns;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
