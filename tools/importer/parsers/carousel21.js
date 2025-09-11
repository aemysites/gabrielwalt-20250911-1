/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the best image from a <picture>
  function getImageFromPicture(picture) {
    if (!picture) return null;
    // Try to find <img> inside <picture>
    const img = picture.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content block from .teaser__cover
  function getTextContent(teaserCover) {
    if (!teaserCover) return null;
    // We'll collect title, description, and CTA
    const content = [];
    // Title
    const title = teaserCover.querySelector('.teaser__title-cover');
    if (title) {
      // Convert h3 to h2 for block consistency
      const h2 = document.createElement('h2');
      h2.innerHTML = title.innerHTML;
      content.push(h2);
    }
    // Description (optional)
    const copyCover = teaserCover.querySelector('.teaser__copy-cover');
    if (copyCover) {
      // Find <p> inside copyCover
      const desc = copyCover.querySelector('p');
      if (desc) {
        content.push(desc);
      }
      // Find CTA <a> inside copyCover
      const cta = copyCover.querySelector('a');
      if (cta) {
        content.push(cta);
      }
    } else {
      // Sometimes CTA is present without description
      const cta = teaserCover.querySelector('a');
      if (cta) {
        content.push(cta);
      }
    }
    return content.length ? content : null;
  }

  // Get all direct children with class 'teaser'
  const teasers = Array.from(element.querySelectorAll(':scope > .teaser'));

  // Defensive: If no teasers, try to find any .teaser inside
  if (teasers.length === 0) {
    teasers.push(...element.querySelectorAll('.teaser'));
  }

  // Table header
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];

  // For each teaser, build a row: [image, text content]
  teasers.forEach(teaser => {
    // Find .teaser__media
    const media = teaser.querySelector('.teaser__media');
    let imageEl = null;
    if (media) {
      const picture = media.querySelector('picture');
      imageEl = getImageFromPicture(picture);
    }
    // Defensive: If no image, leave cell empty
    const imageCell = imageEl ? imageEl : '';

    // Find .teaser__cover
    const cover = teaser.querySelector('.teaser__cover');
    const textContent = getTextContent(cover);
    const textCell = textContent ? textContent : '';

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
