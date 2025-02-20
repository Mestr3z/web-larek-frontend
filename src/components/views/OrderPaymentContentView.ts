import { OrderModel } from '../../models/OrderModel';

export class OrderPaymentContentView {
  private contentElement: HTMLElement;
  private orderModel: OrderModel;
  private onNext: () => void;
  private nextButton: HTMLButtonElement | null = null;

  /**
   * Конструктор принимает:
   * @param templateId - id шаблона
   * @param onNext - колбэк, вызываемый при успешном прохождении шага (когда данные валидны)
   * @param orderModel - экземпляр OrderModel для установки данных и валидации
   */
  constructor(templateId: string, onNext: () => void, orderModel: OrderModel) {
    this.onNext = onNext;
    this.orderModel = orderModel;
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) {
      throw new Error(`OrderPaymentContentView: не найден`);
    }
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const element = clone.firstElementChild as HTMLElement;
    if (!element) {
      throw new Error(`OrderPaymentContentView: не найден`);
    }
    this.contentElement = element;
  }

  render(): void {
    const btnOnline = this.contentElement.querySelector('button[name="card"]') as HTMLButtonElement;
    const btnCash = this.contentElement.querySelector('button[name="cash"]') as HTMLButtonElement;
    const addressInput = this.contentElement.querySelector('input[name="address"]') as HTMLInputElement;
    this.nextButton = this.contentElement.querySelector('button.order__button') as HTMLButtonElement;

    if (this.nextButton) {
      this.nextButton.disabled = true;
      this.nextButton.addEventListener('click', () => {
        if (this.orderModel.validateStep1()) {
          this.onNext();
        }
      });
    }

    btnOnline.addEventListener('click', () => {
      this.orderModel.setPayment('online');
      btnOnline.classList.add('button_alt-active');
      btnCash.classList.remove('button_alt-active');
      this.validate();
    });

    btnCash.addEventListener('click', () => {
      this.orderModel.setPayment('cash');
      btnCash.classList.add('button_alt-active');
      btnOnline.classList.remove('button_alt-active');
      this.validate();
    });

    addressInput.addEventListener('input', () => {
      this.orderModel.setAddress(addressInput.value);
      this.validate();
    });
  }

  private validate(): void {
    if (this.nextButton) {
      this.nextButton.disabled = !this.orderModel.validateStep1();
    }
  }

  getContent(): HTMLElement {
    return this.contentElement;
  }
}
