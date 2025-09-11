/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get image from card header (img in picture, or video poster)
  function getImageFromHeader(header) {
    if (!header) return '';
    const picture = header.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) return img;
    }
    const img = header.querySelector('img');
    if (img) return img;
    const video = header.querySelector('video');
    if (video && video.poster) {
      const posterImg = document.createElement('img');
      posterImg.src = video.poster;
      posterImg.alt = '';
      return posterImg;
    }
    return '';
  }

  // Helper: get all text content from card (date, title, description, tags, duration)
  function getTextContent(card) {
    const cell = document.createElement('div');
    // Date
    const date = card.querySelector('.d-teaser-box__date');
    if (date) cell.appendChild(date.cloneNode(true));
    // Title
    const title = card.querySelector('.d-teaser-box__heading');
    if (title) cell.appendChild(title.cloneNode(true));
    // Description
    const desc = card.querySelector('.d-teaser-box__text');
    if (desc) cell.appendChild(desc.cloneNode(true));
    // 'now running' tag
    const nowRunning = card.querySelector('.d-base-tag--grey-blue-009');
    if (nowRunning) cell.appendChild(nowRunning.cloneNode(true));
    // Duration
    const duration = card.querySelector('.d-base-tag--label');
    if (duration) cell.appendChild(duration.cloneNode(true));
    return cell.childNodes.length ? cell : '';
  }

  // Find main card (large card)
  const mainCard = element.querySelector('.d-single-video-module .d-teaser-box');
  const mainCardHeader = mainCard ? mainCard.querySelector('.d-base-card__header') : null;

  // Find stacked cards (side cards)
  const stack = element.querySelector('.d-video-module__stack');
  let stackedCards = [];
  if (stack) {
    stackedCards = Array.from(stack.querySelectorAll('.d-base-card'));
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards20)']);

  // Main card row
  if (mainCard && mainCardHeader) {
    const img = getImageFromHeader(mainCardHeader);
    const textCell = getTextContent(mainCard);
    rows.push([
      img ? img.cloneNode(true) : '',
      textCell
    ]);
  }

  // Side cards rows
  stackedCards.forEach(card => {
    const header = card.querySelector('.d-base-card__header');
    const img = getImageFromHeader(header);
    const textCell = getTextContent(card);
    rows.push([
      img ? img.cloneNode(true) : '',
      textCell
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
