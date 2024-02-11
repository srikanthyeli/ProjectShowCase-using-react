import './index.css'

const CategoryItem = props => {
  const {itemDetails} = props
  const {name, imageUrl} = itemDetails
  return (
    <>
      <li className="list-container">
        <img src={imageUrl} alt={name} />
        <p className="para">{name}</p>
      </li>
    </>
  )
}
export default CategoryItem
