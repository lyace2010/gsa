/* Copyright (C) 2017-2021 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React, {useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';

import _ from 'gmp/locale';
import {hasValue} from 'gmp/utils/identity';

import Filter from 'gmp/models/filter';

import {permissionsResourceFilter} from 'web/entity/withEntityContainer';

import ExportIcon from 'web/components/icon/exporticon';
import VulnerabilityIcon from 'web/components/icon/vulnerabilityicon';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';
import NewNoteIcon from 'web/components/icon/newnoteicon';
import NewOverrideIcon from 'web/components/icon/newoverrideicon';
import NvtIcon from 'web/components/icon/nvticon';
import ResultIcon from 'web/components/icon/resulticon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';
import PageTitle from 'web/components/layout/pagetitle';

import Link from 'web/components/link/link';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';
import useEntityReloadInterval from 'web/entity/useEntityReloadInterval';
import useExportEntity from 'web/entity/useExportEntity';

import DetailsBlock from 'web/entity/block';
import Note from 'web/entity/note';
import Override from 'web/entity/override';
import EntityPage from 'web/entity/page';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';

import {useLazyGetNotes} from 'web/graphql/notes';
import {useLazyGetOverrides} from 'web/graphql/overrides';

import {useGetPermissions} from 'web/graphql/permissions';

import PropTypes from 'web/utils/proptypes';

import useDownload from 'web/components/form/useDownload';
import useDialogNotification from 'web/components/notification/useDialogNotification';
import useReload from 'web/components/loading/useReload';
import DialogNotification from 'web/components/notification/dialognotification';
import Download from 'web/components/form/download';

import useCapabilities from 'web/utils/useCapabilities';
import useGmpSettings from 'web/utils/useGmpSettings';
import useUserSessionTimeout from 'web/utils/useUserSessionTimeout';
import {useGetNvt, useExportNvtsByIds} from 'web/graphql/nvts';

import NvtComponent from './component';
import NvtDetails from './details';
import Preferences from './preferences';

export const ToolBarIcons = ({
  entity,
  onNoteCreateClick,
  onNvtDownloadClick,
  onOverrideCreateClick,
}) => {
  const capabilities = useCapabilities();
  return (
    <Divider margin="10px">
      <IconDivider>
        <ManualIcon
          page="managing-secinfo"
          anchor="network-vulnerability-tests-nvt"
          title={_('Help: NVTs')}
        />
        <ListIcon title={_('NVT List')} page="nvts" />
      </IconDivider>
      <IconDivider>
        <ExportIcon
          value={entity}
          title={_('Export NVT')}
          onClick={onNvtDownloadClick}
        />
      </IconDivider>
      <IconDivider>
        {capabilities.mayCreate('note') && (
          <NewNoteIcon
            title={_('Add new Note')}
            entity={entity}
            onClick={onNoteCreateClick}
          />
        )}
        {capabilities.mayCreate('override') && (
          <NewOverrideIcon
            title={_('Add new Override')}
            entity={entity}
            onClick={onOverrideCreateClick}
          />
        )}
      </IconDivider>

      <IconDivider>
        {capabilities.mayAccess('results') && (
          <Link to="results" filter={'nvt=' + entity.id}>
            <ResultIcon title={_('Corresponding Results')} />
          </Link>
        )}
        {capabilities.mayAccess('vulns') && (
          <Link to="vulnerabilities" filter={'uuid=' + entity.id}>
            <VulnerabilityIcon title={_('Corresponding Vulnerabilities')} />
          </Link>
        )}
      </IconDivider>
    </Divider>
  );
};

ToolBarIcons.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  entity: PropTypes.model.isRequired,
  onNoteCreateClick: PropTypes.func.isRequired,
  onNvtDownloadClick: PropTypes.func.isRequired,
  onOverrideCreateClick: PropTypes.func.isRequired,
};

// ToolBarIcons = withCapabilities(ToolBarIcons);

const Details = ({entity, notes = [], overrides = []}) => {
  overrides = overrides.filter(override => override.isActive());
  notes = notes.filter(note => note.isActive());

  return (
    <Layout flex="column">
      <NvtDetails entity={entity} />

      {overrides.length > 0 && (
        <DetailsBlock id="overrides" title={_('Overrides')}>
          <Divider wrap align={['start', 'stretch']} width="15px">
            {overrides.map(override => (
              <Override key={override.id} override={override} />
            ))}
          </Divider>
        </DetailsBlock>
      )}

      {notes.length > 0 && (
        <DetailsBlock id="notes" title={_('Notes')}>
          <Divider wrap align={['start', 'stretch']} width="15px">
            {notes.map(note => (
              <Note key={note.id} note={note} />
            ))}
          </Divider>
        </DetailsBlock>
      )}
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
  notes: PropTypes.array,
  overrides: PropTypes.array,
};

const open_dialog = (nvt, func) => {
  func({
    fixed: true,
    nvt,
    id: nvt.id,
  });
};

const Page = () => {
  // Page methods
  const {id} = useParams();
  const gmpSettings = useGmpSettings();
  const history = useHistory();
  const [, renewSessionTimeout] = useUserSessionTimeout();

  const [downloadRef, handleDownload] = useDownload();
  const {
    dialogState: notificationDialogState,
    closeDialog: closeNotificationDialog,
    showError,
  } = useDialogNotification();

  // Load nvt related entities
  const {nvt, refetch: refetchAll, loading, error: entityError} = useGetNvt(id);

  const {permissions = [], refetch: refetchPermissions} = useGetPermissions({
    filterString: permissionsResourceFilter(id).toFilterString(),
  });

  const [loadNotes, {notes}] = useLazyGetNotes({
    filterString: 'nvt_id:' + id,
  });

  const [loadOverrides, {overrides}] = useLazyGetOverrides({
    filterString: 'nvt_id:' + id,
  });

  // NVT related mutations
  const exportEntity = useExportEntity();
  const exportNvt = useExportNvtsByIds();

  // NVT methods
  const handleDownloadNvt = exportedNvt => {
    exportEntity({
      entity: exportedNvt,
      exportFunc: exportNvt,
      resourceType: 'nvts',
      onDownload: handleDownload,
      showError,
    });
  };

  // Timeout and reload
  const timeoutFunc = useEntityReloadInterval(nvt);

  const [startReload, stopReload, hasRunningTimer] = useReload(
    refetchAll,
    timeoutFunc,
  );

  useEffect(() => {
    // start reloading if alert is available and no timer is running yet
    if (hasValue(nvt) && !hasRunningTimer) {
      startReload();
    }
  }, [nvt, startReload]); // eslint-disable-line react-hooks/exhaustive-deps

  // stop reload on unmount
  useEffect(() => stopReload, [stopReload]);

  // Load notes and overrides
  useEffect(() => {
    loadNotes();
    loadOverrides();
  }, [id]);

  return (
    <NvtComponent
      onChanged={refetchAll}
      onDownloaded={handleDownload}
      onDownloadError={showError}
      onInteraction={renewSessionTimeout}
    >
      {({notecreate, overridecreate, download}) => (
        <EntityPage
          entity={nvt}
          isLoading={loading}
          notes={notes}
          overrides={overrides}
          sectionIcon={<NvtIcon size="large" />}
          title={_('NVT')}
          toolBarIcons={ToolBarIcons}
          onChanged={refetchAll}
          onInteraction={renewSessionTimeout}
          onNoteCreateClick={notecreate}
          onNvtDownloadClick={handleDownloadNvt}
          onOverrideCreateClick={overridecreate}
        >
          {({activeTab = 0, onActivateTab}) => {
            return (
              <React.Fragment>
                <PageTitle title={_('NVT: {{name}}', {name: nvt.name})} />
                <Layout grow="1" flex="column">
                  <TabLayout grow="1" align={['start', 'end']}>
                    <TabList
                      active={activeTab}
                      align={['start', 'stretch']}
                      onActivateTab={onActivateTab}
                    >
                      <Tab>{_('Information')}</Tab>
                      <EntitiesTab count={nvt.preferenceCount}>
                        {_('Preferences')}
                      </EntitiesTab>
                      <EntitiesTab entities={nvt.userTags}>
                        {_('User Tags')}
                      </EntitiesTab>
                    </TabList>
                  </TabLayout>

                  <Tabs active={activeTab}>
                    <TabPanels>
                      <TabPanel>
                        <Details
                          notes={notes}
                          overrides={overrides}
                          entity={nvt}
                        />
                      </TabPanel>
                      <TabPanel>
                        <Preferences
                          preferences={nvt.preferences}
                          defaultTimeout={nvt.defaultTimeout}
                        />
                      </TabPanel>
                      <TabPanel>
                        <EntityTags
                          entity={nvt}
                          onChanged={() => refetchAll()}
                          onError={showError}
                          onInteraction={renewSessionTimeout}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Layout>
                <DialogNotification
                  {...notificationDialogState}
                  onCloseClick={closeNotificationDialog}
                />
                <Download ref={downloadRef} />
              </React.Fragment>
            );
          }}
        </EntityPage>
      )}
    </NvtComponent>
  );
};

export default Page;

// vim: set ts=2 sw=2 tw=80:
