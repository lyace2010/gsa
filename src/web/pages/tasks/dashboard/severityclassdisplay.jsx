/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {_, _l} from 'gmp/locale/lang';

import {TASKS_FILTER_FILTER} from 'gmp/models/filter';

import SeverityClassDisplay from 'web/components/dashboard/display/severity/severityclassdisplay'; // eslint-disable-line max-len
import SeverityClassTableDisplay from 'web/components/dashboard/display/severity/severityclasstabledisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {TasksSeverityLoader} from './loaders';

export const TasksSeverityDisplay = createDisplay({
  displayComponent: SeverityClassDisplay,
  loaderComponent: TasksSeverityLoader,
  title: ({data: tdata}) =>
    _('Tasks by Severity Class (Total: {{count}})', {count: tdata.total}),
  displayId: 'task-by-severity-class',
  displayName: 'TasksSeverityDisplay',
  filtersFilter: TASKS_FILTER_FILTER,
});

export const TasksSeverityTableDisplay = createDisplay({
  displayComponent: SeverityClassTableDisplay,
  loaderComponent: TasksSeverityLoader,
  dataTitles: [_l('Severity'), _l('# of Tasks')],
  title: ({data: tdata}) =>
    _('Tasks by Severity Class (Total: {{count}})', {count: tdata.total}),
  displayId: 'task-by-severity-class-table',
  displayName: 'TasksSeverityTableDisplay',
  filtersFilter: TASKS_FILTER_FILTER,
});

registerDisplay(
  TasksSeverityTableDisplay.displayId,
  TasksSeverityTableDisplay,
  {
    title: _l('Table: Tasks by Severity Class'),
  },
);

registerDisplay(TasksSeverityDisplay.displayId, TasksSeverityDisplay, {
  title: _l('Chart: Tasks by Severity Class'),
});

// vim: set ts=2 sw=2 tw=80:
