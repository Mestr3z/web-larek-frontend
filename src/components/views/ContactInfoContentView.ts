import { OrderModel } from '../../models/OrderModel';

export class ContactInfoContentView {
  private contentElement: HTMLElement;
  private submitHandler: (email: string, phone: string) => void;
  private orderModel: OrderModel;
  private submitButton: HTMLButtonElement | null = null;
  
  /**
   * Конструктор принимает:
   * @param contentSelector - id шаблона
   * @param submitHandler - функция, вызываемая при клике на кнопку "Оплатить"
   * @param orderModel - экземпляр OrderModel для работы с контактными данными
   */
  constructor(
    contentSelector: string, 
    submitHandler: (email: string, phone: string) => void, 
    orderModel: OrderModel
  ) {
    this.orderModel = orderModel;
    const template = document.getElementById(contentSelector) as HTMLTemplateElement;
    if (!template) {
      throw new Error(`ContactInfoContentView: не найдено`);
    }
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const element = clone.firstElementChild as HTMLElement;
    if (!element) {
      throw new Error(`ContactInfoContentView: не найдено`);
    }
    this.contentElement = element;
    this.submitHandler = submitHandler;
  }
  
  render(): void {
    const emailInput = this.contentElement.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = this.contentElement.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = this.contentElement.querySelector('button') as HTMLButtonElement;
    
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
    
    emailInput.addEventListener('input', () => {
      // Записываем контактные данные в модель
      this.orderModel.setContacts(emailInput.value, phoneInput.value);
      this.validate();
    });
    
    phoneInput.addEventListener('input', () => {
      this.orderModel.setContacts(emailInput.value, phoneInput.value);
      this.validate();
    });
    
    // Добавляем обработчик клика на кнопку "Оплатить"
    if (this.submitButton) {
      this.submitButton.addEventListener('click', () => {
        if (this.orderModel.validateStep2()) {
          this.submitHandler(
            this.orderModel.getOrderData()?.email || '',
            this.orderModel.getOrderData()?.phone || ''
          );
        }
      });
    }
    
    // Предотвращаем сабмит формы, если он случится
    const form = this.contentElement.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  }
  
  private validate(): void {
    if (this.submitButton) {
      // Кнопка становится активной, если модель валидна по контактным данным
      this.submitButton.disabled = !this.orderModel.validateStep2();
    }
  }
  
  getContent(): HTMLElement {
    return this.contentElement;
  }
}
