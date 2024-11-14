import { JSDOM } from 'jsdom';
import { NOT_FOUND_TEXT } from '../constants/not-found-text.constant';

export function extractMaterialText(document: Document): string {
	const accordionPanel = document.getElementsByClassName('accordion-panel')[1];
	const paragraphs = accordionPanel?.getElementsByTagName('p');
	const lastParagraph = paragraphs && (Array.from(paragraphs).at(-1) as HTMLElement);
	return lastParagraph?.textContent || NOT_FOUND_TEXT;
}

export function extractStyleModel(document: Document): string | undefined {
	const styleElement = document.getElementsByClassName('style')[0] as HTMLElement;
	return styleElement?.textContent?.split('Style ').at(-1);
}

export async function createDOM(html: string): Promise<Document> {
	const { window } = new JSDOM(html);
	return window.document;
}
