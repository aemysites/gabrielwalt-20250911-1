/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from an .owl-item
  function extractCard(cardEl) {
    // Find image (mandatory)
    let img = cardEl.querySelector('img');
    // Defensive: if no img, try picture
    if (!img) {
      const pic = cardEl.querySelector('picture');
      if (pic) {
        img = pic.querySelector('img');
      }
    }

    // Find text content: title (h3), description (teaser__copy), and any other visible text
    const textContent = document.createElement('div');
    // Get all children of .teaser__content (title, description, etc)
    const content = cardEl.querySelector('.teaser__content');
    if (content) {
      Array.from(content.childNodes).forEach(node => {
        // Only append element nodes and text nodes with non-empty content
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textContent.appendChild(node.cloneNode(true));
        }
      });
    }
    // Optionally, add any extra visible text from aux-pos-top (date, label)
    const auxTop = cardEl.querySelector('.aux-pos-top');
    if (auxTop) {
      Array.from(auxTop.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textContent.appendChild(node.cloneNode(true));
        }
      });
    }
    // Optionally, add a link to the article at the bottom
    // If the card is an <a>, add its href as a CTA link
    if (cardEl.tagName === 'A' && cardEl.href) {
      const link = document.createElement('a');
      link.href = cardEl.href;
      link.textContent = 'Read more';
      textContent.appendChild(link);
    }
    return [img, textContent];
  }

  // Find all .owl-item elements (cards)
  const cards = Array.from(element.querySelectorAll('.owl-item'));
  const rows = cards.map(card => extractCard(card));

  // Add header row
  const headerRow = ['Cards (cards32)'];
  const tableRows = [
    headerRow,
    ...rows
  ];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace original element
  element.replaceWith(table);
}
