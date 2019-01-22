/* Copyright (C) 2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import _ from 'gmp/locale';

import SeverityBar from 'web/components/bar/severitybar';

import Comment from 'web/components/comment/comment';

import ExportIcon from 'web/components/icon/exporticon';
import ListIcon from 'web/components/icon/listicon';
import SolutionType from 'web/components/icon/solutiontypeicon';
import TicketIcon from 'web/components/icon/ticketicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';

import TableRow from 'web/components/table/row';
import {goto_details, goto_list} from 'web/entity/component';
import EntityPage, {Col} from 'web/entity/page';
import withEntityContainer from 'web/entity/withEntityContainer';

import EntityCloneIcon from 'web/entity/icon/cloneicon';
import EntityTrashIcon from 'web/entity/icon/trashicon';

import {
  selector as ticketSelector,
  loadEntity as loadTicket,
} from 'web/store/entities/tickets';

import PropTypes from 'web/utils/proptypes';

import TicketComponent from './component';
import TicketDetails from './details';

import SolveIcon from './icon/solveicon';
import CloseIcon from './icon/closeicon';

const ToolBarIcons = ({
  entity,
  onTicketCloneClick,
  onTicketCloseClick,
  onTicketDeleteClick,
  onTicketDownloadClick,
  onTicketSolveClick,
}) => (
  <Divider margin="10px">
    <ListIcon
      title={_('Ticket List')}
      page="tickets"
    />
    <IconDivider>
      <EntityCloneIcon
        entity={entity}
        name="ticket"
        onClick={onTicketCloneClick}
      />
      <EntityTrashIcon
        entity={entity}
        name="ticket"
        onClick={onTicketDeleteClick}
      />
      <ExportIcon
        value={entity}
        title={_('Export Ticket as XML')}
        onClick={onTicketDownloadClick}
      />
    </IconDivider>
    <IconDivider>
      <SolveIcon
        ticket={entity}
        onClick={onTicketSolveClick}
      />
      <CloseIcon
        ticket={entity}
        onClick={onTicketCloseClick}
      />
    </IconDivider>
  </Divider>
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onTicketCloneClick: PropTypes.func.isRequired,
  onTicketCloseClick: PropTypes.func.isRequired,
  onTicketDeleteClick: PropTypes.func.isRequired,
  onTicketDownloadClick: PropTypes.func.isRequired,
  onTicketSolveClick: PropTypes.func.isRequired,
};

const Details = ({
  entity,
}) => (
  <Layout flex="column">
    <InfoTable>
      <colgroup>
        <Col width="10%"/>
        <Col width="90%"/>
      </colgroup>
      <TableBody>
        <TableRow>
          <TableData>
            {_('Name')}
          </TableData>
          <TableData>
            {entity.name}
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            <Comment>
              {_('Comment')}
            </Comment>
          </TableData>
          <TableData>
            {entity.comment}
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            {_('Severity')}
          </TableData>
          <TableData>
            <SeverityBar
              severity={entity.severity}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            {_('Status')}
          </TableData>
          <TableData>
            {entity.status}
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            {_('Assigned To')}
          </TableData>
          <TableData>
            <DetailsLink
              type="user"
              id={entity.assignedTo.user.id}
            >
              {entity.assignedTo.user.name}
            </DetailsLink>
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            {_('Solution Type')}
          </TableData>
          <TableData>
            <SolutionType
              displayTitleText
              type={entity.solutionType}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            {_('Host')}
          </TableData>
          <TableData>
            {entity.host}
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>
            {_('Location')}
          </TableData>
          <TableData>
            {entity.location}
          </TableData>
        </TableRow>
      </TableBody>
    </InfoTable>
    <TicketDetails
      entity={entity}
    />
  </Layout>
);

Details.propTypes = {
  entity: PropTypes.model.isRequired,
};

const Page = ({
  entity,
  onChanged,
  onDownloaded,
  onError,
  onInteraction,
  ...props
}) => (
  <TicketComponent
    onCloned={goto_details('ticket', props)}
    onCloneError={onError}
    onDeleted={goto_list('tickets', props)}
    onDeleteError={onError}
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInteraction={onInteraction}
    onSaved={onChanged}
  >
    {({
      clone,
      close,
      delete: deleteFunc,
      download,
      edit,
      solve,
    }) => (
      <EntityPage
        {...props}
        entity={entity}
        sectionIcon={<TicketIcon size="large"/>}
        title={_('Ticket')}
        toolBarIcons={ToolBarIcons}
        onChanged={onChanged}
        onError={onError}
        onInteraction={onInteraction}
        onTicketCloneClick={clone}
        onTicketCloseClick={close}
        onTicketDeleteClick={deleteFunc}
        onTicketDownloadClick={download}
        onTicketEditClick={edit}
        onTicketSolveClick={solve}
      >
        {({
          activeTab = 0,
          onActivateTab,
        }) => (
          <Layout grow="1" flex="column">
            <TabLayout
              grow="1"
              align={['start', 'end']}
            >
              <TabList
                active={activeTab}
                align={['start', 'stretch']}
                onActivateTab={onActivateTab}
              >
                <Tab>
                  {_('Information')}
                </Tab>
              </TabList>
            </TabLayout>

            <Tabs active={activeTab}>
              <TabPanels>
                <TabPanel>
                  <Details
                    entity={entity}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Layout>
        )}
      </EntityPage>
    )}
  </TicketComponent>
);

export default withEntityContainer('ticket', {
  load: loadTicket,
  entitySelector: ticketSelector,
})(Page);

// vim: set ts=2 sw=2 tw=80:
