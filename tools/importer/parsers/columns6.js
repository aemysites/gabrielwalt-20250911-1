/* global WebImporter */
export default function parse(element, { document }) {
  // Find all person cards
  const personCards = Array.from(element.querySelectorAll('.d-person-card'));

  // Exclude the first card
  const visibleCards = personCards.slice(1);

  // For each card, extract the image and text content
  const columnsRow = visibleCards.map(card => {
    const cell = document.createElement('div');
    // Get image
    const img = card.querySelector('picture');
    if (img) cell.appendChild(img.cloneNode(true));
    // Get name (first p)
    const nameP = card.querySelector('p.d-base-text--font-dws-slab-bold');
    if (nameP) cell.appendChild(nameP.cloneNode(true));
    // Get title (second p)
    const titleP = card.querySelector('p.d-base-text--font-dws-slab:not(.d-base-text--font-dws-slab-bold)');
    if (titleP) cell.appendChild(titleP.cloneNode(true));
    return cell;
  });

  // Table header row as per block guidelines
  const headerRow = ['Columns (columns6)'];

  // Build table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
