import React from 'react'

class WeekSelect extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      filter: this.props.filter
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
  }
  
  handleFilterChange(event) {
    this.setState({filter: event.target.value})
    this.props.handleChange(event.target.value)
  }

  render() {
    return (
      <select className='select-box' onChange={this.handleFilterChange} value={this.state.filter}>
        <option value=''>Select a Week</option>
        <option value="current">This Week</option>
        <option value="last">Last Week</option>
        <option value="next">Next Week</option>
      </select>
    )
  }
}

export default WeekSelect