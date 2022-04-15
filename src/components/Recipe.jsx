import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

function Recipe() {

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        getRecipe();
    }, []);

    const key = process.env.REACT_APP_SPOONACULAR_API_KEY;

    const loadRecipes = localStorage.getItem('recipes');

    const getRecipe = async () => {

        if(loadRecipes){
            setRecipes(JSON.parse(loadRecipes));
        }else{
            const result = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${key}&number=100`);
        
            setRecipes(result.data.recipes);

            localStorage.setItem("recipes", JSON.stringify(result.data.recipes));
        }

        
        
    }

  return (
      <div id="recipe" className='w-10/12 mx-auto mb-5'>
             <div className='my-5 bg-secondary text-white text-center shadow-md btn flash-button p-3 rounded-2xl'>Random Recipes</div>
                <div className="grid w-100 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {
                    recipes.map((recipe, index) => {
                        return(
                            <Card recipe={recipe} />
                        )
                   
                })
            }   
                </div>
             
      </div>
   
  )
}

export default Recipe