export function getButton(selector: string): HTMLButtonElement {
  return document.querySelector(selector)!;
}

export function getButtons(selector: string): HTMLButtonElement[] {
  return document.querySelectorAll(selector) as any;
}

export function getInput(selector: string): HTMLInputElement {
  return document.querySelector(selector)!;
}

export function getParagraph(selector: string): HTMLParagraphElement {
  return document.querySelector(selector)!;
}

export function getParagraphs(selector: string): HTMLParagraphElement[] {
  return document.querySelectorAll(selector) as any;
}

export function getSpan(selector: string): HTMLSpanElement {
  return document.querySelector(selector) as any;
}

export function getList(selector: string): HTMLUListElement {
  return document.querySelector(selector) as any;
}

export function getDiv(selector: string): HTMLDivElement {
  return document.querySelector(selector) as any;
}

export function getImg(selector: string): HTMLImageElement {
  return document.querySelector(selector) as any;
}

export function createElement({tag, textContent, className, children}: {tag: string, textContent?: string, className?: string, children?: HTMLElement[]}) {
  const entry = document.createElement(tag);
  entry.className = className ?? '';
  entry.textContent = textContent ?? '';
  if (children) {
    for(const c of children) {
      entry.appendChild(c);
    }
  }

  return entry;
}

export function activate(section: string) {
  const allSections = document.querySelectorAll('section');
  for(const s of allSections) {
    if (s.id === section) {
      s.className = 'show';
    }
    else {
      s.className = 'hide';
    }
  }
}

export function CardToImageUrl(type: string, color: string) {
  let cardFileName = '';
  switch(type) {
      case "Zero":
        cardFileName = "0";
        break;
      case "One":
        cardFileName = "1";
        break;
      case "Two":
        cardFileName = "2";
        break;
      case "Three":
        cardFileName = "3";
        break;
      case "Four":
        cardFileName = "4";
        break;
      case "Five":
        cardFileName = "5";
        break;
      case "Six":
        cardFileName = "6";
        break;
      case "Seven":
        cardFileName = "7";
        break;
      case "Eight":
        cardFileName = "8";
        break;
      case "Nine":
        cardFileName = "9";
        break;
      case "Skip":
        cardFileName = "lock";
        break;
      case "Reverse":
        cardFileName = "switch";
        break;
      case "DrawTwo":
        cardFileName = "+2";
        break;
      case "Wild":
        cardFileName = "color";
        break;
      case "WildDrawFour":
        cardFileName = "+4";
        break;
  }

  return `https://cddataexchange.blob.core.windows.net/images/unno/${color.toLowerCase()}-${cardFileName}.png`;
}
