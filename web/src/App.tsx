import { useState } from 'react';
import { ChefHat, Download, Loader2 } from 'lucide-react';
import { fetchRandomMeals, Recipe } from './api';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importRecipes = async () => {
    try {
      setImporting(true);
      setError(null);
      
      // Fetch random meals from TheMealDB API
      const newRecipes = await fetchRandomMeals(8);
      
      if (newRecipes.length === 0) {
        throw new Error('No recipes were fetched from the API');
      }

      // Add to existing recipes (in a real app, you might store these in localStorage or a backend)
      setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);
      
    } catch (err) {
      console.error('Error importing recipes:', err);
      setError('Failed to import recipes');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <ChefHat size={32} className="header-icon" />
          <h1>Recipe Collection</h1>
          <button 
            onClick={importRecipes} 
            disabled={importing}
            className="import-btn"
          >
            {importing ? (
              <>
                <Loader2 size={16} className="spinning" />
                Importing...
              </>
            ) : (
              <>
                <Download size={16} />
                Import Recipes
              </>
            )}
          </button>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="empty">
            <ChefHat size={48} className="empty-icon" />
            <h2>No recipes yet</h2>
            <p>Click "Import Recipes" to get started!</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                {recipe.image_url && (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.name}
                    className="recipe-image"
                    loading="lazy"
                  />
                )}
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="recipe-description">{recipe.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;