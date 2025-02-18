/**
 * API и CDN URL
 */
export const API_URL: string = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL: string = `${process.env.API_ORIGIN}/content/weblarek`;

/**
 * Константы для модальных окон
 */
export const MODAL_CONTAINER_ID: string = '#modal-container';
export const MODAL_CLASS: string = '.modal';
export const MODAL_ACTIVE_CLASS: string = 'modal_active';
export const MODAL_CONTAINER_SELECTOR: string = '.modal__container';
export const MODAL_CONTENT_SELECTOR: string = '.modal__content';
export const MODAL_CLOSE_BUTTON_SELECTOR: string = '.modal__close';

/**
 * Константы для хедера
 */
export const HEADER_SELECTOR: string = '.header';
export const BASKET_COUNTER_SELECTOR: string = '.header__basket-counter';

/**
 * Константы для шаблонов (template)
 */
export const TEMPLATE_SUCCESS_ID: string = '#success';
export const TEMPLATE_CARD_CATALOG_ID: string = '#card-catalog';
export const TEMPLATE_CARD_PREVIEW_ID: string = '#card-preview';
export const TEMPLATE_CARD_BASKET_ID: string = '#card-basket';
export const TEMPLATE_BASKET_ID: string = '#basket';
export const TEMPLATE_ORDER_ID: string = '#order';
export const TEMPLATE_CONTACTS_ID: string = '#contacts';

export const CATEGORY_MODIFIERS: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	кнопка: 'card__category_button',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
};
