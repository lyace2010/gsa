/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {_, _l} from 'gmp/locale/lang';

import {RESULTS_FILTER_FILTER} from 'gmp/models/filter';

import CvssDisplay from 'web/components/dashboard/display/cvss/cvssdisplay';
import CvssTableDisplay from 'web/components/dashboard/display/cvss/cvsstabledisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {ResultsSeverityLoader} from './loaders';

export const ResultsCvssDisplay = createDisplay({
  loaderComponent: ResultsSeverityLoader,
  displayComponent: CvssDisplay,
  yLabel: _l('# of Results'),
  title: ({data: tdata}) =>
    _('Results by CVSS (Total: {{count}})', {count: tdata.total}),
  displayId: 'result-by-cvss',
  displayName: 'ResultsCvssDisplay',
  filtersFilter: RESULTS_FILTER_FILTER,
});

export const ResultsCvssTableDisplay = createDisplay({
  loaderComponent: ResultsSeverityLoader,
  displayComponent: CvssTableDisplay,
  dataTitles: [_l('Severity'), _l('# of Results')],
  title: ({data: tdata}) =>
    _('Results by CVSS (Total: {{count}})', {count: tdata.total}),
  displayId: 'result-by-cvss-table',
  displayName: 'ResultsCvssTableDisplay',
  filtersFilter: RESULTS_FILTER_FILTER,
});

registerDisplay(ResultsCvssDisplay.displayId, ResultsCvssDisplay, {
  title: _l('Chart: Results by CVSS'),
});

registerDisplay(ResultsCvssTableDisplay.displayId, ResultsCvssTableDisplay, {
  title: _l('Table: Results by CVSS'),
});

// vim: set ts=2 sw=2 tw=80:
