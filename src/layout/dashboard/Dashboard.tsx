import React from 'react'
import Content from '../../Pages/content/Content'
import SideBar from '../../Pages/sidebar/SideBar'

const Dashboard = () => {
  return (
    <div>
        <div>
            <SideBar/>
        </div>
        <div>
            <Content/>
        </div>
    </div>
  )
}

export default Dashboard