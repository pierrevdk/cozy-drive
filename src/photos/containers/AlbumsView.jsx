import React, { Component } from 'react'
import { cozyConnect } from 'redux-cozy-client'
import styles from '../styles/layout'

import { AlbumsToolbar, fetchAlbums, fetchAlbumsSharings } from '../ducks/albums'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import Topbar from '../components/Topbar'

const Content = ({ list, sharedByMe, sharedWithMe }) => {
  const { fetchStatus, data } = list
  switch (fetchStatus) {
    case 'pending':
    case 'loading':
      return <Loading loadingType='albums_fetching' />
    case 'failed':
      return <ErrorComponent errorType='albums' />
    default:
      return <AlbumsList albums={data} sharedByMe={sharedByMe} sharedWithMe={sharedWithMe} />
  }
}

export class AlbumsView extends Component {
  render () {
    if (this.props.children) return this.props.children
    if (!this.props.albums) {
      return null
    }

    return (
      <div className={styles['pho-content-wrapper']}>
        <Topbar viewName='albums'>
          <AlbumsToolbar />
        </Topbar>
        <Content list={this.props.albums} />
      </div>
    )
  }
}

const mapDocumentsToProps = (ownProps) => ({
  albums: fetchAlbums(),
  sharings: fetchAlbumsSharings()
})

export default cozyConnect(mapDocumentsToProps)(AlbumsView)
