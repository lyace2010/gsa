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

/* eslint-disable react/prop-types */
import React from 'react';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from '../../utils/proptypes.js';

import FormGroup from '../form/formgroup.js';
import Select from 'web/components/form/select';

const TaskTrendGroup = ({trend, name = 'trend', filter, onChange}) => {
  if (!isDefined(trend) && isDefined(filter)) {
    trend = filter.get('trend');
  }
  return (
    <FormGroup title={_('Trend')}>
      <Select
        name={name}
        value={trend}
        onChange={onChange}
        items={[
          {label: _('Up'), value: 'up'},
          {label: _('Down'), value: 'down'},
          {label: _('More'), value: 'more'},
          {label: _('Less'), value: 'less'},
          {label: _('Same'), value: 'same'},
        ]}
      />
    </FormGroup>
  );
};

TaskTrendGroup.propTypes = {
  filter: PropTypes.filter.isRequired,
  name: PropTypes.string,
  trend: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TaskTrendGroup;
