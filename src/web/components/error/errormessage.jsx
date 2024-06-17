/* Copyright (C) 2018-2022 Greenbone AG
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

import {isDefined} from 'gmp/utils/identity';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import {AlertCircle} from 'lucide-react';
import Theme from 'web/utils/theme';

import PropTypes from 'web/utils/proptypes';

import ErrorContainer from './errorcontainer';

const ErrorMessage = ({
  message,
  details,
  children,
  'data-testid': dataTestId,
  ...props
}) => (
  <ErrorContainer data-testid={dataTestId}>
    <Divider margin="20px" flex="column" align={['center', 'center']} grow>
      <AlertCircle size="24" color={Theme.darkRed} />
      <Layout flex="column" align={['center', 'center']} {...props}>
        <b data-testid="error-message">{message}</b>
        <Divider margin="20px" flex="row" align={['center', 'start']} grow>
          {isDefined(details) && (
            <div>
              <span data-testid="error-details">{details}</span>
            </div>
          )}
        </Divider>
        {children}
      </Layout>
    </Divider>
  </ErrorContainer>
);

ErrorMessage.propTypes = {
  'data-testid': PropTypes.string,
  details: PropTypes.string,
  message: PropTypes.string,
};

export default ErrorMessage;
