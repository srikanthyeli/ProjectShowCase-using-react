import {Component} from 'react'
import Loader from 'react-loader-spinner'
import CategoryItem from '../CategoryItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]
const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    projectList: [],
    activeOptionId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductList()
  }

  onChangeOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getProductList)
    console.log(event.target.value)
  }

  getProductList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updateData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectList: updateData,
        apiStatus: apiStatusConstants.success,
      })
      console.log(updateData)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getProductList()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="btn-1" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectList} = this.state
    return (
      <ul className="project-container">
        {projectList.map(eachProject => (
          <CategoryItem itemDetails={eachProject} key={eachProject.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" width={50} height={50} />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <ul className="category-container">
          <select
            value={activeOptionId}
            onChange={this.onChangeOption}
            className="select-container"
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </ul>
        {this.renderView()}
      </div>
    )
  }
}
export default Home
