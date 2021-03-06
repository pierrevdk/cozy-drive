import styles from '../../../styles/toolbar'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import ShareButton, { SharedByMeButton, SharedWithMeButton } from '../../../components/ShareButton'
import Alerter from '../../../components/Alerter'
import Menu, { Item } from '../../../components/Menu'

import { isSelectionBarVisible, showSelectionBar } from '../../../ducks/selection'

import { deleteAlbum, downloadAlbum } from '..'
import DestroyConfirm from '../../../components/DestroyConfirm'
import confirm from '../../../lib/confirm'
import { ShareModal, SharingDetailsModal } from 'sharing'

import classNames from 'classnames'

class AlbumToolbar extends Component {
  state = {
    showShareModal: false,
    showSharingDetailsModal: false
  }

  showShareModal = () => {
    this.setState({ showShareModal: true })
  }

  closeShareModal = () => {
    this.setState({ showShareModal: false })
  }

  showSharingDetailsModal = () => {
    this.setState({ showSharingDetailsModal: true })
  }

  closeSharingDetailsModal = () => {
    this.setState({ showSharingDetailsModal: false })
  }

  render () {
    const { t, location, album, photos, sharedWithMe, sharedByMe, sharing, disabled = false, deleteAlbum, selectItems, onRename } = this.props
    const readOnly = sharedWithMe
    return (
      <div className={styles['pho-toolbar']} role='toolbar'>
        <div className='coz-desktop'>
          {!sharedByMe && !sharedWithMe &&
            <ShareButton
              label={t('Albums.share.cta')}
              onClick={this.showShareModal} />
          }
          {sharedByMe &&
            <SharedByMeButton
              label={t('Albums.share.sharedByMe')}
              onClick={this.showShareModal} />
          }
          {sharedWithMe &&
            <SharedWithMeButton
              label={t('Albums.share.sharedWithMe')}
              onClick={this.showSharingDetailsModal} />
          }
        </div>
        <Menu
          title={t('Toolbar.more')}
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          buttonClassName={styles['pho-toolbar-more-btn']}
        >
          {!readOnly &&
            <Item>
              <a className={classNames(styles['pho-action-share'], 'coz-mobile')} onClick={this.showShareModal}>
                {t('Albums.share.cta')}
              </a>
            </Item>
          }
          <Item>
            <a className={classNames(styles['pho-action-download'])} onClick={() => downloadAlbum(album, photos)}>
              {t('Toolbar.menu.download_album')}
            </a>
          </Item>
          <Item>
            <a className={classNames(styles['pho-action-rename'])} onClick={onRename}>
              {t('Toolbar.menu.rename_album')}
            </a>
          </Item>
          {!readOnly &&
            <Item>
              <Link className={classNames(styles['pho-action-addphotos'])} to={`${location.pathname}/edit`}>
                {t('Toolbar.menu.add_photos')}
              </Link>
            </Item>
          }
          <hr className='coz-mobile' />
          <Item>
            <a className={classNames(styles['pho-action-select'], 'coz-mobile')} onClick={selectItems}>
              {t('Toolbar.menu.select_items')}
            </a>
          </Item>
          {!readOnly && <hr />}
          {!readOnly &&
            <Item>
              <a className={classNames(styles['pho-action-delete'])} onClick={() => deleteAlbum(album)}>
                {t('Toolbar.menu.album_delete')}
              </a>
            </Item>
          }
        </Menu>
        {this.state.showShareModal &&
          <ShareModal
            document={album}
            documentType='Albums'
            sharingDesc={album.name}
            onClose={this.closeShareModal}
          />}
        {this.state.showSharingDetailsModal &&
          <SharingDetailsModal
            document={album}
            documentType='Albums'
            sharingDesc={album.name}
            sharing={sharing}
            onClose={this.closeSharingDetailsModal}
          />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  disabled: isSelectionBarVisible(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  selectItems: () => dispatch(showSelectionBar()),
  deleteAlbum: album => confirm(
    <DestroyConfirm t={ownProps.t} albumName={album.name} />,
    () => dispatch(deleteAlbum(album))
      .then(() => {
        ownProps.router.replace('albums')
        Alerter.success('Albums.remove_album.success', {name: album.name})
      })
      .catch(() => Alerter.error('Albums.remove_album.error.generic'))
  )
})

export default withRouter(translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumToolbar)))
