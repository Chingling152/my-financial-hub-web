import CategoryApi from '../http/category-api';
import { Category } from '../interfaces/category';

export async function UseCreateCategory(category: Category, api: CategoryApi) : Promise<Category> {
  try {
    const result = await api.PostAsync(category);
    return result.data;
  } catch (error) {
    console.error(error);
    return Promise.reject();
  }
}

export async function UseUpdateCategory(category: Category, api: CategoryApi) {
  try {
    if(category.id){
      await api.PutAsync(category.id,category);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function UseGetCategories(api: CategoryApi): Promise<Category[]> {
  try {
    const accountsResult = await api.GetAllAsync();
    return accountsResult.data;
  } catch (error) {
    console.error(error);
    return Promise.reject();
  }
}

export async function UseDeleteCategory(id: string,api: CategoryApi) {
  try {
    await api.DeleteAsync(id);
  } catch (error) {
    console.error(error);
  }
}