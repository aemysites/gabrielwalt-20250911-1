/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the img from a <picture>
  function getPictureImg(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Helper to extract text content (title, description, CTA) from teaser__cover
  function getTextContent(teaserCover) {
    if (!teaserCover) return null;
    const content = [];
    // Title
    const title = teaserCover.querySelector('.teaser__title-cover');
    if (title) {
      // Use heading element directly
      content.push(title);
    }
    // Description (optional)
    const copyCover = teaserCover.querySelector('.teaser__copy-cover');
    if (copyCover) {
      // Paragraphs
      copyCover.querySelectorAll('p').forEach((p) => {
        content.push(p);
      });
      // CTA (button link)
      copyCover.querySelectorAll('a').forEach((a) => {
        content.push(a);
      });
    }
    return content.length ? content : null;
  }

  // Get all direct children with class 'teaser'
  const teasers = Array.from(element.querySelectorAll(':scope > .teaser'));
  // Defensive: also include the first teaser if it has 'active' class
  if (teasers.length === 0) {
    // fallback: look for all direct children divs with class 'teaser' or 'teaser active'
    teasers.push(...Array.from(element.querySelectorAll(':scope > div')).filter(div => div.classList.contains('teaser')));
  }

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel21)'];
  rows.push(headerRow);

  teasers.forEach((teaser) => {
    // Image cell
    const media = teaser.querySelector('.teaser__media');
    let img = null;
    if (media) {
      const picture = media.querySelector('picture');
      img = getPictureImg(picture);
    }
    // Defensive: if no img found, leave cell empty
    const imageCell = img ? img : '';

    // Text cell
    let textCell = '';
    if (media) {
      const teaserCover = media.querySelector('.teaser__cover');
      const content = getTextContent(teaserCover);
      if (content && content.length) {
        textCell = content;
      }
    }
    rows.push([imageCell, textCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
