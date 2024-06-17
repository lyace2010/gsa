/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import styled from 'styled-components';

import Theme from 'web/utils/theme';

import Layout from 'web/components/layout/layout';

const ErrorContainer = styled(Layout)`
  padding: 15px;
  margin: 15px 15px 15px 15px;
  border: 1px solid ${Theme.mediumLightRed};
  background-color: ${Theme.lightRed};
`;

export default ErrorContainer;
