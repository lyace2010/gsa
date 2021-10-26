/* Copyright (C) 2018-2020 Greenbone Networks GmbH
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
import React from 'react';

import PropTypes from '../../utils/proptypes.js';

const BlankLink = ({to, children, ...props}) => (
  <a
    {...props}
    href={to}
    target="_blank"
    rel="noopener noreferrer" // https://mathiasbynens.github.io/rel-noopener
  >
    {children}
  </a>
);

BlankLink.propTypes = {
  to: PropTypes.string,
};

export default BlankLink;

// vim: set ts=2 sw=2 tw=80: