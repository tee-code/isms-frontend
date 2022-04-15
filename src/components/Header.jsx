
function Header() {
  return (
    <div 
      id="home" className="flex gradient-bg bg-cover bg-center w-full h-screen slant text-white opacity-90 "
      >
        <div className="w-full fixed top-1 left-0 z-100 p-3 flex justify-between">
          <a href="#home" className="btn flash-button text-white shadow-md border-0">Foodie</a>
          <a href="#recipe" className="btn flash-button bg-primary text-white shadow-md border-0">Recipes</a>
  
        </div>
        <div className="m-auto text-center w-100">
          <h1 className="text-3xl font-extrabold text-whit">FOODIE</h1>
          <p className="text-2xl text-white p-3">
            A basic Food Recipe App using Spoonacular API.
          </p>
          
          <input type="text" className="border-2 outline-0 focus:border-primary border-white font-bold text-2xl text-primary rounded-2xl p-3 w-full" placeholder="search recipe"/>
        </div>
      </div>
  )
}

export default Header