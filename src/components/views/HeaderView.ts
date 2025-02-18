import {
	HEADER_SELECTOR,
	BASKET_COUNTER_SELECTOR,
} from '../../utils/constants';

export class HeaderView {
	private rootElement: HTMLElement;
	private basketCounterElement: HTMLElement;

	constructor(selector: string = HEADER_SELECTOR) {
		const root = document.querySelector(selector);
		if (!root) {
			throw new Error(`HeaderView: не найден селектор "${selector}"`);
		}
		this.rootElement = root as HTMLElement;

		const counter = this.rootElement.querySelector(BASKET_COUNTER_SELECTOR);
		if (!counter) {
			throw new Error(
				`HeaderView: не найден такой селектор"${BASKET_COUNTER_SELECTOR}"`
			);
		}
		this.basketCounterElement = counter as HTMLElement;
	}

	renderCartCount(count: number): void {
		this.basketCounterElement.textContent = count.toString();
	}
}
