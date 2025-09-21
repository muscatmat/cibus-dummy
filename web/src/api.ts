// API client for TheMealDB
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://www.themealdb.com/api/json/v1/1';

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at?: string;
}

export interface MealApiResponse {
  meals: {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
    strMealThumb: string;
  }[] | null;
}

export const fetchRandomMeals = async (count = 10): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/random.php`);
      if (!response.ok) throw new Error('Failed to fetch meal');
      
      const data: MealApiResponse = await response.json();
      if (data.meals && data.meals[0]) {
        const meal = data.meals[0];
        recipes.push({
          id: meal.idMeal,
          name: meal.strMeal,
          description: meal.strInstructions.substring(0, 200) + '...',
          image_url: meal.strMealThumb
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch meal ${i + 1}:`, error);
    }
  }
  
  return recipes;
};

export const searchMealsByName = async (query: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search meals');
    
    const data: MealApiResponse = await response.json();
    if (!data.meals) return [];
    
    return data.meals.map(meal => ({
      id: meal.idMeal,
      name: meal.strMeal,
      description: meal.strInstructions.substring(0, 200) + '...',
      image_url: meal.strMealThumb
    }));
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
};