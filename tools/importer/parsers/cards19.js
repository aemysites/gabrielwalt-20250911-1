/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const rows = [];
  rows.push(['Cards (cards19)']);

  // Find all card links
  const cardLinks = element.querySelectorAll('a.teaser--facts-tiles');

  cardLinks.forEach(cardLink => {
    // Get the image (first cell)
    let imgEl = null;
    const mediaDiv = cardLink.querySelector('.teaser__media');
    if (mediaDiv) {
      imgEl = mediaDiv.querySelector('img');
    }

    // Get the title (h3)
    let titleEl = null;
    const title = cardLink.querySelector('.teaser__title');
    if (title) {
      titleEl = title;
    }

    // Get the expandable content (description)
    let descEl = null;
    // Find the corresponding expandable section by data-target
    const targetId = cardLink.getAttribute('data-target');
    if (targetId) {
      const section = element.querySelector(`${targetId} section.expandable-teaser--content`);
      if (!section) {
        // fallback: try just by id
        const fallbackSection = element.querySelector(`${targetId}`);
        if (fallbackSection) {
          descEl = fallbackSection.querySelector('p');
        }
      } else {
        descEl = section.querySelector('p');
      }
    }
    // If not found, try next sibling
    if (!descEl) {
      const nextDiv = cardLink.nextElementSibling;
      if (nextDiv) {
        const section = nextDiv.querySelector('section.expandable-teaser--content');
        if (section) {
          descEl = section.querySelector('p');
        }
      }
    }

    // Compose the text cell: title (as heading) + description (if present)
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Add the row: [image, text cell]
    rows.push([
      imgEl || '',
      textCell.length > 0 ? textCell : '',
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
