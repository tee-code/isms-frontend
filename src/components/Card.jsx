function Card(props) {
    const { recipe } = props;
  return (
    <div key={recipe.id} className="rounded-md shadow-2xl border-2 p-2">
        <img src={recipe.image} alt="" className="w-full" />
        <h1 className="text-xl p-2 capitalize h-24">{recipe.title}</h1>
        <a href="" className="animate-shake btn text-white">More Information</a>
    </div>
  )
}

export default Card