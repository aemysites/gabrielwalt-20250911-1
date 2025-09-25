/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all person cards within the block
  const personCards = Array.from(
    element.querySelectorAll('.d-person-card-block > .d-person-card')
  );

  // Defensive: If no person cards found, fallback to all .d-person-card
  const cards = personCards.length ? personCards : Array.from(element.querySelectorAll('.d-person-card'));

  // 2. Build header row as required by block spec
  const headerRow = ['Columns (columns6)'];

  // 3. Build content row: each cell is a reference to the original person card element
  const contentRow = cards.map(card => card);

  // 4. Table data: header row, then content row
  const tableRows = [headerRow, contentRow];

  // 5. Create the block table using DOMUtils
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // 6. Replace the original element with the block table
  element.replaceWith(blockTable);
}
