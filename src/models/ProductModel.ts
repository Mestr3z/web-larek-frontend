import { IProduct, IProductListResponse, IApiClient } from '../types';

export class ProductModel {
  public products: IProduct[] = [];
  private apiClient: IApiClient;

  /**
   * Конструктор модели продуктов.
   * @param apiClient - экземпляр API-клиента, используемый для загрузки товаров.
   */
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Загружает список товаров с сервера и сохраняет их в свойстве products.
   */
  async fetchProducts(): Promise<void> {
    try {
      const response = await this.apiClient.get('/product/');
      const data = response as IProductListResponse;
      this.products = data.items;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Возвращает товар по заданному идентификатору.
   * @param id - идентификатор товара.
   */
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }
}
