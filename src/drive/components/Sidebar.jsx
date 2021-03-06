import styles from '../styles/sidebar'

import React from 'react'

import Nav from '../containers/Nav'
import ButtonClient from '../../layout/pushClient/Button'

const Sidebar = () => (
  <aside class={styles['fil-sidebar']}>
    <Nav />
    <ButtonClient />
  </aside>
)

export default Sidebar
